'use client'

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { AVAILABLE_SERVICES, SERVICE_LABELS, type ServiceType } from '@/lib/validations'

type StepKey = 'greet' | 'name' | 'email' | 'services' | 'goal' | 'budget' | 'timeline' | 'review'

type ChatMessage = {
  role: 'assistant' | 'user'
  content: string
}

type WizardState = {
  name: string
  email: string
  services: ServiceType[]
  goal: string
  budget?: string
  timeline?: string
}

const STORAGE_KEY = 'eem-chatbot-wizard-v1'

function validateEmail(email: string) {
  return /\S+@\S+\.\S+/.test(email)
}

// Chat bubble with typewriter effect for assistant messages (module scope for stable identity)
const ChatBubble: React.FC<{ m: ChatMessage }> = ({ m }) => {
  const prefersReduced = typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
  const [typed, setTyped] = useState(prefersReduced || m.role !== 'assistant' ? m.content : '')
  const [isTyping, setIsTyping] = useState(!prefersReduced && m.role === 'assistant')

  useEffect(() => {
    if (m.role !== 'assistant' || prefersReduced) return
    let i = 0
    let cancelled = false
    const base = 18 // ms per character
    const punctPause = 120
    const step = () => {
      if (cancelled) return
      if (i >= m.content.length) {
        setIsTyping(false)
        return
      }
      const next = m.content.slice(0, i + 1)
      setTyped(next)
      i += 1
      // Smooth auto-scroll while typing
      window.dispatchEvent(new Event('chatbot-typing-tick'))
      const ch = m.content[i - 1]
      const delay = /[\.!?,]/.test(ch || '') ? punctPause : base
      setTimeout(step, delay)
    }
    const id = setTimeout(step, 120)
    return () => { clearTimeout(id); cancelled = true }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [m.content, m.role])

  const classes = m.role === 'assistant'
    ? 'bg-white border border-neutral-200 text-neutral-800'
    : 'bg-primary-600 text-white ml-auto'

  return (
    <div className={`max-w-[85%] rounded-2xl px-4 py-2 text-sm whitespace-pre-wrap ${classes}`}>
      {typed}
      {isTyping && m.role === 'assistant' && <span className="opacity-60">▍</span>}
    </div>
  )
}

export default function ChatbotWizard() {
  const [open, setOpen] = useState(false)
  const [step, setStep] = useState<StepKey>('greet')
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState<null | { success: boolean; message: string }>(null)
  const [state, setState] = useState<WizardState>({ name: '', email: '', services: [], goal: '', budget: '', timeline: '' })

  const scrollRef = useRef<HTMLDivElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)
  const seededRef = useRef<Partial<Record<StepKey, boolean>>>({})
  const nameInputRef = useRef<HTMLInputElement>(null)
  const emailInputRef = useRef<HTMLInputElement>(null)
  const goalTextAreaRef = useRef<HTMLTextAreaElement>(null)
  const budgetInputRef = useRef<HTMLInputElement>(null)
  const timelineInputRef = useRef<HTMLInputElement>(null)

  // Smooth auto-scroll during assistant typing
  useEffect(() => {
    const onTick = () => {
      scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' })
    }
    window.addEventListener('chatbot-typing-tick', onTick)
    return () => window.removeEventListener('chatbot-typing-tick', onTick)
  }, [])

  // ChatBubble is defined at module scope above

  // Reset conversation to initial state
  const resetConversation = () => {
    try { localStorage.removeItem(STORAGE_KEY) } catch {}
    setSubmitted(null)
    setMessages([])
    setState({ name: '', email: '', services: [], goal: '', budget: '', timeline: '' })
    setStep('greet')
  seededRef.current = {}
  }

  // Load/save progress
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) {
        const parsed = JSON.parse(raw)
        if (parsed && typeof parsed === 'object') {
          setState((s) => ({ ...s, ...parsed }))
        }
      }
    } catch {}
  }, [])

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
    } catch {}
  }, [state])

  // Global open/close wiring (no link interception)
  useEffect(() => {
    const openHandler = () => setOpen(true)
    const closeHandler = () => setOpen(false)
    const resetHandler = () => resetConversation()
    window.addEventListener('open-chatbot-wizard', openHandler as EventListener)
    window.addEventListener('close-chatbot-wizard', closeHandler as EventListener)
    window.addEventListener('reset-chatbot-wizard', resetHandler as EventListener)
    return () => {
      window.removeEventListener('open-chatbot-wizard', openHandler as EventListener)
      window.removeEventListener('close-chatbot-wizard', closeHandler as EventListener)
      window.removeEventListener('reset-chatbot-wizard', resetHandler as EventListener)
    }
  }, [])

  // Body scroll lock toggling (key handling mounted later after deps are defined)
  useEffect(() => {
    if (open) {
      document.body.classList.add('overflow-hidden')
    } else {
      document.body.classList.remove('overflow-hidden')
    }
    return () => document.body.classList.remove('overflow-hidden')
  }, [open])

  // Seed assistant message per step
  useEffect(() => {
    const last = messages[messages.length - 1]
    const push = (text: string) => setMessages((m) => [...m, { role: 'assistant', content: text }])
    if (seededRef.current[step]) return
    if (last?.role === 'assistant') return
    if (step === 'greet') {
      setMessages([{ role: 'assistant', content: "Hi—I'm your marketing assistant. I’ll take a few quick details for Ellie.\nReady to start?" }])
      seededRef.current[step] = true
    } else if (step === 'name') {
      push("Great! What's your name?")
      seededRef.current[step] = true
    } else if (step === 'email') {
      push('Nice to meet you. What’s the best email to reach you? We’ll use this to follow up with your plan (no spam).')
      seededRef.current[step] = true
    } else if (step === 'services') {
      push('Which services are you interested in? Pick one or more—tap to select and tap again to unselect.')
      seededRef.current[step] = true
    } else if (step === 'goal') {
      push('What’s the main goal you want to achieve in the next 3 months?')
      seededRef.current[step] = true
    } else if (step === 'budget') {
      push('Do you have a rough monthly budget in mind? (Optional)')
      seededRef.current[step] = true
    } else if (step === 'timeline') {
      push('What’s your timeline to get started? (Optional)')
      seededRef.current[step] = true
    } else if (step === 'review') {
      push('Here’s a quick summary. Ready for me to send this to Ellie so she can reach out with next steps?')
      seededRef.current[step] = true
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step])

  // Auto-focus the current step's input/textarea for a smoother flow
  useEffect(() => {
    if (!open) return
    const focus = () => {
      if (step === 'name') nameInputRef.current?.focus()
      else if (step === 'email') emailInputRef.current?.focus()
      else if (step === 'goal') goalTextAreaRef.current?.focus()
      else if (step === 'budget') budgetInputRef.current?.focus()
      else if (step === 'timeline') timelineInputRef.current?.focus()
    }
    const id = setTimeout(focus, 0)
    return () => clearTimeout(id)
  }, [open, step])

  useEffect(() => {
    // Auto-scroll chat
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' })
  }, [messages])

  // Auto-scroll when submission status appears (success or error)
  useEffect(() => {
    if (!submitted) return
    const id = setTimeout(() => {
      scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' })
    }, 0)
    return () => clearTimeout(id)
  }, [submitted])

  const canAdvance = useMemo(() => {
    switch (step) {
      case 'greet':
        return true
      case 'name':
        return state.name.trim().length > 1
      case 'email':
        return validateEmail(state.email)
      case 'services':
        return state.services.length > 0
      case 'goal':
        return (state.goal || '').trim().length > 5
      case 'budget':
      case 'timeline':
      case 'review':
        return true
      default:
        return false
    }
  }, [step, state])

  const serviceOptions = useMemo(() => AVAILABLE_SERVICES.map((s) => ({ value: s, label: SERVICE_LABELS[s] })), [])

  const submitUser = useCallback((text: string) => {
    if (!text) return
    setMessages((m) => [...m, { role: 'user', content: text }])
  }, [setMessages])

  const nextStep = useCallback(() => {
    setStep((prev) => {
      const order: StepKey[] = ['greet', 'name', 'email', 'services', 'goal', 'budget', 'timeline', 'review']
      const i = order.indexOf(prev)
      return order[Math.min(i + 1, order.length - 1)]
    })
  }, [])

  function prevStep() {
    setStep((prev) => {
      const order: StepKey[] = ['greet', 'name', 'email', 'services', 'goal', 'budget', 'timeline', 'review']
      const i = order.indexOf(prev)
      return order[Math.max(i - 1, 0)]
    })
  }

  const handlePrimaryAction = useCallback(async () => {
  if (loading) return
  if (step === 'review' && submitted?.success) return
    if (step === 'greet') {
      submitUser('Yes, let’s do it.')
      nextStep()
      return
    }
    if (step === 'name') {
      if (!state.name.trim()) return
      submitUser(state.name)
      nextStep()
      return
    }
    if (step === 'email') {
      if (!validateEmail(state.email)) return
      submitUser(state.email)
      nextStep()
      return
    }
    if (step === 'services') {
      submitUser(state.services.map((s) => SERVICE_LABELS[s]).join(', '))
      nextStep()
      return
    }
    if (step === 'goal') {
      submitUser(state.goal)
      nextStep()
      return
    }
    if (step === 'budget') {
      if (state.budget) submitUser(state.budget)
      nextStep()
      return
    }
    if (step === 'timeline') {
      if (state.timeline) submitUser(state.timeline)
      nextStep()
      return
    }
  if (step === 'review') {
      // Submit lead
      setLoading(true)
      setSubmitted(null)
      try {
        const summary = `Chatbot Wizard Lead\nName: ${state.name}\nEmail: ${state.email}\nServices: ${state.services.map((s) => SERVICE_LABELS[s]).join(', ')}\nGoal: ${state.goal}\nBudget: ${state.budget || 'n/a'}\nTimeline: ${state.timeline || 'n/a'}`
        const res = await fetch('/api/submit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: state.name,
            email: state.email,
            message: summary,
            services: state.services,
          }),
        })
        const json = await res.json()
        if (json?.success) {
          setSubmitted({ success: true, message: json.message || 'Sent! We\'ll be in touch.' })
      // Clear persisted progress but keep UI summary intact
      try { localStorage.removeItem(STORAGE_KEY) } catch {}
        } else {
          setSubmitted({ success: false, message: json?.message || 'Unable to send right now.' })
        }
      } catch {
        setSubmitted({ success: false, message: 'Network error. Please try again later.' })
      } finally {
        setLoading(false)
      }
    }
  }, [loading, step, submitted, state, nextStep, submitUser])

  function toggleService(svc: ServiceType) {
    setState((prev) => {
      const exists = prev.services.includes(svc)
      return { ...prev, services: exists ? prev.services.filter((s) => s !== svc) : [...prev.services, svc] }
    })
  }

  // Key handling: Escape to close, Enter (on keyup) to advance/submit
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false)
        return
      }
      if (!open) return
      // Use keyup so input state includes the last typed character
  if (e.type === 'keyup' && e.key === 'Enter') {
        // Ignore while composing (IME)
        if ((e as KeyboardEvent).isComposing) return
        const active = (document.activeElement as HTMLElement | null)
        const withinPanel = panelRef.current ? !!active && panelRef.current.contains(active) : false
        if (!withinPanel) return

        const tag = active?.tagName?.toLowerCase()
        const isInput = tag === 'input'
        const isTextArea = tag === 'textarea'
        const isButton = tag === 'button'
        if (isButton) return
        if (isTextArea && e.shiftKey) return

  const allow = isInput || isTextArea || step === 'services' || step === 'greet' || (step === 'review' && !submitted?.success)
        if (!allow) return
        // Handle per-step using the current DOM value to avoid stale state
        if (loading) return
        if (step === 'greet') {
          submitUser('Yes, let’s do it.')
          nextStep()
          return
        }
        if (step === 'name' && isInput) {
          const v = (active as HTMLInputElement).value
          if (!v.trim()) return
          setState((s) => ({ ...s, name: v }))
          submitUser(v)
          nextStep()
          return
        }
        if (step === 'email' && isInput) {
          const v = (active as HTMLInputElement).value
          if (!validateEmail(v)) return
          setState((s) => ({ ...s, email: v }))
          submitUser(v)
          nextStep()
          return
        }
        if (step === 'services') {
          // Just advance; selection is via buttons
          if (!canAdvance) return
          nextStep()
          return
        }
        if (step === 'goal' && isTextArea) {
          const v = (active as HTMLTextAreaElement).value
          if ((v || '').trim().length <= 5) return
          setState((s) => ({ ...s, goal: v }))
          submitUser(v)
          nextStep()
          return
        }
        if (step === 'budget' && isInput) {
          const v = (active as HTMLInputElement).value
          setState((s) => ({ ...s, budget: v }))
          if (v) submitUser(v)
          nextStep()
          return
        }
        if (step === 'timeline' && isInput) {
          const v = (active as HTMLInputElement).value
          setState((s) => ({ ...s, timeline: v }))
          if (v) submitUser(v)
          nextStep()
          return
        }
    if (step === 'review') {
          // Use the existing submit flow
          handlePrimaryAction()
          return
        }
      }
    }
    window.addEventListener('keyup', onKey)
    return () => window.removeEventListener('keyup', onKey)
  }, [open, canAdvance, loading, step, submitted, handlePrimaryAction, nextStep, submitUser])

  // Simple CTA button (floating)
  return (
    <>
      {/* Floating Toggle Button */}
      <button
        type="button"
        aria-label="Open lead capture assistant"
        onClick={() => setOpen((o) => !o)}
        className="fixed z-50 bottom-5 right-5 rounded-full bg-primary-600 hover:bg-primary-700 text-white shadow-xl px-5 py-4 text-sm font-semibold focus:outline-none focus:ring-4 focus:ring-primary-300"
      >
        {open ? 'Close Assistant' : 'Get Marketing Plan'}
      </button>

      {/* Drawer/Panel */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/30" onClick={() => setOpen(false)} />

          <div ref={panelRef} className="relative w-full sm:w-[520px] max-w-[96vw] max-h-[85vh] rounded-t-2xl sm:rounded-2xl bg-white shadow-2xl border border-neutral-200 overflow-hidden flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-neutral-200 bg-gradient-to-r from-primary-50 to-white">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-primary-500 animate-pulse" />
                <h3 className="text-sm font-semibold text-neutral-900">Marketing Assistant</h3>
              </div>
              <div className="flex items-center gap-2">
                <button
                  className="text-xs px-2 py-1 rounded-md border border-neutral-300 text-neutral-700 hover:bg-neutral-50"
                  onClick={resetConversation}
                  aria-label="Start over"
                  title="Start over"
                >
                  Reset
                </button>
                <button className="text-neutral-500 hover:text-neutral-900" onClick={() => setOpen(false)} aria-label="Close">
                  ×
                </button>
              </div>
            </div>

            {/* Messages */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-3 space-y-3 bg-neutral-50/60">
              {messages.map((m, i) => (
                <ChatBubble key={i} m={m} />
              ))}

              {/* Step-specific UI */}
              {step === 'name' && (
                <div className="mt-2">
                  <input
                    ref={nameInputRef}
                    value={state.name}
                    onChange={(e) => setState((s) => ({ ...s, name: e.target.value }))}
                    placeholder="Your name"
                    className="w-full rounded-xl border border-neutral-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-300 bg-white"
                  />
                </div>
              )}
              {step === 'email' && (
                <div className="mt-2">
                  <input
                    ref={emailInputRef}
                    value={state.email}
                    onChange={(e) => setState((s) => ({ ...s, email: e.target.value }))}
                    placeholder="your@email.com"
                    className="w-full rounded-xl border border-neutral-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-300 bg-white"
                  />
                  {!!state.email && !validateEmail(state.email) && (
                    <p className="mt-1 text-xs text-red-600">Please enter a valid email.</p>
                  )}
                </div>
              )}
              {step === 'services' && (
                <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {serviceOptions.map((opt) => (
                    <button
                      type="button"
                      key={opt.value}
                      onClick={() => toggleService(opt.value)}
                      className={`text-left rounded-xl border px-3 py-2 text-sm transition-colors ${state.services.includes(opt.value) ? 'bg-primary-50 border-primary-300 text-primary-700' : 'bg-white border-neutral-300 hover:border-primary-300'}`}
                    >
                      {opt.label}
                    </button>
                  ))}
                  {state.services.length > 0 && (
                    <p className="col-span-full text-xs text-primary-700">Selected: {state.services.map((s) => SERVICE_LABELS[s]).join(', ')}</p>
                  )}
                </div>
              )}
              {step === 'goal' && (
                <textarea
                  ref={goalTextAreaRef}
                  value={state.goal}
                  onChange={(e) => setState((s) => ({ ...s, goal: e.target.value }))}
                  rows={4}
                  placeholder="e.g., Generate 20 qualified leads/month, launch a new offer, improve SEO rankings, etc."
                  className="w-full rounded-xl border border-neutral-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-300 bg-white"
                />)
              }
              {step === 'budget' && (
                <input
                  ref={budgetInputRef}
                  value={state.budget}
                  onChange={(e) => setState((s) => ({ ...s, budget: e.target.value }))}
                  placeholder="Optional: Monthly budget (e.g. £1k-£3k)"
                  className="w-full rounded-xl border border-neutral-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-300 bg-white"
                />
              )}
              {step === 'timeline' && (
                <input
                  ref={timelineInputRef}
                  value={state.timeline}
                  onChange={(e) => setState((s) => ({ ...s, timeline: e.target.value }))}
                  placeholder="Optional: When do you want to start?"
                  className="w-full rounded-xl border border-neutral-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-300 bg-white"
                />
              )}

              {step === 'review' && (
                <div className="text-sm bg-white border border-neutral-200 rounded-xl p-3">
                  <p className="font-semibold mb-1">Summary</p>
                  <ul className="space-y-1 text-neutral-700">
                    <li><span className="font-medium">Name:</span> {state.name || '—'}</li>
                    <li><span className="font-medium">Email:</span> {state.email || '—'}</li>
                    <li><span className="font-medium">Services:</span> {state.services.map((s) => SERVICE_LABELS[s]).join(', ') || '—'}</li>
                    <li><span className="font-medium">Goal:</span> {state.goal || '—'}</li>
                    <li><span className="font-medium">Budget:</span> {state.budget || '—'}</li>
                    <li><span className="font-medium">Timeline:</span> {state.timeline || '—'}</li>
                  </ul>
                </div>
              )}

              {submitted && (
                <div className={`text-sm rounded-xl p-3 border ${submitted.success ? 'bg-green-50 border-green-200 text-green-800' : 'bg-rose-50 border-rose-200 text-rose-800'}`}>
                  {submitted.message}
                </div>
              )}
            </div>

            {/* Footer Actions */}
            <div className="flex items-center justify-between gap-2 px-4 py-3 border-t border-neutral-200 bg-white">
              <div className="text-xs text-neutral-500">Takes ~60 seconds • No spam</div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  className="px-3 py-2 text-xs rounded-md border border-neutral-300 text-neutral-700 hover:bg-neutral-50"
                  onClick={prevStep}
                  disabled={step === 'greet' || loading}
                >
                  Back
                </button>
                <button
                  type="button"
                  className={`px-3 py-2 text-xs rounded-md font-semibold text-white ${step === 'review' ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-primary-600 hover:bg-primary-700'} disabled:opacity-50`}
                  onClick={handlePrimaryAction}
                  disabled={!canAdvance || loading}
                >
                  {loading ? 'Sending…' : step === 'review' ? 'Send to Ellie' : 'Next'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
