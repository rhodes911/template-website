'use client'

import { trackEmailClick } from '@/components/GoogleAnalytics'

interface TrackedEmailLinkProps {
  href: string
  children: React.ReactNode
  className?: string
}

export function TrackedEmailLink({ href, children, className }: TrackedEmailLinkProps) {
  const handleClick = () => {
    trackEmailClick()
  }

  return (
    <a 
      href={href}
      className={className}
      onClick={handleClick}
    >
      {children}
    </a>
  )
}
