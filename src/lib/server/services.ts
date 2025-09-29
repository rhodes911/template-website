import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

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
  // Optional enrichment fields
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

const contentDirectory = path.join(process.cwd(), 'content');

export function getServices(): Service[] {
  const servicesDirectory = path.join(contentDirectory, 'services');
  
  if (!fs.existsSync(servicesDirectory)) {
    return [];
  }

  const fileNames = fs.readdirSync(servicesDirectory);
  const services = fileNames
    .filter(name => name.endsWith('.md'))
    .map(name => {
      const id = name.replace(/\.md$/, '');
      const fullPath = path.join(servicesDirectory, name);
      const fileContents = fs.readFileSync(fullPath, 'utf8');
      const { data, content } = matter(fileContents);

      const service = {
        id,
        ...data,
        content,
      } as Service;
      
      // Log for debugging
      if (!service.title) {
        console.error(`Service ${id} is missing title:`, service);
      }
      
      return service;
    });

  // Sort by order if specified, then by title
  return services.sort((a, b) => {
    if (a.order && b.order) {
      return a.order - b.order;
    }
    if (a.order) return -1;
    if (b.order) return 1;
    
    // Handle cases where title might be undefined
    const titleA = a.title || '';
    const titleB = b.title || '';
    return titleA.localeCompare(titleB);
  });
}

export function getService(serviceId: string): Service | null {
  try {
    const servicesDirectory = path.join(contentDirectory, 'services');
    const fileNames = fs.readdirSync(servicesDirectory);
    
    for (const fileName of fileNames) {
      if (!fileName.endsWith('.md')) continue;
      
      const fullPath = path.join(servicesDirectory, fileName);
      const fileContents = fs.readFileSync(fullPath, 'utf8');
      const { data, content } = matter(fileContents);
      
      if (data.serviceId === serviceId) {
        return {
          id: fileName.replace(/\.md$/, ''),
          ...data,
          content,
        } as Service;
      }
    }
    
    return null;
  } catch (error) {
    console.error('Error loading service:', error);
    return null;
  }
}

export function getSimpleServices(): SimpleService[] {
  return getServices().map(service => ({
    id: service.serviceId,
    title: service.title,
    description: service.description,
    icon: service.icon,
  }));
}

export function getServicesForPage(): ServicePageData[] {
  return getServices().map(service => ({
    id: service.serviceId,
    title: service.title,
    description: service.description,
    icon: service.icon,
    features: (service.features || []).map(f => f?.title || ''),
    results: service.results || [],
    href: `/services/${service.serviceId}`,
  }));
}

// Enriched version for advisor & future filtering
export function getEnrichedServicesForPage(): EnrichedServicePageData[] {
  return getServices().map(service => ({
    id: service.serviceId,
    title: service.title,
    description: service.description,
    icon: service.icon,
    features: (service.features || []).map(f => f?.title || ''),
    results: service.results || [],
    href: `/services/${service.serviceId}`,
    goals: service.goals,
    stages: service.stages,
    strategicPillar: service.strategicPillar,
    timeToValue: service.timeToValue,
    outcomes: service.outcomes,
    diagnosticTriggers: service.diagnosticTriggers,
    commitment: service.commitment,
    priceBand: service.priceBand,
    whoFor: service.whoFor,
    engagementModel: service.engagementModel,
    proofSnippets: service.proofSnippets,
    objections: service.objections,
    riskOfInaction: service.riskOfInaction,
  }));
}

// Removed getFeaturedServices as it wasn't being used outside this file

export function getAllServiceIds(): string[] {
  try {
    const servicesDir = path.join(contentDirectory, 'services');
    const files = fs.readdirSync(servicesDir);
    return files
      .filter(file => file.endsWith('.md'))
      .map(file => {
        const fullPath = path.join(servicesDir, file);
        const fileContents = fs.readFileSync(fullPath, 'utf8');
        const { data } = matter(fileContents);
        return data.serviceId || file.replace('.md', '');
      });
  } catch (error) {
    console.error('Error loading service IDs:', error);
    return [];
  }
}
