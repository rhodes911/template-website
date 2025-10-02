import { Metadata } from 'next';
import { getEnrichedServicesForPage } from '@/lib/server/services';
import { getServicesPageData } from '@/lib/server/pages';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
// Page now delegates hero + filtering + grid to ServicesPageClient
import ServicesPageClient from '@/components/ServicesPageClient';
// Removed personalization enhancer (simplified to only per-service recommended reads on detail pages)
import Breadcrumbs from '@/components/Breadcrumbs';
import { buildMetadataFromSeo, getPageSeo } from '@/lib/pageSeo';

export default function ServicesPage() {
  const services = getEnrichedServicesForPage();
  const pageData = getServicesPageData();

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-primary-50/10 to-neutral-50/30">
      <Navigation />
      {/* Breadcrumb */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
        <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Services' }]} />
      </div>
      <ServicesPageClient services={services} pageData={pageData} />
      <Footer />
    </div>
  );
}

// Dynamic metadata generation
export async function generateMetadata(): Promise<Metadata> {
  const pageData = getServicesPageData();
  const servicesSeo = getPageSeo('services');

  return buildMetadataFromSeo(
    { 
      slug: 'services', 
      pageType: 'listing',
      contentData: {
        title: pageData.heroTitle,
        description: pageData.heroDescription
      }
    }, 
    servicesSeo || pageData.seo
  );
}
