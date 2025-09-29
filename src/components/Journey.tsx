'use client'

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { themeStyles } from '@/lib/theme'

export type JourneyStep = {
  title: string
  subtitle?: string
  body: string
}

type JourneyProps = {
  steps: JourneyStep[]
  title?: string
  description?: string
}

export default function Journey({ steps, title = 'My Marketing Journey', description = 'Follow the key milestones that shaped how I work today.' }: JourneyProps) {
  const [index, setIndex] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)
  const sectionRef = useRef<HTMLElement>(null)
  const userInteractingRef = useRef(false)
  const interactionTimer = useRef<number | null>(null)
  const count = steps.length

  const clampedSetIndex = useCallback((i: number) => setIndex(Math.max(0, Math.min(count - 1, i))), [count])

  const noteInteraction = useCallback(() => {
    userInteractingRef.current = true
    if (interactionTimer.current) window.clearTimeout(interactionTimer.current)
    interactionTimer.current = window.setTimeout(() => { userInteractingRef.current = false }, 900)
  }, [])

  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const handler = (e: WheelEvent) => {
      if (Math.abs(e.deltaY) < 20) return
      e.preventDefault()
      noteInteraction()
      clampedSetIndex(index + (e.deltaY > 0 ? 1 : -1))
    }
    el.addEventListener('wheel', handler, { passive: false })
    return () => el.removeEventListener('wheel', handler)
  }, [index, count, clampedSetIndex, noteInteraction])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
  if (e.key === 'ArrowRight') { noteInteraction(); clampedSetIndex(index + 1) }
  if (e.key === 'ArrowLeft') { noteInteraction(); clampedSetIndex(index - 1) }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [index, count, clampedSetIndex, noteInteraction])

  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const card = el.querySelector(`[data-step='${index}']`) as HTMLElement | null
    if (card) card.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' })
  }, [index])

  const progress = useMemo(() => (count > 1 ? index / (count - 1) : 0), [index, count])

  // Map page scroll to step index when the section is in view
  useEffect(() => {
    const section = sectionRef.current
    if (!section || count < 2) return
    let ticking = false
    const compute = () => {
      ticking = false
      if (userInteractingRef.current) return
      const y = window.scrollY
      const rect = section.getBoundingClientRect()
      const sectionTop = y + rect.top
      const sectionBottom = sectionTop + section.offsetHeight
      const start = sectionTop - window.innerHeight * 0.2
      const end = sectionBottom - window.innerHeight * 0.8
      const ratioRaw = (y - start) / (end - start)
      const ratio = Math.max(0, Math.min(1, ratioRaw))
      const newIndex = Math.round(ratio * (count - 1))
      if (newIndex !== index) setIndex(newIndex)
    }
    const onScroll = () => {
      if (!ticking) { requestAnimationFrame(compute); ticking = true }
    }
    const onResize = () => compute()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onResize)
    compute()
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onResize)
    }
  }, [index, count])

  return (
  <section ref={sectionRef} className={`${themeStyles.backgrounds.section} py-16`}>
      <div className={themeStyles.layout.container}>
        <div className="text-center mb-8">
          <h2 className={themeStyles.text.h2}>{title}</h2>
          <p className={themeStyles.text.body}>{description}</p>
        </div>

        {/* Progress bar */}
        <div className="mb-6">
          <div className="h-2 bg-neutral-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-primary-500 to-primary-600 transition-[width] duration-300"
              style={{ width: `${Math.max(6, progress * 100)}%` }}
            />
          </div>
          <div className="mt-2 text-sm text-neutral-600 text-right">Step {index + 1} of {count}</div>
        </div>

        {/* Carousel */}
        <div className="relative">
          <button
            aria-label="Previous step"
            onClick={() => clampedSetIndex(index - 1)}
            className="hidden md:flex absolute -left-2 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white border border-neutral-200 shadow hover:shadow-md items-center justify-center disabled:opacity-50"
            disabled={index === 0}
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div
            ref={containerRef}
            className="scrollbar-none snap-x snap-mandatory overflow-x-auto flex gap-6 pb-2"
          >
            {steps.map((s, i) => (
              <article
                key={i}
                data-step={i}
                className={`${themeStyles.cards.default} ${themeStyles.cards.hover} min-w-[85%] md:min-w-[48%] lg:min-w-[32%] snap-center p-6 md:p-8`}
              >
                <div className="text-xs uppercase tracking-wide text-primary-600 font-semibold mb-2">Milestone {i + 1}</div>
                <h3 className="text-2xl font-bold text-neutral-900 mb-2">{s.title}</h3>
                {s.subtitle && <p className="text-neutral-500 mb-3">{s.subtitle}</p>}
                <p className="text-neutral-700 leading-relaxed">{s.body}</p>
              </article>
            ))}
          </div>
          <button
            aria-label="Next step"
            onClick={() => clampedSetIndex(index + 1)}
            className="hidden md:flex absolute -right-2 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white border border-neutral-200 shadow hover:shadow-md items-center justify-center disabled:opacity-50"
            disabled={index === count - 1}
          >
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center gap-2 mt-6">
          {steps.map((_, i) => (
            <button
              key={i}
              aria-label={`Go to step ${i + 1}`}
              onClick={() => clampedSetIndex(i)}
              className={`w-2.5 h-2.5 rounded-full transition-all ${i === index ? 'bg-primary-600 w-6' : 'bg-neutral-300 hover:bg-neutral-400'}`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
