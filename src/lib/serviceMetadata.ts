import { Metadata } from 'next';
import { getService } from '@/lib/server/services';

export async function generateServiceMetadata(serviceId: string): Promise<Metadata> {
  const service = getService(serviceId);
  
  if (!service) {
    return {
      title: 'Service Not Found | [Your Business]',
      description: 'The requested service could not be found.',
    };
  }
  
  return {
    title: `${service.title} Services | [Your Business]`,
    description: service.description,
    keywords: service.keywords.join(', '),
    openGraph: {
      title: `${service.title} Services | [Your Business]`,
      description: service.description,
      type: 'website',
    },
  };
}
