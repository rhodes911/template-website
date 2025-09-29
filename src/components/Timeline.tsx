'use client'

import React, { useEffect } from 'react'
import { themeStyles } from '@/lib/theme'

export type TimelineStep = {
  title: string
  subtitle?: string
  period?: string
  body: string | React.ReactNode
}

type TimelineProps = {
  steps: TimelineStep[]
  title?: string
  description?: string
}

// minimal reveal utility
const useReveal = () => {
  useEffect(() => {
    const items = Array.from(document.querySelectorAll('[data-timeline-reveal]')) as HTMLElement[]
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          (e.target as HTMLElement).classList.add('show')
          io.unobserve(e.target)
        }
      })
    }, { threshold: 0.2 })
    items.forEach(el => io.observe(el))
    return () => io.disconnect()
  }, [])
}

export default function Timeline({ steps, title = 'Journey', description = 'Key milestones along the way' }: TimelineProps) {
  useReveal()
  return (
    <section className={`${themeStyles.backgrounds.section} py-16`}>
      <div className={themeStyles.layout.container}>
        <div className="text-center mb-10">
          <h2 className={themeStyles.text.h2}>{title}</h2>
          <p className={themeStyles.text.body}>{description}</p>
        </div>

        <div className="relative">
          {/* Vertical line */}
          <div aria-hidden className="absolute left-4 sm:left-1/2 top-0 bottom-0 w-px bg-neutral-200 sm:-translate-x-1/2" />

          <ol className="space-y-10">
            {steps.map((s, idx) => (
              <li key={idx} className="relative">
                {/* Marker */}
                <div aria-hidden className="absolute left-4 sm:left-1/2 sm:-translate-x-1/2 top-2 w-3 h-3 rounded-full bg-white border-2 border-primary-600 shadow" />

                <div data-timeline-reveal className="timeline-reveal relative sm:grid sm:grid-cols-2 sm:gap-10">
                  {/* Left/Right alternate */}
                  <div className={`bg-white border border-neutral-200 rounded-2xl shadow p-6 ${idx % 2 === 0 ? 'sm:col-start-1' : 'sm:col-start-2'}`}>
                    <div className="text-xs uppercase tracking-wide text-primary-600 font-semibold mb-2">Step {idx + 1}</div>
                    <h3 className="text-xl font-bold text-neutral-900 mb-1">{s.title}</h3>
                    {s.subtitle && <p className="text-neutral-500 mb-3">{s.subtitle}</p>}
                    {typeof s.body === 'string' ? (
                      <p className="text-neutral-700 leading-relaxed">{s.body}</p>
                    ) : s.body}
                    {s.period && <div className="mt-4 text-sm text-neutral-500">{s.period}</div>}
                  </div>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>

      <style jsx global>{`
        .timeline-reveal{opacity:0; transform:translateY(8px); transition:opacity .5s ease, transform .5s ease}
        .timeline-reveal.show{opacity:1; transform:translateY(0)}
      `}</style>
    </section>
  )
}
