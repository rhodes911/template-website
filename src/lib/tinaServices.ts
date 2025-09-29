import fs from 'fs';
import path from 'path';

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

// Load service data from TinaCMS JSON files
export function loadServiceData(serviceId: string) {
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

// Get all available service IDs
export function getAllServiceIds(): string[] {
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
