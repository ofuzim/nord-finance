'use client'

import { useEffect } from 'react'

export function HashScroll() {
  useEffect(() => {
    const section = window.sessionStorage.getItem('nord-goto-section')
    if (!section) return
    window.sessionStorage.removeItem('nord-goto-section')

    let done = false
    const attempt = () => {
      if (done) return
      const el = document.getElementById(section)
      if (!el) return
      done = true
      const top = el.getBoundingClientRect().top + window.scrollY - 72
      window.history.replaceState(null, '', `/#${section}`)
      window.scrollTo({ top, behavior: 'smooth' })
    }

    setTimeout(attempt, 60)
    setTimeout(attempt, 200)
    setTimeout(attempt, 450)
  }, [])

  return null
}
