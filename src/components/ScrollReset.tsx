'use client'

import { useEffect, useLayoutEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'

const scrollKeyForPath = (pathname: string) => `nord-scroll:${pathname}`

export function ScrollReset() {
  const pathname = usePathname()
  const isFirstRun = useRef(true)

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

    return () => {
      saveScroll()
      window.removeEventListener('pagehide', saveScroll)
      window.removeEventListener('beforeunload', saveScroll)
      window.history.scrollRestoration = previousRestoration
    }
  }, [pathname])

  useLayoutEffect(() => {
    if (isFirstRun.current) {
      isFirstRun.current = false
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming | undefined

      if (navigation?.type === 'reload' || navigation?.type === 'back_forward') {
        const saved = window.sessionStorage.getItem(scrollKeyForPath(pathname))
        if (!saved) return

        const reveal = () => {
          document.documentElement.removeAttribute('data-restore-scroll')
        }
        let x = 0
        let y = 0

        try {
          ;({ x, y } = JSON.parse(saved) as { x: number; y: number })
        } catch {
          reveal()
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
        return
      }
    }

    window.scrollTo(0, 0)
  }, [pathname])

  return null
}
