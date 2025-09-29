import type { Metadata } from 'next'
// Import client component statically so its headings SSR into initial HTML
import InteractiveExperimentClient from './experimental-home/InteractiveExperimentClient'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import { localBusinessJsonLd } from '@/lib/seo'
import { getSeoSettings } from '@/lib/settings'
import { getHomeData } from '@/tina/queries/home'
import { buildTestimonialTiles } from '@/lib/content'
import { buildMetadataFromSeo } from '@/lib/pageSeo'

export async function generateMetadata(): Promise<Metadata> {
  const homeData = getHomeData()
  const seo = homeData.seo
  
  return buildMetadataFromSeo(
    { 
      slug: '', 
      pageType: 'home'
    }, 
    seo
  )
}

export default function HomePage() {
  const data = getHomeData();
  const testimonialItems = buildTestimonialTiles({ limit: 3, includeSlugs: data.clientSignals?.testimonialCaseStudies });
  return (
    <>
      <Navigation />
      <main id="main-content" role="main">
        <InteractiveExperimentClient
          heroTitle={data.heroTitle}
          heroSubtitle={data.heroSubtitle}
          heroDescription={data.heroDescription}
          heroCtas={data.heroCtas}
          coreBlocks={data.coreBlocks}
          howWeHelp={data.howWeHelp}
          clientSignals={data.clientSignals}
          testimonialItems={testimonialItems}
          pageCta={data.pageCta}
          toggles={data.toggles}
        />
      </main>
      <Footer />
      {(() => {
        const seo = getSeoSettings();
        const showLocal = seo.jsonLd?.localBusiness !== false; // default on unless explicitly false
        if (!showLocal) return null;
        return (
          <script
            type="application/ld+json"
            // eslint-disable-next-line react/no-danger
            dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessJsonLd()) }}
          />
        );
      })()}
    </>
  )
}

// InteractiveExperimentClient is statically imported so the hero H1/H2 SSR into initial HTML
