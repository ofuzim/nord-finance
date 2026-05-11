'use client'

import { useState } from 'react'
import { updateApplicationStatus } from '@/app/actions/admin'
import type { ApplicationStatus } from '@/types/database'

const OPTIONS: { value: ApplicationStatus; label: string; color: string }[] = [
  { value: 'submitted',    label: 'Submitted',    color: '#C39529' },
  { value: 'under_review', label: 'Under Review', color: '#38bdf8' },
  { value: 'approved',     label: 'Approved',     color: '#22c55e' },
  { value: 'rejected',     label: 'Not Approved', color: '#ef4444' },
  { value: 'withdrawn',    label: 'Withdrawn',    color: 'rgba(255,255,255,0.4)' },
]

export function StatusPanel({
  applicationId,
  currentStatus,
}: {
  applicationId: string
  currentStatus: ApplicationStatus
}) {
  const [selected, setSelected] = useState<ApplicationStatus>(currentStatus)
  const [note, setNote] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  const changed = selected !== currentStatus

  const handleUpdate = async () => {
    if (!changed || loading) return
    setLoading(true)
    setMessage(null)
    const result = await updateApplicationStatus({ applicationId, newStatus: selected, note: note.trim() || undefined })
    setLoading(false)
    if ('error' in result) {
      setMessage({ type: 'error', text: result.error })
    } else {
      setMessage({ type: 'success', text: 'Status updated. Applicant has been notified.' })
      setNote('')
    }
  }

  return (
    <div style={{ backgroundColor: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, padding: '20px 22px' }}>
      <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 10, fontWeight: 600, letterSpacing: '0.16em', textTransform: 'uppercase', marginBottom: 16 }}>Update Status</p>

      <select
        value={selected}
        onChange={e => setSelected(e.target.value as ApplicationStatus)}
        style={{
          width: '100%',
          backgroundColor: 'rgba(255,255,255,0.055)',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: 8,
          padding: '11px 14px',
          color: 'white',
          fontFamily: "'Poppins', sans-serif",
          fontSize: 13,
          outline: 'none',
          marginBottom: 12,
          cursor: 'pointer',
        }}
      >
        {OPTIONS.map(o => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>

      <textarea
        value={note}
        onChange={e => setNote(e.target.value)}
        placeholder="Optional note to include in applicant email…"
        rows={3}
        style={{
          width: '100%',
          backgroundColor: 'rgba(255,255,255,0.055)',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: 8,
          padding: '11px 14px',
          color: 'white',
          fontFamily: "'Poppins', sans-serif",
          fontSize: 13,
          outline: 'none',
          resize: 'vertical',
          boxSizing: 'border-box',
          marginBottom: 12,
        }}
      />

      {message && (
        <div style={{ marginBottom: 12, padding: '10px 14px', backgroundColor: message.type === 'success' ? 'rgba(34,197,94,0.07)' : 'rgba(239,68,68,0.07)', border: `1px solid ${message.type === 'success' ? 'rgba(34,197,94,0.2)' : 'rgba(239,68,68,0.2)'}`, borderRadius: 8 }}>
          <p style={{ color: message.type === 'success' ? '#22c55e' : '#ef4444', fontSize: 12 }}>{message.text}</p>
        </div>
      )}

      <button
        onClick={handleUpdate}
        disabled={!changed || loading}
        style={{
          width: '100%',
          backgroundColor: changed ? '#C39529' : 'rgba(255,255,255,0.06)',
          color: changed ? '#000' : 'rgba(255,255,255,0.25)',
          border: 'none',
          borderRadius: 8,
          padding: '12px',
          fontSize: 11,
          fontWeight: 700,
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
          cursor: changed && !loading ? 'pointer' : 'not-allowed',
        }}
      >
        {loading ? 'Updating…' : 'Update Status'}
      </button>
    </div>
  )
}
