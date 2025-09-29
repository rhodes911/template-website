'use client'

import { useEffect } from 'react'

// This page mounts Tina's admin shell via the static HTML in /public/admin,
// but keeps the visible URL as /admin. We load the HTML into an iframe without
// allowing that iframe to navigate to /admin again (which would recurse).
export default function AdminPage() {
  useEffect(() => {
    // Guard: if the user somehow lands here inside an iframe, break out
    try {
      if (window.self !== window.top) {
        window.top!.location.href = '/admin'
      }
    } catch {
      /* no-op */
    }
  }, [])

  return (
    <main style={{ height: '100dvh' }}>
      <iframe
        src="/admin/index.html#/"
        style={{ border: 0, width: '100%', height: '100%' }}
        // Allow Tina to set cookies/sessionStorage and open auth popups
        sandbox="allow-scripts allow-same-origin allow-forms allow-modals allow-popups"
        title="TinaCMS Admin"
      />
    </main>
  )
}
