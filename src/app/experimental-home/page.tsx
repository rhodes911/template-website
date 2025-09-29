import type { Metadata } from 'next';
import dynamic from 'next/dynamic';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { canonical, SITE_URL } from '@/lib/seo';

export const metadata: Metadata = {
  title: 'Digital Marketing Camberley Surrey | Experimental Interactive Version',
  description: 'Experimental version of our digital marketing homepage for Camberley, Surrey & Hampshire – showcasing SEO, lead generation, content marketing, PPC, brand strategy & conversion optimization.',
  keywords: [
    'digital marketing', 'digital marketing Camberley', 'marketing consultant Surrey', 'lead generation', 'content marketing', 'SEO services Surrey', 'ppc management', 'brand development', 'conversion optimization', 'local marketing expert'
  ],
  alternates: { canonical: canonical('/experimental-home') },
  openGraph: {
    title: 'Digital Marketing Camberley Surrey | Interactive Experience',
    description: 'Interactive showcase of Ellie Edwards Marketing services: SEO, PPC, content, email marketing, brand & lead generation for Surrey & Hampshire businesses.',
    type: 'website',
    url: canonical('/experimental-home'),
    siteName: 'Ellie Edwards Marketing',
    images: [
      { url: `${SITE_URL}/images/ellie-edwards-logo.png`, width: 1200, height: 630, alt: 'Ellie Edwards Marketing Logo' }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Digital Marketing Camberley Surrey | Interactive Experience',
    description: 'SEO, lead generation, content marketing, PPC & brand strategy experimental interface.',
    images: [`${SITE_URL}/images/ellie-edwards-logo.png`]
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
            name: 'Digital Marketing Camberley Surrey | Interactive Experience',
            description: 'Experimental digital marketing homepage variant focusing on SEO, PPC, content marketing, lead generation & brand strategy for Camberley, Surrey and Hampshire businesses.',
            url: canonical('/experimental-home'),
            inLanguage: 'en-GB',
            about: [
              { '@type': 'Thing', name: 'Digital Marketing' },
              { '@type': 'Thing', name: 'Lead Generation' },
              { '@type': 'Thing', name: 'SEO Services' },
              { '@type': 'Thing', name: 'Content Marketing' },
              { '@type': 'Thing', name: 'PPC Management' },
              { '@type': 'Thing', name: 'Brand Strategy' }
            ],
            potentialAction: {
              '@type': 'ContactAction',
              name: 'Book Strategy Call',
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
