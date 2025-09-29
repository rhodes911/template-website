import ServicePage from '@/components/ServicePage';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { buildMetadataFromSeo, getPageSeo } from '@/lib/pageSeo';
import { getService, getAllServiceIds, getServicesForPage } from '@/lib/server/services';
import { notFound } from 'next/navigation';

interface ServicePageProps {
  params: {
    slug: string;
  };
}

export async function generateMetadata({ params }: ServicePageProps) {
  const service = getService(params.slug);
  if (!service) return {};
  
  const seo = getPageSeo(`services/${params.slug}`);
  
  return buildMetadataFromSeo(
    { 
      slug: `services/${params.slug}`, 
      pageType: 'service',
      contentData: service
    }, 
    seo
  );
}

export async function generateStaticParams() {
  const serviceIds = getAllServiceIds();
  return serviceIds.map((id) => ({
    slug: id,
  }));
}

export default function DynamicServicePage({ params }: ServicePageProps) {
  const service = getService(params.slug);
  
  if (!service) {
    notFound();
  }
  // Build simple related services list (exclude current)
  const relatedServices = getServicesForPage()
    .filter(s => s.id !== params.slug)
    .slice(0, 6)
    .map(s => ({ id: s.id, title: s.title, href: s.href }));
  
  return (
    <>
      <Navigation />
      <ServicePage service={service} relatedServices={relatedServices} />
      <Footer />
    </>
  );
}
