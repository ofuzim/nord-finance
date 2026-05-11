import { requireAdmin } from '@/lib/admin'
import { createServiceClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { StatusPanel } from './StatusPanel'
import { NotesPanel } from './NotesPanel'
import { ScoreQuestionnaire } from './ScoreQuestionnaire'
import type { ApplicationStatus } from '@/types/database'
import { getCreditScoreRuntimeConfig } from '@/lib/creditScoreConfig'

const statusConfig: Record<ApplicationStatus, { label: string; color: string }> = {
  draft:        { label: 'Draft',        color: 'rgba(255,255,255,0.3)' },
  submitted:    { label: 'Submitted',    color: '#C39529' },
  under_review: { label: 'Under Review', color: '#38bdf8' },
  approved:     { label: 'Approved',     color: '#22c55e' },
  rejected:     { label: 'Not Approved', color: '#ef4444' },
  withdrawn:    { label: 'Withdrawn',    color: 'rgba(255,255,255,0.3)' },
}

const tierLabels: Record<string, string> = {
  private_bridge: 'Private Bridge',
  premium: 'Premium Tier',
  core: 'Core Tier',
  access: 'Access Tier',
}

const docLabels: Record<string, string> = {
  government_id: 'Government ID',
  passport_photo: 'Passport Photo',
  bank_statement: 'Bank Statement',
  payslip: 'Payslip',
  proof_of_residence: 'Proof of Residence',
}

/* ── Shared primitives ─────────────────────────────────────────── */

function InfoRow({ label, value }: { label: string; value?: string | null }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
      <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 10, fontWeight: 500, letterSpacing: '0.12em', textTransform: 'uppercase' }}>{label}</p>
      <p style={{ color: value ? 'rgba(255,255,255,0.88)' : 'rgba(255,255,255,0.25)', fontSize: 14 }}>{value || '—'}</p>
    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ backgroundColor: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, padding: '20px 24px', marginBottom: 16 }}>
      <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 10, fontWeight: 600, letterSpacing: '0.16em', textTransform: 'uppercase', marginBottom: 20 }}>{title}</p>
      {children}
    </div>
  )
}

/* ── Page ─────────────────────────────────────────────────────── */

