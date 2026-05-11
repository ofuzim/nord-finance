'use server'

import { createServiceClient } from '@/lib/supabase/server'
import { generateReferenceNumber } from '@/lib/reference'
import { sendApplicationConfirmation } from '@/lib/email'
import type { DocumentType } from '@/types/database'

const docTypeMap: Record<string, DocumentType> = {
  governmentId: 'government_id',
  passport: 'passport_photo',
  bankStatement: 'bank_statement',
  payslip: 'payslip',
  residence: 'proof_of_residence',
}

type UploadedFile = {
  storagePath: string
  fileName: string
  fileSize: number
  mimeType: string
}

// Generate a signed upload URL so the browser uploads directly to Supabase Storage
// (avoids Next.js body size limits — no file data passes through the server)
export async function getDocumentUploadUrl(fieldName: string, ext: string): Promise<
  { signedUrl: string; storagePath: string } | { error: string }
> {
  try {
    const service = await createServiceClient()
    const sessionId = Date.now().toString(36) + Math.random().toString(36).slice(2)
    const path = `uploads/${sessionId}/${fieldName}.${ext}`

    const { data, error } = await service.storage
      .from('application-documents')
      .createSignedUploadUrl(path)

    if (error) return { error: error.message }
    if (!data?.signedUrl) return { error: 'Failed to generate upload URL' }
    return { signedUrl: data.signedUrl, storagePath: path }
  } catch (err) {
    return { error: String(err) }
  }
}

export async function lookupApplicationByReference(referenceNumber: string): Promise<
  { id: string; referenceNumber: string; status: string; firstName: string | null; lastName: string | null; vehicleModel: string | null; submittedAt: string | null; createdAt: string } | { error: string }
> {
  try {
    const service = await createServiceClient()
    const { data, error } = await service
      .from('applications')
      .select('id, reference_number, status, first_name, last_name, vehicle_model, submitted_at, created_at')
      .eq('reference_number', referenceNumber.trim().toUpperCase())
      .neq('status', 'draft')
      .single()
    if (error) return { error: 'Application not found. Please check your reference number.' }
    return {
      id: data.id,
      referenceNumber: data.reference_number,
      status: data.status,
      firstName: data.first_name,
      lastName: data.last_name,
      vehicleModel: data.vehicle_model,
      submittedAt: data.submitted_at,
      createdAt: data.created_at,
    }
  } catch (err) {
    return { error: String(err) }
  }
}

export async function getDraftApplication(id: string): Promise<
  { fields: Record<string, string>; step: number } | { error: string }
> {
  try {
    const service = await createServiceClient()
    const { data, error } = await service
      .from('applications')
      .select('*')
      .eq('id', id)
      .single()
    if (error) return { error: error.message }
    const fields: Record<string, string> = {}
    const s = (v: unknown) => (v != null ? String(v) : '')
    fields.title = s(data.title)
    fields.firstName = s(data.first_name)
    fields.lastName = s(data.last_name)
    fields.otherNames = s(data.other_names)
    fields.gender = s(data.gender)
    fields.dateOfBirth = s(data.date_of_birth)
    fields.maritalStatus = s(data.marital_status)
    fields.numChildren = s(data.number_of_children)
    fields.stateOfOrigin = s(data.state_of_origin)
    fields.lgaOfOrigin = s(data.lga_of_origin)
    fields.phoneNumber = s(data.phone_number)
    fields.emailAddress = s(data.email)
    fields.homeAddress = s(data.home_address)
    fields.landmark = s(data.landmark)
    fields.stateOfResidence = s(data.state_of_residence)
    fields.lgaOfResidence = s(data.lga_of_residence)
    fields.residentialStatus = s(data.residential_status)
    fields.occupation = s(data.occupation)
    fields.employerName = s(data.employer_name)
    fields.officeAddress = s(data.office_address)
    fields.employmentType = s(data.employment_type)
    fields.idType = s(data.id_type)
    fields.idNumber = s(data.id_number)
    fields.idExpiry = s(data.id_expiry_date)
    fields.nin = s(data.nin)
    fields.bvn = s(data.bvn)
    fields.vehicleCategory = s(data.vehicle_category)
    fields.vehicleModel = s(data.vehicle_model)
    return { fields, step: data.current_step ?? 1 }
  } catch (err) {
    return { error: String(err) }
  }
}

