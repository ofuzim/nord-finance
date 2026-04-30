import type { Metadata, Viewport } from 'next'
import favIcon from '@/imports/fav.jpg'
import { ScrollReset } from '@/components/ScrollReset'
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
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                history.scrollRestoration = 'manual';
                var nav = performance.getEntriesByType('navigation')[0];
                var isRestore = nav && (nav.type === 'reload' || nav.type === 'back_forward');
                var saved = sessionStorage.getItem('nord-scroll:' + location.pathname);
                if (isRestore && saved) document.documentElement.dataset.restoreScroll = 'true';
                addEventListener('pageshow', function () {
                  document.documentElement.removeAttribute('data-restore-scroll');
                }, { once: true });
                setTimeout(function () {
                  document.documentElement.removeAttribute('data-restore-scroll');
                }, 900);
              } catch (_) {}
            `,
          }}
        />
        <style>{`html[data-restore-scroll="true"] body { visibility: hidden; }`}</style>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400&display=swap"
        />
        <link rel="preload" href="/fonts/morpha.otf" as="font" type="font/otf" crossOrigin="anonymous" />
        <link rel="preload" href="/fonts/morpha_bold.otf" as="font" type="font/otf" crossOrigin="anonymous" />
      </head>
      <body style={{ margin: 0, height: '100%', fontFamily: "'Poppins', sans-serif" }}>
        <ScrollReset />
        {children}
      </body>
    </html>
  )
}
