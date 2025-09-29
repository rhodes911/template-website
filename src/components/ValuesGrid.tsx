'use client'

import React from 'react'
import { themeStyles } from '@/lib/theme'
import {
  Target,
  Heart,
  Users,
  Award,
  CheckCircle,
  Star,
  Lightbulb,
  Rocket,
  Shield,
  ThumbsUp,
  Leaf,
  CircleDot
} from 'lucide-react'

export type ValuesItem = {
  title: string
  description: string
  icon?: string
}

type ValuesGridProps = {
  title?: string
  subtitle?: string
  items: ValuesItem[]
}

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Target,
  Heart,
  Users,
  Award,
  CheckCircle,
  Star,
  Lightbulb,
  Rocket,
  Shield,
  ThumbsUp,
  Leaf,
}

function ValueIcon({ name }: { name?: string }) {
  const Icon = name && iconMap[name] ? iconMap[name] : CircleDot
  return (
    <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-600 text-white shadow-lg">
      <Icon className="h-7 w-7" />
    </div>
  )
}

export default function ValuesGrid({ title = 'What I Believe In', subtitle = 'The values that guide everything I do', items }: ValuesGridProps) {
  return (
    <section className={`${themeStyles.backgrounds.page} py-16`}>
      <div className={themeStyles.layout.container}>
        <div className="text-center mb-12">
          <h2 className={themeStyles.text.h2}>{title}</h2>
          <p className={themeStyles.text.body}>{subtitle}</p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {items.map((v) => (
            <div key={v.title} className={`${themeStyles.cards.default} ${themeStyles.cards.hover} p-8`}>
              <ValueIcon name={v.icon} />
              <h3 className="text-xl font-semibold text-neutral-900 mt-5 mb-2">{v.title}</h3>
              <p className={themeStyles.text.body}>{v.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
