import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import type { Metadata } from 'next'
import { SITE_URL, canonical, IS_PROD } from './seo'

export type PageSeoFrontmatter = {
  seo?: {
    metaTitle?: string
    metaDescription?: string
    canonicalUrl?: string
    keywords?: string[]
    noIndex?: boolean
    openGraph?: {
      ogTitle?: string
      ogDescription?: string
      ogImage?: string
    }
  }
}

export type ContentData = {
  title?: string
  description?: string
  excerpt?: string
  keywords?: string[]
  tags?: string[]
  client?: string
  industry?: string
  challenge?: string
  socialShare?: {
    title?: string
    description?: string
  }
}

export type PageContext = {
  slug: string
  pageType?: 'home' | 'about' | 'contact' | 'faq' | 'service' | 'blog' | 'case-study' | 'listing'
  contentData?: ContentData
}

export function getPageSeo(slug: string): PageSeoFrontmatter['seo'] | undefined {
  const contentDir = path.join(process.cwd(), 'content')
  const candidates = [
    path.join(contentDir, `${slug}.md`),
    path.join(contentDir, slug, 'index.md'),
  ]
  for (const fp of candidates) {
    if (fs.existsSync(fp)) {
      const raw = fs.readFileSync(fp, 'utf8')
      const { data } = matter(raw)
      return (data as PageSeoFrontmatter).seo
    }
  }
  return undefined
}

/**
 * Universal metadata builder with smart defaults for all page types
 */
export function buildMetadataFromSeo(
  context: PageContext, 
  seo?: PageSeoFrontmatter['seo']
): Metadata {
  const { slug, pageType, contentData } = context
  
  // Smart defaults based on page type and content
  const smartDefaults = getSmartDefaults(pageType, contentData, slug)
  
  const title = seo?.metaTitle || smartDefaults.title
  const description = seo?.metaDescription || smartDefaults.description
  const kw = seo?.keywords || smartDefaults.keywords
  const canonicalInput = seo?.canonicalUrl || smartDefaults.canonicalUrl
  const canonicalUrl = canonical(canonicalInput)
  const ogTitle = seo?.openGraph?.ogTitle || smartDefaults.ogTitle || title
  const ogDescription = seo?.openGraph?.ogDescription || smartDefaults.ogDescription || description
  let ogImage = seo?.openGraph?.ogImage || smartDefaults.ogImage || `${SITE_URL}/og-image.png`
  if (ogImage && ogImage.startsWith('/')) ogImage = `${SITE_URL}${ogImage}`
  
  // Smart robots handling with environment awareness
  const robots = process.env.NEXT_PUBLIC_ALLOW_INDEX === 'true' 
    ? 'index,follow' 
    : (IS_PROD ? (seo?.noIndex ? 'noindex,nofollow' : 'index,follow') : 'noindex,nofollow')
  
  return {
    title: title || undefined,
    description: description || undefined,
    keywords: kw,
    robots,
    alternates: { canonical: canonicalUrl },
    openGraph: {
      title: ogTitle || undefined,
      description: ogDescription || undefined,
      type: 'website',
      url: canonicalUrl,
      images: [{ url: ogImage, width: 1200, height: 630 }],
    },
    twitter: {
      card: 'summary_large_image',
      title: ogTitle || undefined,
      description: ogDescription || undefined,
      images: ogImage ? [ogImage] : undefined,
    },
  }
}

/**
 * Generate smart defaults based on page type and content
 */
function getSmartDefaults(pageType?: string, contentData?: ContentData, slug?: string) {
  const defaults = {
    title: undefined as string | undefined,
    description: undefined as string | undefined,
    keywords: undefined as string[] | undefined,
    canonicalUrl: `/${slug}`,
    ogTitle: undefined as string | undefined,
    ogDescription: undefined as string | undefined,
    ogImage: undefined as string | undefined,
  }

  switch (pageType) {
    case 'home':
      defaults.title = 'Expert Digital Marketing Camberley Surrey | Ellie Edwards'
      defaults.description = 'Transform your brand with smart marketing strategies. Local digital marketing expert serving Camberley, Surrey, Hampshire, Basingstoke & Reading areas.'
      defaults.canonicalUrl = '/'
      defaults.ogTitle = 'Ellie Edwards Marketing - Expert Digital Marketing for Entrepreneurs'
      defaults.ogDescription = 'Transform your brand with smart marketing strategies. We help entrepreneurs and personal brands create compelling campaigns that convert visitors into loyal customers.'
      break
      
    case 'about':
      defaults.title = 'About Ellie Edwards | Marketing Consultant'
      defaults.description = 'Meet Ellie Edwards, a marketing consultant helping small businesses grow with strategic, results‑driven marketing.'
      defaults.canonicalUrl = '/about'
      break
      
    case 'contact':
      defaults.title = 'Contact Ellie Edwards | Get Your Marketing Quote'
      defaults.description = 'Ready to transform your marketing? Contact Ellie Edwards for a free consultation and discover how we can grow your business together.'
      defaults.canonicalUrl = '/contact'
      break
      
    case 'faq':
      defaults.title = 'Frequently Asked Questions | Ellie Edwards Marketing'
      defaults.description = 'Get answers to common questions about our digital marketing services, processes, pricing, and how we can help grow your business.'
      defaults.canonicalUrl = '/faq'
      break
      
    case 'service':
      if (contentData?.title) {
        defaults.title = `${contentData.title} Services | Ellie Edwards Marketing`
        defaults.description = contentData.description
        defaults.keywords = contentData.keywords
        defaults.canonicalUrl = `/services/${slug}`
      }
      break
      
    case 'blog':
      if (contentData?.title) {
        defaults.title = `${contentData.title} | Ellie Edwards Marketing`
        defaults.description = contentData.excerpt
        defaults.keywords = contentData.keywords
        defaults.canonicalUrl = `/blog/${slug}`
        defaults.ogTitle = contentData.socialShare?.title || contentData.title
        defaults.ogDescription = contentData.socialShare?.description || contentData.excerpt
      }
      break
      
    case 'case-study':
      if (contentData?.title && contentData?.client) {
        defaults.title = `${contentData.title} | Case Study | Ellie Edwards Marketing`
        defaults.description = `${contentData.challenge} Learn how we helped ${contentData.client} achieve remarkable results through strategic digital marketing.`
        const baseKeywords = ['case study', 'digital marketing results']
        if (contentData.client) baseKeywords.unshift(contentData.client)
        if (contentData.industry) baseKeywords.unshift(contentData.industry)
        if (contentData.tags) baseKeywords.push(...contentData.tags)
        defaults.keywords = baseKeywords
        defaults.canonicalUrl = `/case-studies/${slug}`
        defaults.ogTitle = `${contentData.title} | Case Study`
        defaults.ogDescription = `${contentData.challenge} See how we helped ${contentData.client} transform their business.`
      }
      break
      
    case 'listing':
      if (contentData?.title) {
        defaults.title = `${contentData.title} | Ellie Edwards Marketing Blog`
        defaults.description = contentData.description
        defaults.keywords = contentData.keywords
      }
      break
  }

  return defaults
}
