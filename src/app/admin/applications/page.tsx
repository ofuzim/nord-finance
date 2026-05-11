import { requireAdmin } from '@/lib/admin'
import { createServiceClient } from '@/lib/supabase/server'
import Link from 'next/link'
import type { ApplicationStatus } from '@/types/database'
import { RowActions } from './RowActions'
import { NavStartLink } from './NavStartLink'

const statusConfig: Record<ApplicationStatus, { label: string; color: string }> = {
  draft:        { label: 'Draft',        color: 'rgba(255,255,255,0.45)' },
  submitted:    { label: 'Submitted',    color: '#C39529' },
  under_review: { label: 'Under Review', color: '#38bdf8' },
  approved:     { label: 'Approved',     color: '#22c55e' },
  rejected:     { label: 'Not Approved', color: '#ef4444' },
  withdrawn:    { label: 'Withdrawn',    color: 'rgba(255,255,255,0.45)' },
}

const FILTERS: { label: string; value: string }[] = [
  { label: 'All', value: '' },
  { label: 'Submitted', value: 'submitted' },
  { label: 'Under Review', value: 'under_review' },
  { label: 'Approved', value: 'approved' },
  { label: 'Rejected', value: 'rejected' },
]

export default async function ApplicationsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; q?: string }>
}) {
  await requireAdmin()
  const { status, q } = await searchParams
  const service = await createServiceClient()

  let query = service
    .from('applications')
    .select('id, reference_number, first_name, last_name, email, phone_number, status, submitted_at, created_at, credit_scores(score, tier)')
    .order('created_at', { ascending: false })
    .limit(100)

  if (status) query = query.eq('status', status)
  if (q) {
    const term = q.trim()
    query = query.or(`first_name.ilike.%${term}%,last_name.ilike.%${term}%,email.ilike.%${term}%,reference_number.ilike.%${term}%`)
  }

  const { data: applications } = await query

  return (
    <div>
      <div style={{ padding: '24px 40px 20px', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
        <h1 style={{ color: 'white', fontSize: 22, fontWeight: 600, marginBottom: 4, lineHeight: 1.3 }}>Applications</h1>
        <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 13, lineHeight: 1.3 }}>{applications?.length ?? 0} result{applications?.length !== 1 ? 's' : ''}</p>
      </div>

    <div style={{ padding: '32px 40px' }}>
      {/* Filters + Search */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 24, flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ display: 'flex', gap: 6 }}>
          {FILTERS.map(f => {
            const active = (status ?? '') === f.value
            return (
              <Link
                key={f.value}
                href={f.value ? `/admin/applications?status=${f.value}${q ? `&q=${q}` : ''}` : `/admin/applications${q ? `?q=${q}` : ''}`}
                style={{
                  display: 'inline-block',
                  padding: '7px 14px',
                  borderRadius: 100,
                  fontSize: 12,
                  fontWeight: active ? 600 : 400,
                  textDecoration: 'none',
                  color: active ? '#000' : 'rgba(255,255,255,0.65)',
                  backgroundColor: active ? '#C39529' : 'rgba(255,255,255,0.06)',
                  border: active ? 'none' : '1px solid rgba(255,255,255,0.08)',
                }}
              >
                {f.label}
              </Link>
            )
          })}
        </div>

        <form method="GET" action="/admin/applications" style={{ marginLeft: 'auto' }}>
          {status && <input type="hidden" name="status" value={status} />}
          <input
            name="q"
            defaultValue={q ?? ''}
            placeholder="Search name, email, reference…"
            style={{
              backgroundColor: 'rgba(255,255,255,0.055)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: 8,
              padding: '9px 14px',
              color: 'white',
              fontFamily: "'Poppins', sans-serif",
              fontSize: 13,
              outline: 'none',
              width: 260,
            }}
          />
        </form>
      </div>

      {/* Table */}
      <div style={{ backgroundColor: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
              {['Reference', 'Applicant', 'Email', 'Score / Tier', 'Status', 'Date', ''].map(h => (
                <th key={h} style={{ padding: '12px 20px', textAlign: 'left', color: 'rgba(255,255,255,0.45)', fontSize: 10, fontWeight: 500, letterSpacing: '0.12em', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {(applications ?? []).map((app: any) => {
              const sc = app.credit_scores?.[0]
              const status = statusConfig[app.status as ApplicationStatus]
              const href = `/admin/applications/${app.id}`
              return (
                <tr key={app.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)', cursor: 'pointer' }} onClick={undefined}>
                  <td style={{ padding: 0, position: 'relative' }}>
                    <NavStartLink href={href} style={{ position: 'absolute', inset: 0 }} aria-label={`View ${app.reference_number}`} />
                    <span style={{ display: 'block', padding: '13px 20px', color: 'rgba(255,255,255,0.65)', fontSize: 12, fontFamily: 'monospace', letterSpacing: '0.04em', whiteSpace: 'nowrap' }}>{app.reference_number}</span>
                  </td>
                  <td style={{ padding: '13px 20px', color: 'white', fontSize: 13, whiteSpace: 'nowrap', position: 'relative' }}>
                    <NavStartLink href={href} style={{ position: 'absolute', inset: 0 }} tabIndex={-1} />
                    {app.first_name} {app.last_name}
                  </td>
                  <td style={{ padding: '13px 20px', color: 'rgba(255,255,255,0.6)', fontSize: 12, position: 'relative' }}>
                    <NavStartLink href={href} style={{ position: 'absolute', inset: 0 }} tabIndex={-1} />{app.email}
                  </td>
                  <td style={{ padding: '13px 20px', color: 'rgba(255,255,255,0.65)', fontSize: 12, whiteSpace: 'nowrap', position: 'relative' }}>
                    <NavStartLink href={href} style={{ position: 'absolute', inset: 0 }} tabIndex={-1} />
                    {sc ? `${sc.score} · ${sc.tier.replace(/_/g, ' ')}` : '—'}
                  </td>
                  <td style={{ padding: '13px 20px', position: 'relative' }}>
                    <NavStartLink href={href} style={{ position: 'absolute', inset: 0 }} tabIndex={-1} />
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, backgroundColor: `${status?.color}18`, borderRadius: 100, padding: '4px 10px' }}>
                      <span style={{ width: 5, height: 5, borderRadius: '50%', backgroundColor: status?.color, flexShrink: 0 }} />
                      <span style={{ color: status?.color, fontSize: 10, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>{status?.label}</span>
                    </span>
                  </td>
                  <td style={{ padding: '13px 20px', fontSize: 12, whiteSpace: 'nowrap', position: 'relative' }}>
                    <NavStartLink href={href} style={{ position: 'absolute', inset: 0 }} tabIndex={-1} />
                    {app.submitted_at ? (
                      <span style={{ color: 'rgba(255,255,255,0.6)' }}>{new Date(app.submitted_at).toLocaleDateString('en-NG', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                    ) : (
                      <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11 }}>Created {new Date(app.created_at).toLocaleDateString('en-NG', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                    )}
                  </td>
                  <td style={{ padding: '13px 20px' }}>
                    <RowActions href={href} applicationId={app.id} referenceNumber={app.reference_number} />
                  </td>
                </tr>
              )
            })}
            {!applications?.length && (
              <tr><td colSpan={7} style={{ padding: '40px', color: 'rgba(255,255,255,0.45)', fontSize: 13, textAlign: 'center' }}>No applications found.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
    </div>
  )
}
