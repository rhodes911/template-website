import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { buildMetadataFromSeo } from '@/lib/pageSeo';
import { getCaseStudy, getCaseStudies } from '@/lib/content';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import CaseStudyDetail from '@/components/CaseStudyDetail';

interface Props {
  params: {
    slug: string;
  };
}

// Generate static params for all case studies
export async function generateStaticParams() {
  const caseStudies = getCaseStudies();
  return caseStudies.map((study) => ({
    slug: study.id,
  }));
}

// Generate metadata for each case study
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const caseStudy = getCaseStudy(params.slug);
  
  if (!caseStudy) {
    return {
      title: 'Case Study Not Found | REPLACE Your Business Name',
      description: 'The requested case study could not be found.',
    };
  }

  return buildMetadataFromSeo(
    { 
      slug: `case-studies/${params.slug}`, 
      pageType: 'case-study',
      contentData: {
        title: caseStudy.title,
        client: caseStudy.client,
        industry: caseStudy.industry,
        challenge: caseStudy.challenge,
        tags: caseStudy.tags
      }
    }, 
    caseStudy.seo
  );
}

export default function CaseStudyPage({ params }: Props) {
  const caseStudy = getCaseStudy(params.slug);
  
  if (!caseStudy) {
    notFound();
  }

  return (
    <>
      <Navigation />
      <CaseStudyDetail caseStudy={caseStudy} />
      <Footer />
    </>
  );
}
