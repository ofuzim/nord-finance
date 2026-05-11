'use client'

import { useState } from 'react'
import { addApplicationNote } from '@/app/actions/admin'

interface Note {
  id: string
  note: string
  created_at: string
  admin_users: { full_name: string; email: string } | null
}

export function NotesPanel({
  applicationId,
  initialNotes,
}: {
  applicationId: string
  initialNotes: Note[]
}) {
  const [notes, setNotes] = useState(initialNotes)
  const [text, setText] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleAdd = async () => {
    if (!text.trim() || loading) return
    setLoading(true)
    setError('')
    const result = await addApplicationNote({ applicationId, note: text.trim() })
    setLoading(false)
    if ('error' in result) {
      setError(result.error)
    } else {
      setNotes(prev => [{
        id: crypto.randomUUID(),
        note: text.trim(),
        created_at: new Date().toISOString(),
        admin_users: null,
      }, ...prev])
      setText('')
    }
  }

  return (
    <div style={{ backgroundColor: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, padding: '20px 22px' }}>
      <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 10, fontWeight: 600, letterSpacing: '0.16em', textTransform: 'uppercase', marginBottom: 16 }}>
        Internal Notes
      </p>

      {/* Add note */}
      <div style={{ marginBottom: 20 }}>
        <textarea
          value={text}
          onChange={e => setText(e.target.value)}
          placeholder="Add an internal note…"
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
            marginBottom: 8,
          }}
        />
        {error && <p style={{ color: '#ef4444', fontSize: 12, marginBottom: 8 }}>{error}</p>}
        <button
          onClick={handleAdd}
          disabled={!text.trim() || loading}
          style={{
            backgroundColor: text.trim() ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.03)',
            color: text.trim() ? 'rgba(255,255,255,0.8)' : 'rgba(255,255,255,0.2)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: 8,
            padding: '9px 16px',
            fontSize: 11,
            fontWeight: 600,
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            cursor: text.trim() && !loading ? 'pointer' : 'not-allowed',
          }}
        >
          {loading ? 'Saving…' : 'Add Note'}
        </button>
      </div>

      {/* Notes list */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {notes.length === 0 && (
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 13 }}>No notes yet.</p>
        )}
        {notes.map(n => (
          <div key={n.id} style={{ borderLeft: '2px solid rgba(255,255,255,0.12)', paddingLeft: 14 }}>
            <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: 13, lineHeight: 1.7, marginBottom: 6 }}>{n.note}</p>
            <p style={{ color: 'rgba(255,255,255,0.38)', fontSize: 11 }}>
              {n.admin_users?.full_name ?? 'Admin'} · {new Date(n.created_at).toLocaleDateString('en-NG', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}
