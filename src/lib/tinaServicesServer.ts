/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-require-imports */
import fs from 'fs';
import path from 'path';

// Try to import TinaCMS client, but fall back to file system if not available
let client: any;
try {
  client = require('../../tina/__generated__/client').default;
} catch {
  console.log('TinaCMS client not available, using file system fallback');
  client = null;
}

// TinaCMS Service Data Interface (matches generated types)
export interface TinaServiceData {
  serviceId: string;
  serviceTitle: string;
  subtitle: string;
  description: string;
  keywords: string[];
  icon: string;
  hero: {
    heroTitle: string;
    heroSubtitle: string;
    heroDescription: string;
    whatYouGet: string[];
  };
  features: Array<{
    featureTitle: string;
    featureDescription: string;
    featureIcon: string;
  }>;
  process: Array<{
    step: string;
    processTitle: string;
    processDescription: string;
    duration: string;
  }>;
  results: string[];
  faqs: Array<{
    question: string;
    answer: string;
  }>;
  cta: {
    ctaTitle: string;
    ctaDescription: string;
    emailSubject: string;
    emailBody: string;
  };
}

// Convert TinaCMS data to our component format
export function convertTinaToServiceData(tinaData: TinaServiceData) {
  return {
    id: tinaData.serviceId,
    title: tinaData.serviceTitle,
    subtitle: tinaData.subtitle,
    description: tinaData.description,
    keywords: tinaData.keywords,
    icon: tinaData.icon,
    heroTitle: tinaData.hero.heroTitle,
    heroSubtitle: tinaData.hero.heroSubtitle,
    heroDescription: tinaData.hero.heroDescription,
    whatYouGet: tinaData.hero.whatYouGet,
    features: tinaData.features.map(feature => ({
      title: feature.featureTitle,
      description: feature.featureDescription,
      icon: feature.featureIcon,
    })),
    process: tinaData.process.map(step => ({
      step: step.step,
      title: step.processTitle,
      description: step.processDescription,
      duration: step.duration,
    })),
    results: tinaData.results,
    faqs: tinaData.faqs,
    ctaTitle: tinaData.cta.ctaTitle,
    ctaDescription: tinaData.cta.ctaDescription,
    emailSubject: tinaData.cta.emailSubject,
    emailBody: tinaData.cta.emailBody,
  };
}

// Load service data from TinaCMS (server-side only)
export async function loadServiceData(serviceId: string) {
  // First try TinaCMS if available
  if (client) {
    try {
      const result = await client.queries.service({
        relativePath: `${serviceId}.json`,
      });
      
      if (result.data.service) {
        return convertTinaToServiceData(result.data.service as TinaServiceData);
      }
    } catch (error) {
      console.log(`TinaCMS failed for ${serviceId}, falling back to file system:`, error);
    }
  }

  // Fallback to direct file system access
  try {
    const filePath = path.join(process.cwd(), 'content', 'services', `${serviceId}.json`);
    const fileContent = fs.readFileSync(filePath, 'utf8');
    const tinaData: TinaServiceData = JSON.parse(fileContent);
    return convertTinaToServiceData(tinaData);
  } catch (error) {
    console.error(`Error loading service data for ${serviceId}:`, error);
    throw new Error(`Service data not found for ${serviceId}`);
  }
}

// Get all available service IDs from TinaCMS (server-side only)
export async function getAllServiceIds(): Promise<string[]> {
  // First try TinaCMS if available
  if (client) {
    try {
      const result = await client.queries.serviceConnection();
      
      if (result.data.serviceConnection?.edges) {
        return result.data.serviceConnection.edges
          .map((edge: any) => edge?.node?._sys?.filename?.replace('.json', ''))
          .filter((filename: any): filename is string => Boolean(filename));
      }
    } catch (error) {
      console.log('TinaCMS failed for getAllServiceIds, falling back to file system:', error);
    }
  }

  // Fallback to direct file system access
  try {
    const servicesDir = path.join(process.cwd(), 'content', 'services');
    const files = fs.readdirSync(servicesDir);
    return files
      .filter(file => file.endsWith('.json'))
      .map(file => file.replace('.json', ''));
  } catch (error) {
    console.error('Error loading service IDs:', error);
    return [];
  }
}

// Simple interface for navigation/footer use
export interface SimpleServiceData {
  id: string;
  title: string;
  description: string;
  icon: string;
}

// Load simple service data for navigation/footer (server-side only)
export async function loadSimpleServicesData(): Promise<SimpleServiceData[]> {
  // First try TinaCMS if available
  if (client) {
    try {
      const result = await client.queries.serviceConnection();
      
      if (result.data.serviceConnection?.edges) {
        return result.data.serviceConnection.edges
          .map((edge: any) => {
            if (!edge?.node) return null;
            const service = edge.node as TinaServiceData;
            return {
              id: service.serviceId,
              title: service.serviceTitle,
              description: service.description,
              icon: service.icon,
            };
          })
          .filter((service: any): service is SimpleServiceData => Boolean(service));
      }
    } catch (error) {
      console.log('TinaCMS failed for loadSimpleServicesData, falling back to file system:', error);
    }
  }

  // Fallback to direct file system access
  const serviceIds = await getAllServiceIds();
  return serviceIds.map(id => {
    try {
      const filePath = path.join(process.cwd(), 'content', 'services', `${id}.json`);
      const fileContent = fs.readFileSync(filePath, 'utf8');
      const tinaData: TinaServiceData = JSON.parse(fileContent);
      return {
        id: tinaData.serviceId,
        title: tinaData.serviceTitle,
        description: tinaData.description,
        icon: tinaData.icon,
      };
    } catch (error) {
      console.error(`Error loading simple service data for ${id}:`, error);
      return null;
    }
  }).filter(Boolean) as SimpleServiceData[];
}

