'use client'

import Link from 'next/link'
import type { ComponentProps } from 'react'

type Props = ComponentProps<typeof Link>

export function NavStartLink({ onClick, ...props }: Props) {
  return (
    <Link
      {...props}
      onClick={(event) => {
        window.dispatchEvent(new CustomEvent('nav:start'))
        onClick?.(event)
      }}
    />
  )
}
