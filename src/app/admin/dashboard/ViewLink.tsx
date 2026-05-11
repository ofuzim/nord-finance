'use client'

import Link from 'next/link'

export function ViewLink({ href }: { href: string }) {
  return (
    <Link
      href={href}
      onClick={() => window.dispatchEvent(new CustomEvent('nav:start'))}
      style={{ color: '#C39529', fontSize: 12, textDecoration: 'none', fontWeight: 500, cursor: 'pointer' }}
    >
      View →
    </Link>
  )
}