export default async function ApplicationDetailPage({ params }: { params: Promise<{ id: string }> }) {
  await requireAdmin()
  const { id } = await params
  const service = await createServiceClient()

  const { data: app } = await service
    .from('applications')
    .select('*')
    .eq('id', id)
    .maybeSingle()

  if (!app) notFound()

  const [{ data: scores }, { data: docs }, { data: notes }, { data: history }, creditScoreConfig] = await Promise.all([
    service.from('credit_scores').select('*').eq('application_id', id).order('created_at', { ascending: false }),
    service.from('documents').select('*').eq('application_id', id),
    service.from('application_notes').select('*, admin_users(full_name, email)').eq('application_id', id).order('created_at', { ascending: false }),
    service.from('application_status_history').select('*, admin_users(full_name)').eq('application_id', id).order('changed_at', { ascending: false }),
    getCreditScoreRuntimeConfig(),
  ])

  const docsWithUrls = await Promise.all(
    (docs ?? []).map(async (doc: any) => {
      const { data } = await service.storage.from('application-documents').createSignedUrl(doc.storage_path, 3600)
      return { ...doc, signedUrl: data?.signedUrl ?? null }
    })
  )

  const score = (scores ?? [])[0] as any
  const status = statusConfig[app.status as ApplicationStatus]

  return (
    <div>
      {/* Header */}
      <div style={{ padding: '24px 40px 20px', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 style={{ color: 'white', fontSize: 22, fontWeight: 600, marginBottom: 5, lineHeight: 1.3 }}>{app.first_name} {app.last_name}</h1>
            <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 13, lineHeight: 1.4 }}>{app.email} · {app.phone_number}</p>
          </div>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, backgroundColor: `${status?.color}18`, border: `1px solid ${status?.color}33`, borderRadius: 100, padding: '6px 14px' }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: status?.color, flexShrink: 0 }} />
            <span style={{ color: status?.color, fontSize: 10, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase' }}>{status?.label}</span>
          </span>
        </div>
      </div>

      <div style={{ padding: '28px 40px' }}>
        {/* Breadcrumb */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 24 }}>
          <Link href="/admin/applications" style={{ color: 'rgba(255,255,255,0.5)', fontSize: 12, textDecoration: 'none' }}>Applications</Link>
          <span style={{ color: 'rgba(255,255,255,0.25)', fontSize: 12 }}>›</span>
          <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: 12, fontFamily: 'monospace' }}>{app.reference_number}</span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: 20, alignItems: 'start' }}>
          {/* Left column */}
          <div>

            {/* Credit Score */}
            {score && (
              <Section title="Credit Score">
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20, marginBottom: 20 }}>
                  {[
                    { label: 'Nord Score', value: score.score, large: true },
                    { label: 'Tier', value: tierLabels[score.tier] ?? score.tier },
                    { label: 'Monthly Income', value: `₦${Number(score.monthly_income).toLocaleString('en-NG')}` },
                    { label: 'Down Payment', value: `${score.down_payment_percentage}%` },
                  ].map(item => (
                    <div key={item.label}>
                      <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 6 }}>{item.label}</p>
                      <p style={{ color: '#C39529', fontSize: 16, fontWeight: 700, lineHeight: 1.2 }}>{item.value}</p>
                    </div>
                  ))}
                </div>

                {/* Signals */}
                {score.signals && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
                    {[...(score.signals.red ?? []).map((t: string) => ({ tone: 'red', text: t })),
                      ...(score.signals.yellow ?? []).map((t: string) => ({ tone: 'yellow', text: t })),
                      ...(score.signals.green ?? []).map((t: string) => ({ tone: 'green', text: t }))
                    ].map((s: any, i: number) => (
                      <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                        <span style={{ width: 6, height: 6, borderRadius: '50%', marginTop: 5, flexShrink: 0, backgroundColor: s.tone === 'red' ? '#ef4444' : s.tone === 'yellow' ? '#C39529' : '#22c55e' }} />
                        <span style={{ color: 'rgba(255,255,255,0.62)', fontSize: 13, lineHeight: 1.6 }}>{s.text}</span>
                      </div>
                    ))}
                  </div>
                )}

                {score.form_responses && (
                  <ScoreQuestionnaire formResponses={score.form_responses as Record<string, number>} formConfig={creditScoreConfig.formConfig} />
                )}
              </Section>
            )}

            {/* Personal Info */}
            <Section title="Personal Information">
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
                <InfoRow label="Title" value={app.title} />
                <InfoRow label="First Name" value={app.first_name} />
                <InfoRow label="Last Name" value={app.last_name} />
                <InfoRow label="Other Names" value={app.other_names} />
                <InfoRow label="Gender" value={app.gender} />
                <InfoRow label="Date of Birth" value={app.date_of_birth} />
                <InfoRow label="Marital Status" value={app.marital_status} />
                <InfoRow label="Children" value={String(app.number_of_children ?? 0)} />
                <InfoRow label="State of Origin" value={app.state_of_origin} />
                <InfoRow label="LGA of Origin" value={app.lga_of_origin} />
                <InfoRow label="Phone" value={app.phone_number} />
                <InfoRow label="Email" value={app.email} />
                <InfoRow label="State of Residence" value={app.state_of_residence} />
                <InfoRow label="LGA of Residence" value={app.lga_of_residence} />
                <InfoRow label="Residential Status" value={app.residential_status} />
                <InfoRow label="Occupation" value={app.occupation} />
                <InfoRow label="Employer / Business" value={app.employer_name} />
                <InfoRow label="Employment Type" value={app.employment_type} />
              </div>
              {app.home_address && (
                <div style={{ marginTop: 20 }}>
                  <InfoRow label="Home Address" value={app.home_address} />
                </div>
              )}
            </Section>

            {/* Identity */}
            <Section title="Identity Verification">
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
                <InfoRow label="ID Type" value={app.id_type} />
                <InfoRow label="ID Number" value={app.id_number} />
                <InfoRow label="ID Expiry" value={app.id_expiry_date} />
                <InfoRow label="NIN" value={app.nin} />
                <InfoRow label="BVN" value={app.bvn} />
              </div>
            </Section>

            {/* Documents */}
            <Section title="Documents">
              {docsWithUrls.length === 0 ? (
                <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 13 }}>No documents uploaded.</p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {docsWithUrls.map((doc: any) => (
                    <div key={doc.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', backgroundColor: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 8 }}>
                      <div>
                        <p style={{ color: 'rgba(255,255,255,0.82)', fontSize: 13, fontWeight: 500 }}>{docLabels[doc.document_type] ?? doc.document_type}</p>
                        <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11, marginTop: 3 }}>{doc.file_name}</p>
                      </div>
                      {doc.signedUrl ? (
                        <a href={doc.signedUrl} target="_blank" rel="noreferrer" style={{ color: '#C39529', fontSize: 12, textDecoration: 'none', fontWeight: 600, whiteSpace: 'nowrap' }}>
                          View / Download →
                        </a>
                      ) : (
                        <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: 12 }}>Unavailable</span>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </Section>

            {/* Vehicle */}
            <Section title="Vehicle of Interest">
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
                <InfoRow label="Category" value={app.vehicle_category} />
                <InfoRow label="Model" value={app.vehicle_model} />
              </div>
            </Section>

            {/* Status History */}
            <Section title="Status History">
              {(history ?? []).length === 0 ? (
                <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 13 }}>No status changes recorded.</p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                  {(history as any[]).map((h: any) => (
                    <div key={h.id} style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
                      <span style={{ width: 7, height: 7, borderRadius: '50%', backgroundColor: statusConfig[h.to_status as ApplicationStatus]?.color ?? 'white', marginTop: 6, flexShrink: 0 }} />
                      <div>
                        <p style={{ color: 'rgba(255,255,255,0.82)', fontSize: 13, lineHeight: 1.4 }}>
                          {h.from_status ? `${statusConfig[h.from_status as ApplicationStatus]?.label} → ` : ''}{statusConfig[h.to_status as ApplicationStatus]?.label}
                        </p>
                        {h.note && <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 12, marginTop: 3, lineHeight: 1.5 }}>{h.note}</p>}
                        <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: 11, marginTop: 4 }}>
                          {h.admin_users?.full_name ?? 'System'} · {new Date(h.changed_at).toLocaleDateString('en-NG', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Section>
          </div>

          {/* Right column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <StatusPanel applicationId={id} currentStatus={app.status as ApplicationStatus} />
            <NotesPanel applicationId={id} initialNotes={(notes as any[]) ?? []} />
          </div>
        </div>
      </div>
    </div>
  )
}
