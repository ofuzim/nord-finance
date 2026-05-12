import { requireAdmin } from '@/lib/admin'
import {
  creditScoreTierColor,
  getCreditScoreTierChartBands,
  normalizeCreditScoreTiers,
  resolveCreditScoreTierConfig,
} from '@/lib/creditScoreModel'
import { createServiceClient } from '@/lib/supabase/server'
import Link from 'next/link'
import type { ApplicationStatus } from '@/types/database'
import { ViewLink } from './ViewLink'
import { NavStartLink } from '../applications/NavStartLink'
import { DashboardCharts } from './DashboardCharts'

const statusConfig: Record<ApplicationStatus, { label: string; color: string }> = {
  draft:        { label: 'Draft',        color: 'rgba(255,255,255,0.45)' },
  submitted:    { label: 'Submitted',    color: '#C39529' },
  under_review: { label: 'Under Review', color: '#38bdf8' },
  approved:     { label: 'Approved',     color: '#22c55e' },
  rejected:     { label: 'Not Approved', color: '#ef4444' },
  withdrawn:    { label: 'Withdrawn',    color: 'rgba(255,255,255,0.45)' },
}

function dayKey(date: Date): string {
  return date.toISOString().slice(0, 10)
}

function dayLabel(key: string): string {
  return new Date(`${key}T00:00:00`).toLocaleDateString('en-NG', { month: 'short', day: 'numeric' })
}

const volumeRangeOptions = [
  { key: '7d', days: 7 },
  { key: '14d', days: 14 },
  { key: '30d', days: 30 },
  { key: '90d', days: 90 },
  { key: '1y', days: 365 },
] as const

