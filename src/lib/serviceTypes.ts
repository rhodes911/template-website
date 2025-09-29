// Shared types for service data (used by both server and client)

export interface ServiceComponentData {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  keywords: string[];
  icon: string;
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
}

export interface SimpleService {
  id: string;
  title: string;
  description: string;
  icon: string;
}

export interface ServiceSummary {
  id: string;
  title: string;
  description: string;
  icon: string;
  features: string[];
  results: string[];
  href: string;
}
