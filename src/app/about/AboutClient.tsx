"use client"

import Link from 'next/link'
import Image from 'next/image'
import React, { useEffect } from 'react'
import { ArrowRight, Star, Users, BadgeCheck, Sparkles, Target, Heart, ShieldCheck, Rocket, Zap, CheckCircle, Mail, Linkedin, Search, FileText, Layout } from 'lucide-react'
import TestimonialRotator from '@/components/TestimonialRotator'
import PortraitCard from '@/components/PortraitCard'
import { themeStyles, getThemeClasses } from '@/lib/theme'

export type AboutClientProps = {
  data: {
    name: string
    title: string
    heroTitle: string
    heroSubtitle: string
    heroDescription: string
    profileImage: string
  profileImageFocus?: { x?: number; y?: number; zoom?: number }
    rating: number
    totalClients: string
    ctaTitle: string
    ctaDescription: string
  content: string
  storyApproachTitle?: string
  storyApproachIcon?: string
  storyApproachTagline?: string
  storyApproachBody?: string
  storyDifferentiators?: { title: string; description?: string; icon?: string }[]
  storyDifferentiatorsTitle?: string
  storyMissionTitle?: string
  storyMissionIcon?: string
  storyMissionBody?: string
  }
  markdown?: React.ReactNode
  journeySteps?: never
  testimonialItems?: { quote: string; name: string; role?: string; metrics?: string[]; slug?: string }[]
}

// lightweight reveal-on-scroll
const useReveal = () => {
  useEffect(() => {
    const items = Array.from(document.querySelectorAll('[data-reveal]')) as HTMLElement[]
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          (e.target as HTMLElement).classList.add('show')
          io.unobserve(e.target)
        }
      })
    }, { threshold: 0.15, rootMargin: '0px 0px -10% 0px' })
    items.forEach(el => io.observe(el))
    return () => io.disconnect()
  }, [])
}

