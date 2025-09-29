// Client-side service types
export interface Service {
  id: string;
  serviceId: string;
  title: string;
  subtitle: string;
  description: string;
  keywords: string[];
  icon: string;
  featured?: boolean;
  order?: number;
  heroTitle: string;
  heroSubtitle: string;
  heroDescription: string;
  whatYouGet: string[];
  features: Array<{
    title: string;
    description: string;
    icon: string;
  }>;
  process: Array<{
    step: string;
    title: string;
    description: string;
    duration: string;
  }>;
  results: string[];
  faqs: Array<{
    question: string;
    answer: string;
  }>;
  ctaTitle: string;
  ctaDescription: string;
  emailSubject: string;
  emailBody: string;
  seo?: {
    metaTitle?: string;
    metaDescription?: string;
    canonicalUrl?: string;
    noIndex?: boolean;
    keywords?: string[];
    winningKeywords?: string[];
    openGraph?: {
      ogTitle?: string;
      ogDescription?: string;
      ogImage?: string;
    }
  };
  content: string;
  // Enrichment (optional)
  goals?: string[];
  stages?: ("early"|"validating"|"growing"|"scaling")[];
  strategicPillar?: string;
  timeToValue?: 'fast'|'standard'|'long';
  outcomes?: string[];
  diagnosticTriggers?: string[];
  commitment?: { duration: string; cadence?: string };
  priceBand?: string;
  whoFor?: { ideal?: string[]; notFor?: string[] };
  engagementModel?: { phases: { name: string; duration: string; focus: string }[] };
  proofSnippets?: { metric: string; context?: string }[];
  objections?: { concern: string; response: string }[];
  riskOfInaction?: string;
}

export interface SimpleService {
  id: string;
  title: string;
  description: string;
  icon: string;
}

export interface ServicePageData {
  id: string;
  title: string;
  description: string;
  icon: string;
  features: string[];
  results: string[];
  href: string;
}

// Enriched lightweight page data (for advisor & future filtering)
export interface EnrichedServicePageData extends ServicePageData {
  goals?: string[];
  stages?: ("early"|"validating"|"growing"|"scaling")[];
  strategicPillar?: string;
  timeToValue?: 'fast'|'standard'|'long';
  outcomes?: string[];
  diagnosticTriggers?: string[];
  commitment?: { duration: string; cadence?: string };
  priceBand?: string;
  whoFor?: { ideal?: string[]; notFor?: string[] };
  engagementModel?: { phases: { name: string; duration: string; focus: string }[] };
  proofSnippets?: { metric: string; context?: string }[];
  objections?: { concern: string; response: string }[];
  riskOfInaction?: string;
}