// Interface for carousel use
export interface CarouselServiceData {
  id: string;
  title: string;
  description: string;
  features: string[];
}

// Load service data for carousel (server-side only)
export async function loadCarouselServicesData(): Promise<CarouselServiceData[]> {
  // First try TinaCMS if available
  if (client) {
    try {
      const result = await client.queries.serviceConnection();
      
      if (result.data.serviceConnection?.edges) {
        return result.data.serviceConnection.edges
          .map((edge: any) => {
            if (!edge?.node) return null;
            const service = edge.node as TinaServiceData;
            return {
              id: service.serviceId,
              title: service.serviceTitle,
              description: service.description,
              features: service.features.slice(0, 4).map(f => f.featureTitle), // Take first 4 features
            };
          })
          .filter((service: any): service is CarouselServiceData => Boolean(service));
      }
    } catch (error) {
      console.log('TinaCMS failed for loadCarouselServicesData, falling back to file system:', error);
    }
  }

  // Fallback to direct file system access
  const serviceIds = await getAllServiceIds();
  return serviceIds.map(id => {
    try {
      const filePath = path.join(process.cwd(), 'content', 'services', `${id}.json`);
      const fileContent = fs.readFileSync(filePath, 'utf8');
      const tinaData: TinaServiceData = JSON.parse(fileContent);
      return {
        id: tinaData.serviceId,
        title: tinaData.serviceTitle,
        description: tinaData.description,
        features: tinaData.features.slice(0, 4).map(f => f.featureTitle), // Take first 4 features
      };
    } catch (error) {
      console.error(`Error loading carousel service data for ${id}:`, error);
      return null;
    }
  }).filter(Boolean) as CarouselServiceData[];
}

// Interface for services page
export interface AllServiceData {
  id: string;
  title: string;
  description: string;
  icon: string;
  features: string[];
  results: string[];
  href: string;
}

// Load all service data for services page (server-side only)
export async function loadAllServicesForPage(): Promise<AllServiceData[]> {
  // First try TinaCMS if available
  if (client) {
    try {
      const result = await client.queries.serviceConnection();
      
      if (result.data.serviceConnection?.edges) {
        return result.data.serviceConnection.edges
          .map((edge: any) => {
            if (!edge?.node) return null;
            const service = edge.node as TinaServiceData;
            return {
              id: service.serviceId,
              title: service.serviceTitle,
              description: service.description,
              icon: service.icon,
              features: service.features.map(f => f.featureTitle),
              results: service.results,
              href: `/services/${service.serviceId}`,
            };
          })
          .filter((service: any): service is AllServiceData => Boolean(service));
      }
    } catch (error) {
      console.log('TinaCMS failed for loadAllServicesForPage, falling back to file system:', error);
    }
  }

  // Fallback to direct file system access
  const serviceIds = await getAllServiceIds();
  return serviceIds.map(id => {
    try {
      const filePath = path.join(process.cwd(), 'content', 'services', `${id}.json`);
      const fileContent = fs.readFileSync(filePath, 'utf8');
      const tinaData: TinaServiceData = JSON.parse(fileContent);
      return {
        id: tinaData.serviceId,
        title: tinaData.serviceTitle,
        description: tinaData.description,
        icon: tinaData.icon,
        features: tinaData.features.map(f => f.featureTitle),
        results: tinaData.results,
        href: `/services/${tinaData.serviceId}`,
      };
    } catch (error) {
      console.error(`Error loading all service data for ${id}:`, error);
      return null;
    }
  }).filter(Boolean) as AllServiceData[];
}

// Get all services with full data (for caching or bulk operations)
export async function getAllServicesData(): Promise<TinaServiceData[]> {
  try {
    const result = await client.queries.serviceConnection();
    
    if (!result.data.serviceConnection?.edges) {
      return [];
    }

    return result.data.serviceConnection.edges
      .map((edge: any) => edge?.node as TinaServiceData)
      .filter(Boolean);
  } catch (error) {
    console.error('Error loading all services data:', error);
    return [];
  }
}

// Check if a service exists
export async function serviceExists(serviceId: string): Promise<boolean> {
  try {
    await client.queries.service({
      relativePath: `${serviceId}.json`,
    });
    return true;
  } catch {
    return false;
  }
}

// Get service data with error handling for better user experience
export async function getServiceDataSafe(serviceId: string) {
  try {
    return await loadServiceData(serviceId);
  } catch (error) {
    console.error(`Failed to load service ${serviceId}:`, error);
    return null;
  }
}
