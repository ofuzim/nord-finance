'use client'

import Link from 'next/link'

export function RowActions({ href }: { href: string }) {
  const fire = () => window.dispatchEvent(new CustomEvent('nav:start'))
  return (
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
    </div>
  )
}