export default async function DashboardPage() {
  await requireAdmin()
  const service = await createServiceClient()

  const [{ data: applications }, { data: scores }, { data: recent }, { data: tierConfigRow }] = await Promise.all([
    service.from('applications').select('status, created_at, submitted_at, vehicle_model'),
    service.from('credit_scores').select('score, created_at'),
    service
      .from('applications')
      .select('id, reference_number, first_name, last_name, status, submitted_at, created_at, credit_scores(score, tier)')
      .order('created_at', { ascending: false })
      .limit(10),
    service.from('credit_score_config').select('config_value').eq('config_key', 'score_tiers').maybeSingle(),
  ])

  const tiers = normalizeCreditScoreTiers(tierConfigRow?.config_value)

  const counts = {
    total: applications?.length ?? 0,
    submitted: applications?.filter(a => a.status === 'submitted').length ?? 0,
    under_review: applications?.filter(a => a.status === 'under_review').length ?? 0,
    approved: applications?.filter(a => a.status === 'approved').length ?? 0,
    rejected: applications?.filter(a => a.status === 'rejected').length ?? 0,
  }

  const stats = [
    { label: 'Total Applications', value: counts.total, color: 'white' },
    { label: 'Awaiting Review', value: counts.submitted, color: '#C39529' },
    { label: 'Under Review', value: counts.under_review, color: '#38bdf8' },
    { label: 'Approved', value: counts.approved, color: '#22c55e' },
  ]

  const today = new Date()
  const makeVolumeData = (rangeDays: number) => {
    const days = Array.from({ length: rangeDays }, (_, i) => {
      const date = new Date(today)
      date.setDate(today.getDate() - (rangeDays - 1 - i))
      return dayKey(date)
    })

    const volumeCounts = new Map(days.map((dateKey) => [dateKey, 0]))
    ;(applications ?? []).forEach((app: any) => {
      const dateValue = app.submitted_at || app.created_at
      if (!dateValue) return
      const dateKey = dayKey(new Date(dateValue))
      if (volumeCounts.has(dateKey)) volumeCounts.set(dateKey, (volumeCounts.get(dateKey) ?? 0) + 1)
    })

    return days.map((dateKey) => ({ label: dayLabel(dateKey), applications: volumeCounts.get(dateKey) ?? 0 }))
  }

  const volumeRanges = {
    '7d': makeVolumeData(7),
    '14d': makeVolumeData(14),
    '30d': makeVolumeData(30),
    '90d': makeVolumeData(90),
    '1y': makeVolumeData(365),
  }

  const scoreBands = getCreditScoreTierChartBands(tiers)
  const scoreCounts = new Map(scoreBands.map((b) => [b.name, 0]))
  ;(scores ?? []).forEach((item: any) => {
    const tierName = resolveCreditScoreTierConfig(Number(item.score), tiers).name
    scoreCounts.set(tierName, (scoreCounts.get(tierName) ?? 0) + 1)
  })
  const scoreData = scoreBands.map((band) => ({
    tierName: band.name,
    label: band.tierLabel,
    rangeLabel: band.rangeLabel,
    count: scoreCounts.get(band.name) ?? 0,
    color: creditScoreTierColor(band.name),
  }))

  const vehicleCounts = new Map<string, number>()
  ;(applications ?? []).forEach((app: any) => {
    const model = app.vehicle_model || 'Unspecified'
    vehicleCounts.set(model, (vehicleCounts.get(model) ?? 0) + 1)
  })
  const vehicleData = Array.from(vehicleCounts.entries())
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 8)

  return (
    <div>
      <div style={{ padding: '24px 40px 20px', borderBottom: '1px solid rgba(255,255,255,0.07)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h1 style={{ color: 'white', fontSize: 22, fontWeight: 600, marginBottom: 4, lineHeight: 1.3 }}>Dashboard</h1>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 13, lineHeight: 1.3 }}>Overview of all applications and activity.</p>
        </div>
        <a href="/" target="_blank" rel="noreferrer" style={{ color: 'rgba(255,255,255,0.55)', fontSize: 12, textDecoration: 'none', letterSpacing: '0.06em', display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
          Nord Finance
        </a>
      </div>

    <div style={{ padding: '32px 40px' }}>
      {/* Stat cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 40 }}>
        {stats.map(s => (
          <div key={s.label} style={{
            backgroundColor: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: 12,
            padding: '20px 22px',
          }}>
            <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 10 }}>{s.label}</p>
            <p style={{ color: s.color, fontSize: 32, fontWeight: 700, lineHeight: 1 }}>{s.value}</p>
          </div>
        ))}
      </div>

      <DashboardCharts volumeRanges={volumeRanges} scoreData={scoreData} vehicleData={vehicleData} />

      {/* Recent applications */}
      <div style={{ backgroundColor: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, overflow: 'hidden' }}>
        <div style={{ padding: '18px 22px', borderBottom: '1px solid rgba(255,255,255,0.07)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <p style={{ color: 'white', fontSize: 14, fontWeight: 600 }}>Recent Applications</p>
          <Link href="/admin/applications" style={{ color: '#C39529', fontSize: 12, textDecoration: 'none', fontWeight: 500 }}>View all →</Link>
        </div>

        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
              {['Reference', 'Applicant', 'Score', 'Status', 'Date', ''].map((h, i) => (
                <th
                  key={h || `col-${i}`}
                  style={{
                    padding: '11px 22px',
                    textAlign: i === 5 ? 'right' : 'left',
                    color: 'rgba(255,255,255,0.45)',
                    fontSize: 10,
                    fontWeight: 500,
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase',
                  }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {(recent ?? []).map((app: any) => {
              const sc = app.credit_scores?.[0]
              const status = statusConfig[app.status as ApplicationStatus]
              const href = `/admin/applications/${app.id}`
              return (
                <tr key={app.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)', cursor: 'pointer' }}>
                  <td style={{ padding: 0, position: 'relative' }}>
                    <NavStartLink href={href} style={{ position: 'absolute', inset: 0 }} aria-label={`View ${app.reference_number}`} />
                    <span style={{ display: 'block', padding: '13px 22px', color: 'rgba(255,255,255,0.6)', fontSize: 12, fontFamily: 'monospace', letterSpacing: '0.04em' }}>{app.reference_number}</span>
                  </td>
                  <td style={{ padding: '13px 22px', color: 'white', fontSize: 13, position: 'relative' }}>
                    <NavStartLink href={href} style={{ position: 'absolute', inset: 0 }} tabIndex={-1} />{app.first_name} {app.last_name}
                  </td>
                  <td style={{ padding: '13px 22px', color: 'rgba(255,255,255,0.6)', fontSize: 13, position: 'relative' }}>
                    <NavStartLink href={href} style={{ position: 'absolute', inset: 0 }} tabIndex={-1} />{sc ? sc.score : '—'}
                  </td>
                  <td style={{ padding: '13px 22px', position: 'relative' }}>
                    <NavStartLink href={href} style={{ position: 'absolute', inset: 0 }} tabIndex={-1} />
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, backgroundColor: `${status?.color}18`, borderRadius: 100, padding: '4px 10px' }}>
                      <span style={{ width: 5, height: 5, borderRadius: '50%', backgroundColor: status?.color }} />
                      <span style={{ color: status?.color, fontSize: 10, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase' }}>{status?.label}</span>
                    </span>
                  </td>
                  <td style={{ padding: '13px 22px', fontSize: 12, position: 'relative' }}>
                    <NavStartLink href={href} style={{ position: 'absolute', inset: 0 }} tabIndex={-1} />
                    {app.submitted_at ? (
                      <span style={{ color: 'rgba(255,255,255,0.55)' }}>{new Date(app.submitted_at).toLocaleDateString('en-NG', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                    ) : (
                      <span style={{ color: 'rgba(255,255,255,0.35)', fontSize: 11 }}>Created {new Date(app.created_at).toLocaleDateString('en-NG', { day: 'numeric', month: 'short' })}</span>
                    )}
                  </td>
                  <td style={{ padding: '13px 22px', textAlign: 'right', verticalAlign: 'middle' }}>
                    <ViewLink href={href} />
                  </td>
                </tr>
              )
            })}
            {!recent?.length && (
              <tr><td colSpan={6} style={{ padding: '32px 22px', color: 'rgba(255,255,255,0.45)', fontSize: 13, textAlign: 'center' }}>No applications yet.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
    </div>
  )
}
