'use client'

import { useState } from 'react'
import { inviteAdminUser } from '@/app/actions/admin'
import type { AdminRole } from '@/types/database'

const inputStyle: React.CSSProperties = {
  width: '100%',
  backgroundColor: 'rgba(255,255,255,0.055)',
  border: '1px solid rgba(255,255,255,0.1)',
  borderRadius: 8,
  padding: '11px 14px',
  color: 'white',
  fontFamily: "'Poppins', sans-serif",
  fontSize: 13,
  outline: 'none',
  boxSizing: 'border-box',
}

export function InviteForm() {
  const [open, setOpen] = useState(false)
  const [email, setEmail] = useState('')
  const [fullName, setFullName] = useState('')
  const [role, setRole] = useState<AdminRole>('reviewer')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage(null)
    const result = await inviteAdminUser({ email, fullName, role })
    setLoading(false)
    if ('error' in result) {
      setMessage({ type: 'error', text: result.error })
    } else {
      setMessage({ type: 'success', text: `Invite sent to ${email}.` })
      setEmail('')
      setFullName('')
      setRole('reviewer')
    }
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        style={{
          backgroundColor: '#C39529',
          color: '#000',
          border: 'none',
          borderRadius: 8,
          padding: '10px 18px',
          fontSize: 11,
          fontWeight: 700,
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
          cursor: 'pointer',
        }}
      >
        + Invite Admin
      </button>

      {open && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 400,
          backgroundColor: 'rgba(0,0,0,0.75)',
          backdropFilter: 'blur(12px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24,
        }}>
          <div style={{
            width: 'min(440px, 100%)',
            backgroundColor: '#0f0f0f',
            border: '1px solid rgba(255,255,255,0.12)',
            borderRadius: 16,
            padding: '32px',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
              <p style={{ color: 'white', fontWeight: 600, fontSize: 15 }}>Invite Admin</p>
              <button onClick={() => { setOpen(false); setMessage(null) }} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', fontSize: 20, cursor: 'pointer', lineHeight: 1 }}>×</button>
            </div>

            {message && (
              <div style={{ marginBottom: 16, padding: '10px 14px', backgroundColor: message.type === 'success' ? 'rgba(34,197,94,0.07)' : 'rgba(239,68,68,0.07)', border: `1px solid ${message.type === 'success' ? 'rgba(34,197,94,0.2)' : 'rgba(239,68,68,0.2)'}`, borderRadius: 8 }}>
                <p style={{ color: message.type === 'success' ? '#22c55e' : '#ef4444', fontSize: 12 }}>{message.text}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <label style={{ display: 'block', color: 'rgba(255,255,255,0.4)', fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 7 }}>Full Name</label>
                <input type="text" value={fullName} onChange={e => setFullName(e.target.value)} required style={inputStyle} />
              </div>
              <div>
                <label style={{ display: 'block', color: 'rgba(255,255,255,0.4)', fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 7 }}>Email</label>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} required style={inputStyle} />
              </div>
              <div>
                <label style={{ display: 'block', color: 'rgba(255,255,255,0.4)', fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 7 }}>Role</label>
                <select value={role} onChange={e => setRole(e.target.value as AdminRole)} style={{ ...inputStyle, cursor: 'pointer' }}>
                  <option value="reviewer">Reviewer</option>
                  <option value="admin">Admin</option>
                  <option value="super_admin">Super Admin</option>
                </select>
              </div>
              <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
                <button type="button" onClick={() => { setOpen(false); setMessage(null) }} style={{ flex: 1, padding: '12px', backgroundColor: 'transparent', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 8, color: 'rgba(255,255,255,0.5)', fontSize: 12, cursor: 'pointer' }}>
                  Cancel
                </button>
                <button type="submit" disabled={loading} style={{ flex: 1, padding: '12px', backgroundColor: '#C39529', border: 'none', borderRadius: 8, color: '#000', fontSize: 12, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.6 : 1 }}>
                  {loading ? 'Sending…' : 'Send Invite'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
