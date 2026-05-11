'use server'

import { createClient, createServiceClient } from '@/lib/supabase/server'
import { getCurrentAdmin } from '@/lib/admin'
import { sendStatusUpdateEmail } from '@/lib/email'
import { revalidatePath } from 'next/cache'
import type { ApplicationStatus, AdminRole } from '@/types/database'

export async function updateApplicationStatus({
  applicationId,
  newStatus,
  note,
}: {
  applicationId: string
  newStatus: ApplicationStatus
  note?: string
}): Promise<{ success: true } | { error: string }> {
  try {
    const admin = await getCurrentAdmin()
    if (!admin) return { error: 'Unauthorized' }

    const supabase = await createClient()
    const service = await createServiceClient()

    const { data: app } = await supabase
      .from('applications')
      .select('status, first_name, email, reference_number')
      .eq('id', applicationId)
      .maybeSingle()

    if (!app) return { error: 'Application not found' }

    await service.from('applications').update({ status: newStatus }).eq('id', applicationId)

    await service.from('application_status_history').insert({
      application_id: applicationId,
      from_status: app.status,
      to_status: newStatus,
      changed_by: admin.id,
      note: note || null,
    })

    if (['under_review', 'approved', 'rejected'].includes(newStatus)) {
      sendStatusUpdateEmail({
        to: app.email,
        firstName: app.first_name,
        referenceNumber: app.reference_number,
        newStatus,
        note,
      }).catch(() => {})
    }

    revalidatePath(`/admin/applications/${applicationId}`)
    revalidatePath('/admin/applications')
    revalidatePath('/admin/dashboard')
    return { success: true }
  } catch (err) {
    return { error: String(err) }
  }
}

export async function addApplicationNote({
  applicationId,
  note,
}: {
  applicationId: string
  note: string
}): Promise<{ success: true } | { error: string }> {
  try {
    const admin = await getCurrentAdmin()
    if (!admin) return { error: 'Unauthorized' }

    const service = await createServiceClient()
    await service.from('application_notes').insert({
      application_id: applicationId,
      admin_id: admin.id,
      note,
    })

    revalidatePath(`/admin/applications/${applicationId}`)
    return { success: true }
  } catch (err) {
    return { error: String(err) }
  }
}

export async function inviteAdminUser({
  email,
  fullName,
  role,
}: {
  email: string
  fullName: string
  role: AdminRole
}): Promise<{ success: true } | { error: string }> {
  try {
    const admin = await getCurrentAdmin()
    if (!admin || admin.role !== 'super_admin') return { error: 'Unauthorized' }

    const service = await createServiceClient()

    const { data: invited, error: inviteError } = await service.auth.admin.inviteUserByEmail(email)
    if (inviteError) return { error: inviteError.message }

    await service.from('admin_users').insert({
      id: invited.user.id,
      email,
      full_name: fullName,
      role,
      is_active: true,
    })

    revalidatePath('/admin/team')
    return { success: true }
  } catch (err) {
    return { error: String(err) }
  }
}

export async function updateAdminUser({
  adminId,
  role,
  isActive,
}: {
  adminId: string
  role?: AdminRole
  isActive?: boolean
}): Promise<{ success: true } | { error: string }> {
  try {
    const admin = await getCurrentAdmin()
    if (!admin || admin.role !== 'super_admin') return { error: 'Unauthorized' }
    if (adminId === admin.id) return { error: 'Cannot modify your own account' }

    const service = await createServiceClient()
    const update: Record<string, unknown> = {}
    if (role !== undefined) update.role = role
    if (isActive !== undefined) update.is_active = isActive

    await service.from('admin_users').update(update).eq('id', adminId)

    revalidatePath('/admin/team')
    return { success: true }
  } catch (err) {
    return { error: String(err) }
  }
}

export async function updateCreditScoreConfig({
  configKey,
  configValue,
}: {
  configKey: string
  configValue: unknown
}): Promise<{ success: true } | { error: string }> {
  try {
    const admin = await getCurrentAdmin()
    if (!admin || admin.role !== 'super_admin') return { error: 'Unauthorized' }

    const service = await createServiceClient()
    await service
      .from('credit_score_config')
      .upsert({
        config_key: configKey,
        config_value: configValue,
        updated_by: admin.id,
        updated_at: new Date().toISOString(),
      }, { onConflict: 'config_key' })

    revalidatePath('/admin/settings')
    return { success: true }
  } catch (err) {
    return { error: String(err) }
  }
}
