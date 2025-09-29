'use client'

import Script from 'next/script'
import { usePathname, useSearchParams } from 'next/navigation'
import { useEffect, Suspense } from 'react'

// GA4 Measurement ID from environment variable
const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || 'G-DQQQRDSPJN'

// Declare gtag function for TypeScript
declare global {
  interface Window {
    dataLayer: unknown[]
    gtag: (...args: unknown[]) => void
  }
}

// Track page views component wrapped in Suspense
function PageViewTracker() {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('config', GA_MEASUREMENT_ID, {
        page_path: pathname,
        page_search: searchParams.toString(),
      })
    }
  }, [pathname, searchParams])

  return null
}

export default function GoogleAnalytics() {
  return (
    <>
      {/* Google tag (gtag.js) - Optimized loading */}
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
        strategy="lazyOnload"
      />
      <Script
        id="google-analytics"
        strategy="lazyOnload"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_MEASUREMENT_ID}');
          `,
        }}
      />
      {/* Page view tracking wrapped in Suspense */}
      <Suspense fallback={null}>
        <PageViewTracker />
      </Suspense>
    </>
  )
}

// Utility functions for tracking events with GA4
export const trackEvent = (eventName: string, parameters?: Record<string, unknown>) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', eventName, parameters)
  }
}

export const trackLeadSubmission = (leadData: {
  name: string
  email: string
  services: string[]
  formType?: string
}) => {
  trackEvent('lead_submission', {
    event_category: 'Lead Generation',
    event_label: 'Contact Form',
    value: 1,
    lead_name: leadData.name,
    lead_email: leadData.email,
    services_count: leadData.services.length,
    services_selected: leadData.services.join(','),
    form_type: leadData.formType || 'main_contact_form',
  })
}

export const trackServiceInterest = (service: string) => {
  trackEvent('service_interest', {
    event_category: 'Services',
    event_label: service,
    service_name: service,
  })
}

export const trackEmailClick = (emailType: 'contact' | 'footer' | 'hero' = 'contact') => {
  trackEvent('email_click', {
    event_category: 'Contact',
    event_label: `Email Click - ${emailType}`,
    contact_method: 'email',
    click_location: emailType,
  })
}

export const trackPhoneClick = (phoneType: 'contact' | 'footer' | 'hero' = 'contact') => {
  trackEvent('phone_click', {
    event_category: 'Contact',
    event_label: `Phone Click - ${phoneType}`,
    contact_method: 'phone',
    click_location: phoneType,
  })
}

export const trackPageView = (pageName: string, pageCategory?: string) => {
  trackEvent('page_view', {
    event_category: 'Page Views',
    event_label: pageName,
    page_name: pageName,
    page_category: pageCategory || 'general',
  })
}

export const trackServicePageView = (serviceName: string) => {
  trackEvent('service_page_view', {
    event_category: 'Services',
    event_label: `Service Page - ${serviceName}`,
    service_name: serviceName,
    page_type: 'service_detail',
  })
}

export const trackServiceSelection = (serviceName: string, isSelected: boolean) => {
  trackEvent('service_selection', {
    event_category: 'Form Interaction',
    event_label: `${serviceName} - ${isSelected ? 'Selected' : 'Deselected'}`,
    service_name: serviceName,
    selection_state: isSelected,
  })
}

export const trackFormStart = () => {
  trackEvent('form_start', {
    event_category: 'Form Interaction',
    event_label: 'Contact Form Started',
  })
}

export const trackFormValidationError = (field: string, error: string) => {
  trackEvent('form_validation_error', {
    event_category: 'Form Interaction',
    event_label: `Validation Error - ${field}`,
    field_name: field,
    error_message: error,
  })
}
