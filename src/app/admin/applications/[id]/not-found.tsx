import Link from 'next/link'

export default function ApplicationNotFound() {
  return (
    <div style={{ padding: '36px 40px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 24 }}>
        <Link href="/admin/applications" style={{ color: 'rgba(255,255,255,0.35)', fontSize: 12, textDecoration: 'none' }}>Applications</Link>
        <span style={{ color: 'rgba(255,255,255,0.2)', fontSize: 12 }}>›</span>
        <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: 12 }}>Not found</span>
      </div>

      <div style={{
        marginTop: 80,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        gap: 12,
      }}>
        <p style={{ color: 'rgba(255,255,255,0.1)', fontSize: 64, fontWeight: 800, lineHeight: 1 }}>404</p>
        <h1 style={{ color: 'white', fontSize: 20, fontWeight: 600 }}>Application not found</h1>
        <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: 13, maxWidth: 340 }}>
          This application ID does not exist or may have been removed.
        </p>
        <Link
          href="/admin/applications"
          style={{
            marginTop: 16,
            display: 'inline-block',
            backgroundColor: '#C39529',
            color: '#000',
            border: 'none',
            borderRadius: 8,
            padding: '10px 20px',
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            textDecoration: 'none',
          }}
        >
          ← Back to Applications
        </Link>
      </div>
    </div>
  )
}
