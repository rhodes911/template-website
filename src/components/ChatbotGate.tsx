'use client'

import React from 'react'
import { usePathname } from 'next/navigation'
import ChatbotWizard from '@/components/ChatbotWizard'

// Renders the Chatbot only when not in TinaCMS admin.
// Shows on all site pages; hides on /admin (Tina UI).
export default function ChatbotGate() {
  const pathname = usePathname()
  const inTinaAdmin = pathname?.startsWith('/admin')
  if (inTinaAdmin) return null
  return <ChatbotWizard />
}
