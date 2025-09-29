import { Metadata } from 'next';
import ReactMarkdown from 'react-markdown';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { getAboutData } from '@/lib/about';
import { canonical, SITE_URL, personJsonLd } from '@/lib/seo';
import { getSeoSettings } from '@/lib/settings';
import { buildTestimonialTiles } from '@/lib/content';
import { getPageSeo, buildMetadataFromSeo } from '@/lib/pageSeo';
import AboutClient from './AboutClient';

const aboutSeo = getPageSeo('about')
export const metadata: Metadata = buildMetadataFromSeo(
  { 
    slug: 'about', 
    pageType: 'about'
  }, 
  aboutSeo
)

export default function AboutPage() {
  const aboutData = getAboutData();
  const testimonialItems = buildTestimonialTiles({ limit: 3, includeSlugs: aboutData.testimonialCaseStudies });

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-primary-50/10 to-neutral-50/30">
      <Navigation />
      {/* Hydrated client-side interactions while keeping markdown SSR */}
      <AboutClient
        data={aboutData}
        testimonialItems={testimonialItems}
        markdown={
          <div className="prose prose-lg mx-auto text-neutral-600 prose-headings:text-neutral-900 prose-headings:font-bold prose-h1:text-3xl prose-h1:text-center prose-h1:mb-4 prose-h2:text-2xl prose-h2:mt-8 prose-h2:mb-4">
            <ReactMarkdown>{aboutData.content}</ReactMarkdown>
          </div>
        }
      />

      <Footer />
      {(() => {
        const seo = getSeoSettings();
        const showPerson = seo.jsonLd?.person !== false; // default on
        if (!showPerson) return null;
        return (
          <script
            type="application/ld+json"
            // eslint-disable-next-line react/no-danger
            dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd({
              name: aboutData.name,
              image: aboutData.profileImage ? `${SITE_URL}${aboutData.profileImage.startsWith('/') ? '' : '/'}${aboutData.profileImage}` : undefined,
              jobTitle: aboutData.title,
              url: canonical('/about'),
              worksForName: 'Ellie Edwards Marketing',
            })) }}
          />
        );
      })()}
    </div>
  );
}