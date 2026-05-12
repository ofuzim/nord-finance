'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { Navigation } from '@/components/Navigation'
import { Footer } from '@/components/Footer'
import { lookupApplicationByReference } from '@/app/actions/application'

const statusConfig: Record<string, { label: string; color: string; description: string }> = {
  draft:        { label: 'Draft',        color: 'rgba(255,255,255,0.4)',  description: 'Your application has not been submitted yet.' },
  submitted:    { label: 'Submitted',    color: '#C39529',                description: 'We have received your application and it is in the queue for review.' },
  under_review: { label: 'Under Review', color: '#38bdf8',                description: 'Our team is actively reviewing your application and documents.' },
  approved:     { label: 'Approved',     color: '#22c55e',                description: 'Congratulations — your application has been approved. Our team will be in touch.' },
  rejected:     { label: 'Not Approved', color: '#ef4444',                description: 'Unfortunately your application was not approved at this time. Contact us for more information.' },
  withdrawn:    { label: 'Withdrawn',    color: 'rgba(255,255,255,0.4)',  description: 'This application has been withdrawn.' },
}

interface ApplicationResult {
  referenceNumber: string
  status: string
  firstName: string | null
  lastName: string | null
  vehicleModel: string | null
  submittedAt: string | null
}

export default function StatusPage() {
  const [refInput, setRefInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<ApplicationResult | null>(null)
  const [errorMsg, setErrorMsg] = useState('')

  const checkStatus = async (e: React.FormEvent) => {
    e.preventDefault()
    const ref = refInput.trim()
    if (!ref) return

    setLoading(true)
    setResult(null)
    setErrorMsg('')

    const data = await lookupApplicationByReference(ref)

    if ('error' in data) {
      setErrorMsg(data.error)
    } else {
      setResult(data)
    }
    setLoading(false)
  }

  const statusInfo = result ? (statusConfig[result.status] ?? statusConfig.submitted) : null

  return (
    <>
      <Navigation />
      <main style={{ paddingTop: 72, backgroundColor: '#000', minHeight: '100vh' }}>
        <div style={{ maxWidth: 560, margin: '0 auto', padding: '80px 24px 120px' }}>

          <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.22em', textTransform: 'uppercase', color: '#C39529', marginBottom: 18 }}>
            Application Status
          </p>
          <h1 style={{ fontFamily: "'Morpha', Georgia, serif", fontWeight: 400, fontSize: 'clamp(32px, 5vw, 48px)', lineHeight: 1.1, color: 'white', marginBottom: 14 }}>
            Track your <em style={{ fontStyle: 'normal', fontWeight: 700 }}>application</em>
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 14, lineHeight: 1.8, marginBottom: 52 }}>
            Enter the reference number from your confirmation email to see the current status of your application.
          </p>

          <form onSubmit={checkStatus}>
            <label style={{ display: 'block', fontSize: 10, fontWeight: 500, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.45)', marginBottom: 9 }}>
              Reference Number
            </label>
            <div className="status-check-row" style={{ display: 'flex', gap: 12 }}>
              <input
                className="status-ref-input"
                type="text"
                value={refInput}
                onChange={e => setRefInput(e.target.value)}
                placeholder="e.g. NF2025AB4X7K"
                style={{
                  flex: 1,
                  backgroundColor: 'rgba(255,255,255,0.055)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: 8,
                  padding: '14px 16px',
                  color: 'white',
                  fontFamily: "'Poppins', sans-serif",
                  fontSize: '1rem',
                  outline: 'none',
                  letterSpacing: '0.08em',
                  colorScheme: 'dark',
                }}
              />
              <button
                className="status-submit-button"
                type="submit"
                disabled={loading || !refInput.trim()}
                style={{
                  backgroundColor: '#C39529',
                  color: '#000',
                  border: 'none',
                  borderRadius: 8,
                  padding: '14px 22px',
                  fontSize: 11,
                  fontWeight: 800,
                  letterSpacing: '0.14em',
                  textTransform: 'uppercase',
                  cursor: loading || !refInput.trim() ? 'not-allowed' : 'pointer',
                  opacity: loading || !refInput.trim() ? 0.5 : 1,
                  whiteSpace: 'nowrap',
                  fontFamily: "'Poppins', sans-serif",
                }}
              >
                {loading ? 'Checking…' : 'Check Status'}
              </button>
            </div>
          </form>

          {errorMsg && (
            <div style={{ marginTop: 32, padding: '20px 24px', backgroundColor: 'rgba(239,68,68,0.07)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 12 }}>
              <p style={{ color: '#ef4444', fontSize: 13, lineHeight: 1.7 }}>{errorMsg}</p>
            </div>
          )}

          {result && statusInfo && (
            <div style={{ marginTop: 40 }}>
              <div style={{
                backgroundColor: 'rgba(255,255,255,0.035)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: 16,
                padding: '32px 28px',
                marginBottom: 16,
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24, gap: 16 }}>
                  <div>
                    <p style={{ fontSize: 10, fontWeight: 500, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.35)', marginBottom: 6 }}>
                      Reference
                    </p>
                    <p style={{ fontSize: 18, fontWeight: 700, letterSpacing: '0.1em', color: 'white' }}>
                      {result.referenceNumber}
                    </p>
                  </div>
                  <div style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 6,
                    backgroundColor: 'rgba(255,255,255,0.05)',
                    border: `1px solid ${statusInfo.color}55`,
                    borderRadius: 100,
                    padding: '7px 14px',
                    flexShrink: 0,
                  }}>
                    <span style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: statusInfo.color, flexShrink: 0 }} />
                    <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: statusInfo.color }}>
                      {statusInfo.label}
                    </span>
                  </div>
                </div>

                <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 13, lineHeight: 1.8, marginBottom: 24 }}>
                  {statusInfo.description}
                </p>

                <div style={{ height: 1, backgroundColor: 'rgba(255,255,255,0.07)', marginBottom: 24 }} />

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
                  <div>
                    <p style={{ fontSize: 10, fontWeight: 500, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)', marginBottom: 5 }}>Applicant</p>
                    <p style={{ fontSize: 14, color: 'white', fontWeight: 500 }}>{[result.firstName, result.lastName].filter(Boolean).join(' ') || '—'}</p>
                  </div>
                  <div>
                    <p style={{ fontSize: 10, fontWeight: 500, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)', marginBottom: 5 }}>Submitted</p>
                    <p style={{ fontSize: 14, color: 'white', fontWeight: 500 }}>
                      {result.submittedAt
                        ? new Date(result.submittedAt).toLocaleDateString('en-NG', { day: 'numeric', month: 'short', year: 'numeric' })
                        : '—'}
                    </p>
                  </div>
                  {result.vehicleModel && (
                    <div style={{ gridColumn: '1 / -1' }}>
                      <p style={{ fontSize: 10, fontWeight: 500, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)', marginBottom: 5 }}>Vehicle of Interest</p>
                      <p style={{ fontSize: 14, color: 'white', fontWeight: 500 }}>{result.vehicleModel}</p>
                    </div>
                  )}
                </div>
              </div>

              <div style={{ padding: '20px 24px', backgroundColor: 'rgba(195,149,41,0.06)', border: '1px solid rgba(195,149,41,0.15)', borderRadius: 12 }}>
                <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: 13, lineHeight: 1.8 }}>
                  Questions about your application?{' '}
                  <a href="https://wa.me/2348149799150" target="_blank" rel="noreferrer" style={{ color: '#C39529', textDecoration: 'none', fontWeight: 600 }}>
                    Contact us on WhatsApp
                  </a>
                  {' '}or reply to your confirmation email.
                </p>
              </div>
            </div>
          )}

          <div style={{ marginTop: 56, paddingTop: 32, borderTop: '1px solid rgba(255,255,255,0.07)' }}>
            <Link href="/" style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12, textDecoration: 'none', letterSpacing: '0.08em' }}>
              ← Back to Nord Finance
            </Link>
          </div>

        </div>
      </main>
      <Footer />
      <style>{`
        .status-ref-input::placeholder {
          font-size: 14px;
        }

        @media (max-width: 600px) {
          .status-check-row {
            flex-direction: column !important;
          }

          .status-submit-button {
            width: 100% !important;
          }
        }
      `}</style>
    </>
  )
}
