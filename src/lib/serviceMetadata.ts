import { Metadata } from 'next';
import { getService } from '@/lib/server/services';

export async function generateServiceMetadata(serviceId: string): Promise<Metadata> {
  const service = getService(serviceId);
  
  if (!service) {
    return {
      title: 'Service Not Found | Ellie Edwards Marketing',
      description: 'The requested service could not be found.',
    };
  }
  
  return {
    title: `${service.title} Services | Ellie Edwards Marketing`,
    description: service.description,
    keywords: service.keywords.join(', '),
    openGraph: {
      title: `${service.title} Services | Ellie Edwards Marketing`,
      description: service.description,
      type: 'website',
    },
  };
}
