import type { Metadata } from 'next';
import dynamic from 'next/dynamic';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { canonical, SITE_URL } from '@/lib/seo';

export const metadata: Metadata = {
  title: 'REPLACE Experimental Page Title | [Your Business] [Location]',
  description: 'REPLACE Experimental page description. Describe your experimental homepage version.',
  keywords: [
    'REPLACE keyword 1', 'REPLACE keyword 2', 'REPLACE your service', 'REPLACE your specialty', 'REPLACE your location'
  ],
  alternates: { canonical: canonical('/experimental-home') },
  openGraph: {
    title: 'REPLACE Experimental Page Title | [Your Business]',
    description: 'REPLACE Interactive showcase of your services: List your services here for optimal SEO.',
    type: 'website',
    url: canonical('/experimental-home'),
    siteName: 'REPLACE Your Business Name',
    images: [
            { url: `${SITE_URL}/images/REPLACE-your-logo.png`, width: 1200, height: 630, alt: 'REPLACE Your Business Name Logo' }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'REPLACE Service Title [Location] | Interactive Experience',
    description: 'SEO, lead generation, content marketing, PPC & brand strategy experimental interface.',
    images: [`${SITE_URL}/images/REPLACE-your-logo.png`]
  },
  // Force experimental route out of the index + prevent link equity flow
  robots: 'noindex,nofollow'
};

// Dynamically load client-side interactive bundle (no SSR) to keep server component lean
const InteractiveExperimentClient = dynamic(() => import('./InteractiveExperimentClient'), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen flex items-center justify-center text-sm text-neutral-500">
      Loading interactive experience…
    </div>
  )
});

export default function Page() {
  return (
    <>
      <Navigation />
      <InteractiveExperimentClient />
      <Footer />
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'WebPage',
            name: 'REPLACE Service Title [Location] | Interactive Experience',
            description: 'REPLACE experimental homepage variant focusing on your services: List your key services for optimal SEO and user experience.',
            url: canonical('/experimental-home'),
            inLanguage: 'en-GB',
            about: [
              { '@type': 'Thing', name: 'Digital Marketing' },
              { '@type': 'Thing', name: 'Lead Generation' },
              { '@type': 'Thing', name: 'REPLACE Service 1' },
              { '@type': 'Thing', name: 'Content Marketing' },
              { '@type': 'Thing', name: 'PPC Management' },
              { '@type': 'Thing', name: 'Brand Strategy' }
            ],
            potentialAction: {
              '@type': 'ContactAction',
              name: 'REPLACE CTA Button Text',
              target: canonical('/contact')
            },
            breadcrumb: {
              '@type': 'BreadcrumbList',
              itemListElement: [
                { '@type': 'ListItem', position: 1, name: 'Home', item: canonical('/') },
                { '@type': 'ListItem', position: 2, name: 'Interactive Experience', item: canonical('/experimental-home') }
              ]
            }
          })
        }}
      />
    </>
  );
}