function buildApplicationFields(values: Record<string, string>) {
  return {
    title: values.title || null,
    first_name: values.firstName || null,
    last_name: values.lastName || null,
    other_names: values.otherNames || null,
    gender: values.gender || null,
    date_of_birth: values.dateOfBirth || null,
    marital_status: values.maritalStatus || null,
    number_of_children: parseInt(values.numChildren ?? '0', 10) || 0,
    state_of_origin: values.stateOfOrigin || null,
    lga_of_origin: values.lgaOfOrigin || null,
    phone_number: values.phoneNumber || null,
    email: values.emailAddress || null,
    home_address: values.homeAddress || null,
    landmark: values.landmark || null,
    state_of_residence: values.stateOfResidence || null,
    lga_of_residence: values.lgaOfResidence || null,
    residential_status: values.residentialStatus || null,
    occupation: values.occupation || null,
    employer_name: values.employerName || null,
    office_address: values.officeAddress || null,
    employment_type: values.employmentType || null,
    id_type: values.idType || null,
    id_number: values.idNumber || null,
    id_expiry_date: values.idExpiry || null,
    nin: values.nin || null,
    bvn: values.bvn || null,
    vehicle_category: values.vehicleCategory || null,
    vehicle_model: values.vehicleModel || null,
  }
}

// Create a draft or update an existing draft application record
export async function saveDraftApplication({
  values,
  applicationId,
}: {
  values: Record<string, string>
  applicationId: string | null
}): Promise<{ id: string; referenceNumber: string } | { error: string }> {
  try {
    const service = await createServiceClient()
    const fields = buildApplicationFields(values)

    if (applicationId) {
      const { error } = await service.from('applications').update(fields).eq('id', applicationId)
      if (error) return { error: error.message }
      const { data: app } = await service.from('applications').select('reference_number').eq('id', applicationId).single()
      return { id: applicationId, referenceNumber: app!.reference_number }
    }

    let referenceNumber = generateReferenceNumber()
    for (let i = 0; i < 5; i++) {
      const { data: existing } = await service.from('applications').select('id').eq('reference_number', referenceNumber).maybeSingle()
      if (!existing) break
      referenceNumber = generateReferenceNumber()
    }

    const { data: app, error } = await service
      .from('applications')
      .insert({ ...fields, reference_number: referenceNumber, status: 'draft', current_step: 1 })
      .select('id')
      .single()

    if (error) return { error: error.message }
    return { id: app.id, referenceNumber }
  } catch (err) {
    return { error: String(err) }
  }
}

// Finalize a draft: set status to submitted, insert documents, and link credit score.
export async function finalizeApplication({
  applicationId,
  creditScoreId,
  fileUploads,
}: {
  applicationId: string
  creditScoreId: string | null
  fileUploads: Record<string, UploadedFile>
}): Promise<{ referenceNumber: string } | { error: string }> {
  try {
    const service = await createServiceClient()

    const { data: app, error } = await service
      .from('applications')
      .update({ status: 'submitted', submitted_at: new Date().toISOString(), current_step: 4 })
      .eq('id', applicationId)
      .select('reference_number')
      .single()

    if (error) return { error: error.message }

    const docInserts = Object.entries(fileUploads).map(([fieldName, file]) => ({
      application_id: applicationId,
      document_type: (docTypeMap[fieldName] ?? 'government_id') as DocumentType,
      storage_path: file.storagePath,
      file_name: file.fileName,
      file_size: file.fileSize,
      mime_type: file.mimeType,
    }))

    if (docInserts.length > 0) {
      await service.from('documents').insert(docInserts)
    }

    if (creditScoreId) {
      await service.from('credit_scores').update({ application_id: applicationId }).eq('id', creditScoreId)
    }

    return { referenceNumber: app.reference_number }
  } catch (err) {
    return { error: String(err) }
  }
}

export async function sendApplicationConfirmationEmail({
  applicationId,
}: {
  applicationId: string
}): Promise<{ success: true } | { error: string }> {
  try {
    const service = await createServiceClient()
    const { data: app, error } = await service
      .from('applications')
      .select('reference_number, email, first_name')
      .eq('id', applicationId)
      .single()

    if (error) return { error: error.message }

    await sendApplicationConfirmation({
      to: app.email,
      firstName: app.first_name,
      referenceNumber: app.reference_number,
    })

    return { success: true }
  } catch (err) {
    return { error: String(err) }
  }
}
