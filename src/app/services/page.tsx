import { Metadata } from 'next';
import { getEnrichedServicesForPage } from '@/lib/server/services';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
// Page now delegates hero + filtering + grid to ServicesPageClient
import ServicesPageClient from '@/components/ServicesPageClient';
// Removed personalization enhancer (simplified to only per-service recommended reads on detail pages)
import Breadcrumbs from '@/components/Breadcrumbs';
import { buildMetadataFromSeo, getPageSeo } from '@/lib/pageSeo';

const servicesSeo = getPageSeo('services')
export const metadata: Metadata = buildMetadataFromSeo(
  { 
    slug: 'services', 
    pageType: 'listing',
    contentData: {
      title: 'Digital Marketing Services',
      description: 'Comprehensive digital marketing services to grow your business. SEO, PPC, content marketing, social media, and more.'
    }
  }, 
  servicesSeo
)

export default function ServicesPage() {
  const services = getEnrichedServicesForPage();

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-primary-50/10 to-neutral-50/30">
      <Navigation />
      {/* Breadcrumb */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
        <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Services' }]} />
      </div>
  <ServicesPageClient services={services} />
      <Footer />
    </div>
  );
}
