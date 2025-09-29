import fs from 'fs'
import path from 'path'

export type BusinessSettings = {
  brand?: string
  site_url?: string
  primaryCTAs?: string[]
  audience?: string[]
  services?: string[]
  locations?: string[]
  valueProps?: string[]
  targetKeywords?: { primary?: string[]; secondary?: string[] }
  competitors?: string[]
  socialProfiles?: { [key: string]: string }
  schemaDefaults?: {
    organization_name?: string
    logo_url?: string
    contact_phone?: string
    contact_email?: string
    address?: {
      streetAddress?: string
      addressLocality?: string
      addressRegion?: string
      postalCode?: string
      addressCountry?: string
    }
  }
  /** Local citation / directory enrichment (optional) */
  localSeo?: {
    description?: string
    foundedYear?: number
    hours?: { [day: string]: string } // e.g. monday: "09:00-17:00", saturday: "Closed"
    phones?: { primary?: string; secondary?: string; tollFree?: string }
    images?: { logo?: string; squareLogo?: string; cover?: string }
    tracking?: { utmMedium?: string; utmCampaign?: string }
  }
}

type LengthTarget = { minWords?: number; maxWords?: number } | { min?: number; max?: number }
export type SeoSettings = {
  region?: string
  locale?: string
  readingLevel?: string
  fleschTarget?: number
  keywordPolicy?: {
    includeAlways?: string[]
    includePreferred?: string[]
    avoid?: string[]
    maxDensityPercent?: number
  }
  lengthTargets?: Record<string, LengthTarget | Record<string, LengthTarget>>
  jsonLd?: {
    organization?: boolean
  website?: boolean
    person?: boolean
    service?: boolean
    article?: boolean
    breadcrumb?: boolean
    faq?: boolean
    review?: boolean
    localBusiness?: boolean
  }
}

const contentDir = path.join(process.cwd(), 'content', 'settings')

let businessCache: BusinessSettings | null = null
let seoCache: SeoSettings | null = null

function readJson<T>(file: string): T | null {
  try {
    const full = path.join(contentDir, file)
    if (!fs.existsSync(full)) return null
    const raw = fs.readFileSync(full, 'utf8')
    return JSON.parse(raw) as T
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error('Failed to read settings file', file, e)
    return null
  }
}

export function getBusinessSettings(): BusinessSettings {
  if (businessCache) return businessCache
  businessCache = readJson<BusinessSettings>('business.json') || {}
  return businessCache
}

export function getSeoSettings(): SeoSettings {
  if (seoCache) return seoCache
  seoCache = readJson<SeoSettings>('seo.json') || {}
  return seoCache
}

export function refreshSettingsCaches() {
  businessCache = null
  seoCache = null
}
