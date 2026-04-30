'use client'

import { useEffect, useLayoutEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'

const scrollKeyForPath = (pathname: string) => `nord-scroll:${pathname}`

export function ScrollReset() {
  const pathname = usePathname()
  const isFirstRun = useRef(true)
  const isBackNav = useRef(false)
  const pathnameRef = useRef(pathname)

  const reveal = () => {
    document.documentElement.removeAttribute('data-restore-scroll')
  }

  // Keep pathnameRef current so the popstate handler always sees the right pathname.
  useEffect(() => {
    pathnameRef.current = pathname
  }, [pathname])

  // Detect browser back/forward — save current scroll before Next.js swaps the page.
  useEffect(() => {
    const onPopState = () => {
      window.sessionStorage.setItem(
        scrollKeyForPath(pathnameRef.current),
        JSON.stringify({ x: window.scrollX, y: window.scrollY })
      )
      isBackNav.current = true
    }
    window.addEventListener('popstate', onPopState)
    return () => window.removeEventListener('popstate', onPopState)
  }, [])

  // Save scroll on full-page exit (navigating to external site or hard reload).
  useEffect(() => {
    const previousRestoration = window.history.scrollRestoration
    window.history.scrollRestoration = 'manual'

    const saveScroll = () => {
      window.sessionStorage.setItem(
        scrollKeyForPath(pathname),
        JSON.stringify({ x: window.scrollX, y: window.scrollY })
      )
    }

    window.addEventListener('pagehide', saveScroll)
    window.addEventListener('beforeunload', saveScroll)
    window.addEventListener('pageshow', reveal)

    return () => {
      window.removeEventListener('pagehide', saveScroll)
      window.removeEventListener('beforeunload', saveScroll)
      window.removeEventListener('pageshow', reveal)
      window.history.scrollRestoration = previousRestoration
    }
  }, [pathname])

  useLayoutEffect(() => {
    const fallbackReveal = window.setTimeout(reveal, 700)

    if (isFirstRun.current) {
      isFirstRun.current = false
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming | undefined

      if (navigation?.type === 'reload' || navigation?.type === 'back_forward') {
        const saved = window.sessionStorage.getItem(scrollKeyForPath(pathname))
        if (!saved) {
          reveal()
          window.clearTimeout(fallbackReveal)
          return
        }
        let x = 0
        let y = 0

        try {
          ;({ x, y } = JSON.parse(saved) as { x: number; y: number })
        } catch {
          reveal()
          window.clearTimeout(fallbackReveal)
          return
        }

        const restore = () => {
          window.scrollTo(x, y)
          reveal()
        }

        restore()
        requestAnimationFrame(() => {
          restore()
          requestAnimationFrame(restore)
        })
        window.setTimeout(restore, 120)
        window.setTimeout(restore, 360)
        return () => window.clearTimeout(fallbackReveal)
      }

      reveal()
      window.scrollTo(0, 0)
      return () => window.clearTimeout(fallbackReveal)
    }

    // Client-side back/forward navigation — restore saved scroll position.
    if (isBackNav.current) {
      isBackNav.current = false
      const saved = window.sessionStorage.getItem(scrollKeyForPath(pathname))
      if (saved) {
        try {
          const { x, y } = JSON.parse(saved) as { x: number; y: number }
          window.scrollTo(x, y)
          reveal()
          window.clearTimeout(fallbackReveal)
          return () => window.clearTimeout(fallbackReveal)
        } catch {
          // fall through to scroll-to-top
        }
      }
    }

    reveal()
    window.scrollTo(0, 0)
    return () => window.clearTimeout(fallbackReveal)
  }, [pathname])

  return null
}