export default function AboutClient({ data, markdown, testimonialItems }: AboutClientProps) {
  useReveal()
  // Quick services list for the portrait flip card back (business card style)
  const quickServices = [
    { name: 'SEO', href: '/services/seo', Icon: Search },
    { name: 'Content Marketing', href: '/services/content-marketing', Icon: FileText },
    { name: 'PPC', href: '/services/ppc', Icon: Zap },
    { name: 'Email Marketing', href: '/services/email-marketing', Icon: Mail },
    { name: 'Website Design', href: '/services/website-design', Icon: Layout },
    { name: 'Brand Strategy', href: '/services/brand-strategy', Icon: Target },
    { name: 'Lead Generation', href: '/services/lead-generation', Icon: Users },
  ] as const

  return (
    <>
      {/* Subtle page scroll progress like homepage */}
      <ScrollProgressBar />

      {/* About layout: sticky portrait sidebar + content */}
      <section id="about" className={`${getThemeClasses.hero()} pt-20 pb-10 relative`}>
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-20 -left-20 w-72 h-72 bg-gradient-to-br from-primary-200/25 to-primary-400/10 rounded-full blur-3xl animate-float-slow" />
          <div className="absolute top-1/2 -right-20 w-52 h-52 bg-gradient-to-tr from-neutral-200/30 to-neutral-400/10 rounded-full blur-2xl animate-float-slower" />
        </div>
        <div className={`${themeStyles.layout.container} relative z-10`}>
          <div className="grid lg:grid-cols-12 gap-10">
            {/* Sidebar */}
            <aside className="lg:col-span-4" data-reveal>
              <div className="reveal sticky top-24">
                <div className="relative flex justify-center mb-6">
                  <div aria-hidden className="pointer-events-none -z-10 absolute -inset-6 rounded-full bg-gradient-to-tr from-primary-200/30 via-transparent to-primary-500/20 blur-2xl" />
                  <div aria-hidden className="pointer-events-none -z-10 absolute -inset-2 rounded-full border border-white/60 shadow-[0_0_0_8px_rgba(255,255,255,0.6)]" />
                  <PortraitCard
                    className="relative z-10"
                    shape="circle"
                    size="sm"
                    src={data.profileImage}
                    alt={`${data.name} - ${data.title}`}
                    flipOnHover
                    objectPosition={(() => {
                      const x = typeof data.profileImageFocus?.x === 'number' ? Math.min(100, Math.max(0, data.profileImageFocus.x)) : undefined
                      const y = typeof data.profileImageFocus?.y === 'number' ? Math.min(100, Math.max(0, data.profileImageFocus.y)) : undefined
                      return typeof x === 'number' && typeof y === 'number' ? `${x}% ${y}%` : undefined
                    })()}
                    focus={{ x: data.profileImageFocus?.x, y: data.profileImageFocus?.y, zoom: data.profileImageFocus?.zoom }}
                    back={(
                      <div className={`${themeStyles.backgrounds.card} relative h-full w-full overflow-hidden`}>
                        {/* Centered logo for reliable render */}
                        <div aria-hidden className="absolute inset-0 pointer-events-none flex items-center justify-center">
                          <Image
                            src="/images/REPLACE-your-logo.png"
                            alt="REPLACE Your Business Name Logo"
                            width={180}
                            height={180}
                            className="grayscale opacity-15"
                            priority={false}
                          />
                        </div>
                        <div className="relative z-10 h-full w-full flex flex-col">
                          <div className="flex-1" />
                          <div className="px-5 pb-4 pt-3 bg-white/85 backdrop-blur-sm border-t border-neutral-200/70">
                            <div className="text-center text-neutral-900 font-semibold text-sm mb-2">Services</div>
                            <div className="grid grid-cols-2 gap-x-3 gap-y-2 text-left max-w-[240px] mx-auto">
                              {quickServices.map((s) => (
                                <Link key={s.name} href={s.href} className="group inline-flex items-center gap-2 text-[13px] text-neutral-700 hover:text-primary-700">
                                  <s.Icon className="w-4 h-4 text-primary-600 group-hover:text-primary-700" />
                                  <span>{s.name}</span>
                                </Link>
                              ))}
                            </div>
                            <div className="mt-3 flex items-center justify-center gap-3">
                              <a
                                href="https://www.linkedin.com/in/REPLACE-your-linkedin-username/"
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label="LinkedIn profile"
                                className="inline-flex items-center justify-center w-8 h-8 rounded-full border border-neutral-200 bg-white text-neutral-700 hover:text-white hover:bg-primary-600 hover:border-primary-600 transition-colors"
                              >
                                <Linkedin className="w-4 h-4" />
                              </a>
                              <a
                                href="mailto:REPLACE-your-email@domain.com"
                                aria-label="Email REPLACE Your Name"
                                className="inline-flex items-center justify-center w-8 h-8 rounded-full border border-neutral-200 bg-white text-neutral-700 hover:text-white hover:bg-primary-600 hover:border-primary-600 transition-colors"
                              >
                                <Mail className="w-4 h-4" />
                              </a>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  />
                </div>
                <p className="text-center text-sm uppercase tracking-wider text-primary-700/80 font-semibold mb-2">{data.name} • {data.title}</p>
                <div className="flex items-center justify-center gap-3 mb-3">
                  <a
                    href="https://www.linkedin.com/in/REPLACE-your-linkedin-username/"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="LinkedIn profile"
                    className="inline-flex items-center justify-center w-9 h-9 rounded-full border border-neutral-200 bg-white text-neutral-700 hover:text-white hover:bg-primary-600 hover:border-primary-600 transition-colors"
                  >
                    <Linkedin className="w-4.5 h-4.5" />
                  </a>
                  <a
                    href="mailto:REPLACE-your-email@domain.com"
                    aria-label="Email REPLACE Your Name"
                    className="inline-flex items-center justify-center w-9 h-9 rounded-full border border-neutral-200 bg-white text-neutral-700 hover:text-white hover:bg-primary-600 hover:border-primary-600 transition-colors"
                  >
                    <Mail className="w-4.5 h-4.5" />
                  </a>
                </div>
                <div className="flex flex-wrap items-center justify-center gap-3 mb-5 text-sm">
                  <span className="inline-flex items-center gap-1 rounded-full px-4 py-2 bg-white border border-neutral-200 shadow-sm" aria-label={`Client rating ${data.rating}`}>
                    {Array.from({ length: Math.min(5, Math.max(1, Math.round(Number(data.rating) || 0))) }).map((_, i) => (
                      <Star key={i} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                    ))}
                  </span>
                  <span className="inline-flex items-center gap-2 rounded-full px-4 py-2 bg-white border border-neutral-200 shadow-sm">
                    <Users className="w-4 h-4 text-primary-600"/> {data.totalClients} clients
                  </span>
                </div>
                {/* On-page nav removed per request */}
                <div className="mt-5 flex flex-col gap-3">
                  <Link href="/services" className={themeStyles.buttons.primary}>
                    View My Services <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                  <Link href="/contact" className={themeStyles.buttons.secondary}>
                    Get In Touch
                  </Link>
                </div>
              </div>
            </aside>

            {/* Main content */}
            <div className="lg:col-span-8" data-reveal>
              <div className="reveal">
                <h1 className="text-4xl lg:text-5xl font-bold text-neutral-900 mb-4 leading-tight">
                  {data.heroTitle}
                  <span
                    className="block text-primary-600"
                    // eslint-disable-next-line react/no-danger
                    dangerouslySetInnerHTML={{ __html: toLinkedHtml(data.heroSubtitle) }}
                  />
                </h1>
                <p
                  className="text-xl text-neutral-600 mb-10 leading-relaxed max-w-2xl"
                  // eslint-disable-next-line react/no-danger
                  dangerouslySetInnerHTML={{ __html: toLinkedHtml(data.heroDescription) }}
                />
                {/* Story */}
                <section id="story" className="mb-8">
                  {(data.storyApproachTitle || data.storyApproachBody || (data.storyDifferentiators && data.storyDifferentiators.length) || data.storyMissionBody) ? (
                    <div className="space-y-8">
                      {(data.storyApproachTitle || data.storyApproachBody) && (
                        <div data-reveal className="reveal group rounded-3xl border border-neutral-200 bg-white/80 backdrop-blur p-8 md:p-10 shadow-lg relative overflow-hidden">
                          <div aria-hidden className="absolute inset-x-0 -top-1 h-1 bg-gradient-to-r from-primary-500 via-primary-400 to-primary-600 opacity-80" />
                          <div aria-hidden className="pointer-events-none absolute -right-10 -top-10 w-40 h-40 rounded-full bg-primary-200/20 blur-3xl group-hover:opacity-100 opacity-0 transition-opacity" />
                          <div className="flex items-center gap-2 mb-2">
                            <DifferentiatorIcon name={data.storyApproachIcon || 'Target'} className="w-5 h-5 text-neutral-900" />
                            {data.storyApproachTitle && (
                              <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-[linear-gradient(90deg,#111,#e11d48)]">
                                <span
                                  // eslint-disable-next-line react/no-danger
                                  dangerouslySetInnerHTML={{ __html: toLinkedHtml(data.storyApproachTitle) }}
                                />
                              </h2>
                            )}
                          </div>
                          {data.storyApproachTagline && (
                            <p
                              className="bg-clip-text text-transparent bg-[linear-gradient(90deg,#111,#e11d48)] bg-[length:200%_100%] animate-gradient mb-3"
                              // eslint-disable-next-line react/no-danger
                              dangerouslySetInnerHTML={{ __html: toLinkedHtml(data.storyApproachTagline) }}
                            />
                          )}
                          {data.storyApproachBody && (
                            <p
                              className="text-neutral-700 leading-relaxed"
                              // eslint-disable-next-line react/no-danger
                              dangerouslySetInnerHTML={{ __html: toLinkedHtml(data.storyApproachBody) }}
                            />
                          )}
                        </div>
                      )}
                      {Array.isArray(data.storyDifferentiators) && data.storyDifferentiators.length > 0 && (
                        <div data-reveal className="reveal group rounded-3xl border border-neutral-200 bg-white p-8 md:p-10 shadow-lg relative overflow-hidden">
                          <div aria-hidden className="absolute inset-x-0 -top-1 h-1 bg-gradient-to-r from-primary-500 via-primary-400 to-primary-600 opacity-80" />
                          <div className="flex items-center gap-2 mb-4 relative z-10">
                            <DifferentiatorIcon name="BadgeCheck" className="w-5 h-5 text-neutral-900" />
                            <h3 className="text-xl font-semibold bg-clip-text text-transparent bg-[linear-gradient(90deg,#111,#e11d48)]">{data.storyDifferentiatorsTitle || 'What Sets Me Apart'}</h3>
                          </div>
                          <ul className="relative z-10 divide-y divide-neutral-200">
                            {data.storyDifferentiators.map((d, idx) => (
                              <li key={d.title + idx} className="py-4 first:pt-0 last:pb-0">
                                <div className="flex items-start gap-3">
                                  <DifferentiatorIcon name={d.icon} className="w-5 h-5 text-primary-600 shrink-0 mt-0.5" />
                                  <div>
                                    <div
                                      className="font-semibold text-neutral-900 mb-1"
                                      // eslint-disable-next-line react/no-danger
                                      dangerouslySetInnerHTML={{ __html: toLinkedHtml(d.title) }}
                                    />
                                    {d.description && (
                                      <p
                                        className="text-neutral-600 text-sm leading-relaxed"
                                        // eslint-disable-next-line react/no-danger
                                        dangerouslySetInnerHTML={{ __html: toLinkedHtml(d.description) }}
                                      />
                                    )}
                                  </div>
                                </div>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                      {data.storyMissionBody && (
                        <div data-reveal className="reveal rounded-3xl border border-neutral-200 bg-white p-8 md:p-10 shadow-sm relative overflow-hidden">
                          <div aria-hidden className="absolute inset-x-0 -top-px h-px bg-gradient-to-r from-neutral-200 via-primary-300/60 to-neutral-200" />
                          <div className="flex items-center gap-2 mb-2">
                            <DifferentiatorIcon name={data.storyMissionIcon || 'Rocket'} className="w-5 h-5 text-neutral-900" />
                            {data.storyMissionTitle && (
                              <h4 className="text-xl font-semibold bg-clip-text text-transparent bg-[linear-gradient(90deg,#111,#e11d48)]">
                                <span
                                  // eslint-disable-next-line react/no-danger
                                  dangerouslySetInnerHTML={{ __html: toLinkedHtml(data.storyMissionTitle) }}
                                />
                              </h4>
                            )}
                          </div>
                          <p
                            className="text-neutral-700 leading-relaxed"
                            // eslint-disable-next-line react/no-danger
                            dangerouslySetInnerHTML={{ __html: toLinkedHtml(data.storyMissionBody || '') }}
                          />
                        </div>
                      )}
                    </div>
                  ) : (
                    <article className="bg-white/80 backdrop-blur rounded-3xl border border-neutral-200 shadow-lg p-8 md:p-10 prose prose-lg max-w-none prose-headings:font-bold prose-h2:text-2xl prose-p:text-neutral-700">
                      {markdown}
                    </article>
                  )}
                </section>
              </div>
            </div>
          </div>
        </div>
      </section>

  {/* Journey removed per request */}

  {/* Credentials section removed to reduce repetition; highlights remain on portrait flip */}

      {/* Testimonials (match homepage rotator style) */}
  <section id="testimonials" className={`${themeStyles.backgrounds.page} py-14`}>
        <div className={themeStyles.layout.container}>
          <div className="text-center mb-10">
            <h5 className={themeStyles.text.h3}>What Clients Say</h5>
          </div>
          <div className="max-w-4xl mx-auto">
            <TestimonialRotator items={testimonialItems || []} />
          </div>
        </div>
      </section>

    {/* CTA */}
  <section id="contact-cta" className={`${themeStyles.backgrounds.ctaDark} py-16 relative overflow-hidden`} aria-labelledby="about-cta-heading">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-10 -left-10 w-40 h-40 bg-primary-400/20 rounded-full blur-2xl"></div>
          <div className="absolute -bottom-10 -right-10 w-60 h-60 bg-primary-800/20 rounded-full blur-3xl"></div>
        </div>
        <div className={`${themeStyles.layout.narrow} text-center relative z-10`}>
          <h6 id="about-cta-heading" className="text-3xl font-bold text-white mb-4">{data.ctaTitle}</h6>
          <p
            className="text-xl text-primary-100 mb-8"
            // eslint-disable-next-line react/no-danger
            dangerouslySetInnerHTML={{ __html: toLinkedHtml(data.ctaDescription) }}
          />
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact" className="inline-flex items-center px-8 py-4 bg-white text-primary-600 rounded-2xl hover:bg-neutral-50 transition-colors font-semibold shadow-lg">
              REPLACE Call to Action Text <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
            <Link href="/case-studies" className="inline-flex items-center px-8 py-4 border-2 border-white text-white rounded-2xl hover:bg-primary-700 transition-colors font-semibold">
              View Success Stories
            </Link>
          </div>
        </div>
      </section>

      {/* Person JSON-LD for richer SEO */}
      {/* Person schema (no ratings to comply with supported review types) */}
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Person',
            name: data.name,
            jobTitle: data.title,
            image: data.profileImage,
            url: 'https://www.REPLACE-your-domain.com/about'
          })
        }}
      />
      {/* LocalBusiness schema with aggregateRating (Google-supported type for review rich results) */}
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{
          __html: JSON.stringify((() => {
            const ratingNumber = Number(data.rating);
            const hasRating = Number.isFinite(ratingNumber);
            if (!hasRating) return undefined;
            return {
              '@context': 'https://schema.org',
              '@type': 'LocalBusiness',
              name: 'REPLACE Your Business Name',
              image: data.profileImage,
              url: 'https://www.REPLACE-your-domain.com',
              founder: {
                '@type': 'Person',
                name: data.name,
                url: 'https://www.REPLACE-your-domain.com/about'
              },
              aggregateRating: {
                '@type': 'AggregateRating',
                ratingValue: Math.max(1, Math.min(5, ratingNumber)).toFixed(1),
                bestRating: '5',
                worstRating: '1',
                ratingCount: 20
              }
            };
          })())
        }}
      />

      {/* reveal styles */}
      <style jsx global>{`
        [data-reveal].reveal{opacity:.0; transform: translateY(8px); transition: opacity .5s ease, transform .5s ease}
        [data-reveal].reveal.show{opacity:1; transform: translateY(0)}
        @keyframes floatY { 0%,100%{ transform: translateY(0) } 50%{ transform: translateY(-8px) } }
        .animate-float-slow{ animation: floatY 10s ease-in-out infinite }
        .animate-float-slower{ animation: floatY 14s ease-in-out infinite }
  @keyframes gradientShift { 0%{ background-position: 0% 50% } 100%{ background-position: 200% 50% } }
  .animate-gradient{ animation: gradientShift 6s linear infinite }
      `}</style>
    </>
  )
}

// downlevelH2 helper removed per request; markdown is rendered as-authored

// Local: thin top scroll progress bar (mirrors homepage feel)
function ScrollProgressBar() {
  const ref = React.useRef<HTMLDivElement>(null)
  useEffect(() => {
    let raf = 0
    const onScroll = () => {
      if (raf) return
      raf = requestAnimationFrame(() => {
        raf = 0
        const max = document.documentElement.scrollHeight - window.innerHeight
        const pct = max > 0 ? window.scrollY / max : 0
        if (ref.current) ref.current.style.transform = `scaleX(${pct})`
      })
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => { window.removeEventListener('scroll', onScroll); if (raf) cancelAnimationFrame(raf) }
  }, [])
  return (
    <div aria-hidden className="fixed top-0 left-0 h-1 w-full bg-neutral-200/40 z-[60]">
      <div ref={ref} className="h-full origin-left bg-gradient-to-r from-primary-500 via-primary-400 to-primary-600 transition-transform duration-150" style={{ transform: 'scaleX(0)', transformOrigin: 'left' }} />
    </div>
  )
}

// Minimal in-page nav to scan sections quickly
// On-this-page nav removed

// Small helper to map CMS icon names to Lucide components
function DifferentiatorIcon({ name, className }: { name?: string; className?: string }) {
  const map: Record<string, React.ComponentType<React.SVGProps<SVGSVGElement>>> = {
    BadgeCheck,
    ShieldCheck,
    Target,
    Heart,
    Rocket,
    Sparkles,
    Zap,
    CheckCircle,
  };
  const Cmp = (name && map[name]) || BadgeCheck;
  return <Cmp className={className} />
}

// Light HTML escaper + single-pass phrase linkifier for internal links.
// Guarantees we never rewrite inside inserted anchors or attributes.
function toLinkedHtml(input: string): string {
  if (!input || typeof input !== 'string') return ''
  // Normalize em dashes to simple spaced hyphens for consistent tone
  input = input.replace(/\u2014/g, ' - ')

  const escapeHtml = (s: string) => s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')

  type Rule = { re: RegExp; href: string; label?: string }
  const rules: Rule[] = [
    { re: /\bbrand strategy\b/gi, href: '/services/brand-strategy' },
    { re: /\bdigital campaigns?\b/gi, href: '/services/digital-campaigns', label: 'digital campaigns' },
    { re: /\bcontent marketing\b/gi, href: '/services/content-marketing' },
    { re: /\bemail marketing\b/gi, href: '/services/email-marketing' },
    { re: /\blead generation\b/gi, href: '/services/lead-generation' },
    { re: /\bwebsite design\b/gi, href: '/services/website-design' },
    { re: /\bppc\b/gi, href: '/services/ppc', label: 'PPC' },
    { re: /\bseo\b/gi, href: '/services/seo', label: 'SEO' },
    { re: /\bcase studies\b/gi, href: '/case-studies', label: 'case studies' },
    { re: /\bsuccess stories\b/gi, href: '/case-studies', label: 'success stories' },
  // A few additional helpful phrases
  { re: /\bsearch engine optimization\b/gi, href: '/services/seo', label: 'SEO' },
  { re: /\bpaid ads?\b/gi, href: '/services/ppc', label: 'paid ads' },
  { re: /\bblog\b/gi, href: '/blog' },
  { re: /\bcase study\b/gi, href: '/case-studies', label: 'case study' },
    // Tighten generic 'services' so it won't match in '/services/...', 'services/' or 'services-' tokens
    { re: /(?<!\/)\bservices\b(?![\/-])/gi, href: '/services' },
    { re: /\bcontact\b/gi, href: '/contact' },
    { re: /\bget in touch\b/gi, href: '/contact', label: 'get in touch' },
    { re: /\bbook (a )?call\b/gi, href: '/contact', label: 'book a call' },
  ]

  // Collect all matches on the ORIGINAL string first
  type Match = { start: number; end: number; href: string; text: string; label?: string }
  const matches: Match[] = []
  for (const rule of rules) {
    // Create a new regex with global + ignoreCase from the rule to ensure independent state
    const re = new RegExp(rule.re.source, rule.re.flags.includes('i') ? 'gi' : 'g')
    let m: RegExpExecArray | null
    while ((m = re.exec(input)) !== null) {
      // Guard against zero-length matches
      if (!m[0]) { re.lastIndex++; continue }
      matches.push({ start: m.index, end: m.index + m[0].length, href: rule.href, text: m[0], label: rule.label })
    }
  }

  if (matches.length === 0) return escapeHtml(input)

  // Sort by start asc, length desc (prefer longer phrases when overlapping at same start)
  matches.sort((a, b) => a.start === b.start ? (b.end - b.start) - (a.end - a.start) : a.start - b.start)

  // Greedily accept non-overlapping matches
  const chosen: Match[] = []
  for (const m of matches) {
    const last = chosen[chosen.length - 1]
    if (!last || m.start >= last.end) {
      chosen.push(m)
    }
  }

  // Build HTML: escape non-link slices, wrap chosen matches
  let html = ''
  let i = 0
  for (const m of chosen) {
    if (m.start > i) html += escapeHtml(input.slice(i, m.start))
    const label = m.label ?? m.text
    html += `<a href="${m.href}" class="underline decoration-neutral-300 hover:decoration-primary-400 text-primary-700">${escapeHtml(label)}</a>`
    i = m.end
  }
  if (i < input.length) html += escapeHtml(input.slice(i))
  return html
}
