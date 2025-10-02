import { Metadata } from 'next';
import { getCaseStudies, buildTestimonialsFromCaseStudies } from '@/lib/content';
import { getPageSeo, buildMetadataFromSeo } from '@/lib/pageSeo';
import { getCaseStudiesPageData } from '@/lib/server/pages';
import CaseStudiesClient from '@/components/CaseStudiesClient';
import Navigation from '@/components/Navigation';
import Breadcrumbs from '@/components/Breadcrumbs';
import Footer from '@/components/Footer';
import Link from 'next/link';

export async function generateMetadata(): Promise<Metadata> {
  const pageData = getCaseStudiesPageData();
  const csSeo = getPageSeo('case-studies');
  
  return buildMetadataFromSeo(
    { 
      slug: 'case-studies', 
      pageType: 'listing',
      contentData: {
        title: pageData.heroTitle,
        description: pageData.heroDescription
      }
    }, 
    pageData.seo || csSeo
  );
}

export default async function CaseStudiesPage() {
  const [caseStudies, testimonials, pageData] = await Promise.all([
    getCaseStudies(),
    Promise.resolve(buildTestimonialsFromCaseStudies()),
    Promise.resolve(getCaseStudiesPageData())
  ]);
  // Hero handled within CaseStudiesClient to prevent duplication.

  return (
    <>
      {/* Preload critical case study images */}
      <link rel="preload" as="image" href="/images/case-study-restaurant.jpg" />
      <link rel="preload" as="image" href="/images/case-study-ecommerce.jpg" />
      <link rel="preload" as="image" href="/images/case-study-coach.jpg" />
      
      {/* Hidden server-side navigation for crawlers (no heading semantics) */}
      <nav style={{ display: 'none' }} aria-hidden="true">
        {/* Intentionally no heading element here to avoid heading order issues */}
        <ul>
          <li><Link href="/">Home</Link></li>
          <li><Link href="/services">Services</Link></li>
          <li><Link href="/services/brand-strategy">Brand Strategy</Link></li>
          <li><Link href="/services/content-marketing">Content Marketing</Link></li>
          <li><Link href="/services/lead-generation">Lead Generation</Link></li>
          <li><Link href="/services/sample-service-1">REPLACE Service 1</Link></li>
          <li><Link href="/services/ppc">PPC Advertising</Link></li>
          <li><Link href="/services/social-media">Social Media Management</Link></li>
          <li><Link href="/services/website-design">Website Design</Link></li>
          <li><Link href="/services/digital-campaigns">Digital Campaigns</Link></li>
          <li><Link href="/services/email-marketing">Email Marketing</Link></li>
          <li><Link href="/case-studies">Case Studies</Link></li>
          <li><Link href="/case-studies/bella-vista-restaurant">Bella Vista Restaurant Case Study</Link></li>
          <li><Link href="/case-studies/sarah-mitchell-coaching">Sarah Mitchell Coaching Case Study</Link></li>
          <li><Link href="/case-studies/ecohome-solutions">EcoHome Solutions Case Study</Link></li>
          <li><Link href="/blog">Blog</Link></li>
          <li><Link href="/blog/marketing-strategy-small-business-guide">Marketing Strategy Guide</Link></li>
          <li><Link href="/blog/content-marketing-vs-social-media-strategy">Content Marketing vs Social Media</Link></li>
          <li><Link href="/contact">Contact</Link></li>
          <li><Link href="/faq">FAQ</Link></li>
        </ul>
      </nav>
      
      <Navigation />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
        <Breadcrumbs
          items={[
            { label: 'Home', href: '/' },
            { label: 'Case Studies' },
          ]}
        />
      </div>
      <CaseStudiesClient caseStudies={caseStudies} testimonials={testimonials} pageData={pageData} />
      <Footer />
    </>
  );
}
