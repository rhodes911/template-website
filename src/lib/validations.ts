import { z } from 'zod'

// Define available services enum
export const AVAILABLE_SERVICES = [
  'brand-strategy',
  'content-marketing', 
  'digital-campaigns',
  'email-marketing',
  'lead-generation',
  'ppc',
  'seo',
  'social-media',
  'website-design'
] as const

export type ServiceType = typeof AVAILABLE_SERVICES[number]

// Service display names
export const SERVICE_LABELS: Record<ServiceType, string> = {
  'brand-strategy': 'Brand Strategy',
  'content-marketing': 'Content Marketing',
  'digital-campaigns': 'Digital Campaigns', 
  'email-marketing': 'Email Marketing',
  'lead-generation': 'Lead Generation',
  'ppc': 'PPC Advertising',
  'seo': 'SEO Optimization',
  'social-media': 'Social Media Management',
  'website-design': 'Website Design'
}

export const leadFormSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name too long'),
  email: z.string().email('Please enter a valid email address'),
  message: z.string().optional(),
  services: z.array(z.enum(AVAILABLE_SERVICES)).optional().default([]),
})

export type LeadFormData = z.infer<typeof leadFormSchema>

export const newsletterSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
})

export type NewsletterData = z.infer<typeof newsletterSchema>
