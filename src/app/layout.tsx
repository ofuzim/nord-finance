import type { Metadata, Viewport } from 'next'
import favIcon from '@/imports/fav.jpg'
import './globals.css'

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
}

export const metadata: Metadata = {
  title: 'Nord Finance',
  description: 'Premium auto financing solutions',
  icons: {
    icon: favIcon.src,
    shortcut: favIcon.src,
    apple: favIcon.src,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body style={{ margin: 0, height: '100%' }}>
        {children}
      </body>
    </html>
  )
}
