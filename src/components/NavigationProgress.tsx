'use client'

import { useEffect, useRef, useState } from 'react'
import { usePathname } from 'next/navigation'

type Phase = 'idle' | 'loading' | 'done'

export function NavigationProgress() {
  const [phase, setPhase] = useState<Phase>('idle')
  const pathname = usePathname()
  const prevPath = useRef(pathname)
  const doneTimer = useRef<number | null>(null)

  useEffect(() => {
    const onStart = () => {
      if (doneTimer.current) { clearTimeout(doneTimer.current); doneTimer.current = null }
      setPhase('loading')
    }
    window.addEventListener('nav:start', onStart)
    return () => window.removeEventListener('nav:start', onStart)
  }, [])

  useEffect(() => {
    if (pathname === prevPath.current) return
    prevPath.current = pathname
    if (phase !== 'loading') return
    if (doneTimer.current) clearTimeout(doneTimer.current)
    setPhase('done')
    doneTimer.current = window.setTimeout(() => {
      setPhase('idle')
      doneTimer.current = null
    }, 550)
  }, [pathname, phase])

  useEffect(() => () => { if (doneTimer.current) clearTimeout(doneTimer.current) }, [])

  if (phase === 'idle') return null

  return (
    <>
      <div
        key={phase}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          height: 2,
          zIndex: 9999,
          pointerEvents: 'none',
          background: 'linear-gradient(90deg, #C39529, #EDD98A, #C39529)',
          backgroundSize: '200% 100%',
          ...(phase === 'loading'
            ? { animation: 'navprog-load 9s cubic-bezier(0.08, 0, 0, 1) forwards, navprog-shimmer 1.4s linear infinite' }
            : { width: '100%', animation: 'navprog-done 0.5s ease forwards' }
          ),
        }}
      />
      <style>{`
        @keyframes navprog-load {
          from { width: 0 }
          to   { width: 75% }
        }
        @keyframes navprog-shimmer {
          from { background-position: 200% 0 }
          to   { background-position: -200% 0 }
        }
        @keyframes navprog-done {
          0%   { opacity: 1 }
          60%  { opacity: 1 }
          100% { opacity: 0 }
        }
      `}</style>
    </>
  )
}
