'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { deleteApplication } from '@/app/actions/admin'

export function RowActions({
  href,
  applicationId,
  referenceNumber,
}: {
  href: string
  applicationId: string
  referenceNumber: string
}) {
  const router = useRouter()
  const [deleting, setDeleting] = useState(false)
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const fire = () => window.dispatchEvent(new CustomEvent('nav:start'))

  const handleDeleteClick = () => {
    if (deleting) return
    setError(null)
    setConfirmOpen(true)
  }

  const confirmDelete = async () => {
    if (deleting) return
    setDeleting(true)
    setError(null)
    const result = await deleteApplication({ applicationId })
    setDeleting(false)

    if ('error' in result) {
      setError(result.error)
      return
    }

    setConfirmOpen(false)
    router.refresh()
  }

  return (
    <>
      <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
        <Link
          href={href}
          onClick={fire}
          style={{ color: 'rgba(255,255,255,0.5)', fontSize: 12, textDecoration: 'none', fontWeight: 500, whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: 4, cursor: 'pointer' }}
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
          View
        </Link>
        <Link
          href={href}
          onClick={fire}
          style={{ color: '#C39529', fontSize: 12, textDecoration: 'none', fontWeight: 500, whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: 4, cursor: 'pointer' }}
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
          Edit
        </Link>
        <button
          type="button"
          onClick={handleDeleteClick}
          disabled={deleting}
          style={{ color: '#ef4444', background: 'none', border: 'none', padding: 0, fontSize: 12, fontFamily: "'Poppins', sans-serif", fontWeight: 500, whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: 4, cursor: deleting ? 'wait' : 'pointer', opacity: deleting ? 0.55 : 1 }}
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M8 6V4h8v2"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/></svg>
          Delete
        </button>
      </div>

      {confirmOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby={`delete-application-title-${applicationId}`}
          style={{ position: 'fixed', inset: 0, zIndex: 80, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20, backgroundColor: 'rgba(0,0,0,0.72)', backdropFilter: 'blur(8px)' }}
        >
          <div style={{ width: '100%', maxWidth: 420, border: '1px solid rgba(239,68,68,0.24)', borderRadius: 16, backgroundColor: '#090909', boxShadow: '0 24px 80px rgba(0,0,0,0.45)', overflow: 'hidden' }}>
            <div style={{ padding: '22px 24px 18px', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
              <p id={`delete-application-title-${applicationId}`} style={{ color: 'white', fontSize: 18, fontWeight: 600, marginBottom: 8 }}>Delete application?</p>
              <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: 13, lineHeight: 1.6 }}>
                This will permanently delete application <span style={{ color: '#C39529', fontFamily: 'monospace' }}>{referenceNumber}</span>, its linked score, notes, status history, and uploaded documents.
              </p>
              {error && (
                <p style={{ marginTop: 14, color: '#fca5a5', backgroundColor: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.18)', borderRadius: 8, padding: '10px 12px', fontSize: 12, lineHeight: 1.5 }}>
                  {error}
                </p>
              )}
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, padding: '16px 24px' }}>
              <button
                type="button"
                onClick={() => { if (!deleting) setConfirmOpen(false) }}
                disabled={deleting}
                style={{ border: '1px solid rgba(255,255,255,0.12)', backgroundColor: 'rgba(255,255,255,0.04)', color: 'rgba(255,255,255,0.75)', borderRadius: 8, padding: '9px 14px', fontFamily: "'Poppins', sans-serif", fontSize: 12, fontWeight: 600, cursor: deleting ? 'not-allowed' : 'pointer', opacity: deleting ? 0.6 : 1 }}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDelete}
                disabled={deleting}
                style={{ border: 'none', backgroundColor: '#ef4444', color: 'white', borderRadius: 8, padding: '9px 14px', fontFamily: "'Poppins', sans-serif", fontSize: 12, fontWeight: 700, cursor: deleting ? 'wait' : 'pointer', opacity: deleting ? 0.75 : 1 }}
              >
                {deleting ? 'Deleting...' : 'Delete permanently'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
