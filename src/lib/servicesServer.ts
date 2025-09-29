// Server-only file for loading service data
import fs from 'fs';
import path from 'path';

export interface Service {
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

// Convert service data to component format
export function convertServiceToComponentData(service: Service) {
  return {
    id: service.serviceId,
    title: service.serviceTitle,
    subtitle: service.subtitle,
    description: service.description,
    keywords: service.keywords,
    icon: service.icon,
    heroTitle: service.hero.heroTitle,
    heroSubtitle: service.hero.heroSubtitle,
    heroDescription: service.hero.heroDescription,
    whatYouGet: service.hero.whatYouGet,
    features: service.features.map(feature => ({
      title: feature.featureTitle,
      description: feature.featureDescription,
      icon: feature.featureIcon,
    })),
    process: service.process.map(step => ({
      step: step.step,
      title: step.processTitle,
      description: step.processDescription,
      duration: step.duration,
    })),
    results: service.results,
    faqs: service.faqs,
    ctaTitle: service.cta.ctaTitle,
    ctaDescription: service.cta.ctaDescription,
    emailSubject: service.cta.emailSubject,
    emailBody: service.cta.emailBody,
  };
}

// Server-side function to get a single service
export function getService(serviceId: string): Service | null {
  try {
    const filePath = path.join(process.cwd(), 'content', 'services', `${serviceId}.json`);
    
    if (!fs.existsSync(filePath)) {
      return null;
    }
    
    const fileContents = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(fileContents) as Service;
  } catch (error) {
    console.error(`Error loading service ${serviceId}:`, error);
    return null;
  }
}

// Server-side function to get all services
export function getAllServices(): Service[] {
  try {
    const servicesDirectory = path.join(process.cwd(), 'content', 'services');
    
    if (!fs.existsSync(servicesDirectory)) {
      return [];
    }
    
    const filenames = fs.readdirSync(servicesDirectory);
    const services = filenames
      .filter(name => name.endsWith('.json'))
      .map(name => {
        const serviceId = name.replace(/\.json$/, '');
        return getService(serviceId);
      })
      .filter((service): service is Service => service !== null);
    
    return services;
  } catch (error) {
    console.error('Error loading services:', error);
    return [];
  }
}

// Server-side function to get service IDs
export function getServiceIds(): string[] {
  try {
    const servicesDirectory = path.join(process.cwd(), 'content', 'services');
    
    if (!fs.existsSync(servicesDirectory)) {
      return [];
    }
    
    const filenames = fs.readdirSync(servicesDirectory);
    return filenames
      .filter(name => name.endsWith('.json'))
      .map(name => name.replace(/\.json$/, ''));
  } catch (error) {
    console.error('Error loading service IDs:', error);
    return [];
  }
}

// Server-side function to check if a service exists
export function serviceExists(serviceId: string): boolean {
  try {
    const filePath = path.join(process.cwd(), 'content', 'services', `${serviceId}.json`);
    return fs.existsSync(filePath);
  } catch {
    return false;
  }
}
