export type CoreBlockCategory = 'Foundation' | 'Attract' | 'Trust' | 'Convert';

export interface HomeData {
  heroTitle: string;
  heroSubtitle: string;
  heroDescription: string;
  heroCtas?: {
    primaryLabel?: string;
    primaryHref?: string;
    secondaryLabel?: string;
    secondaryHref?: string;
  };
  coreBlocks: {
    title: string;
    intro?: string;
    items?: Array<{
      title: string;
      description: string;
      icon?: string;
      category: CoreBlockCategory;
      benefits?: string[];
      links?: { label: string; href: string }[];
    }>;
  };
  howWeHelp: {
    title: string;
    intro?: string;
    ctaLabel: string;
    ctaHref: string;
  };
  clientSignals: {
    title: string;
  testimonialCaseStudies?: string[];
  };
  pageCta: {
    title: string;
    description: string;
    buttonLabel: string;
    buttonHref: string;
  };
  toggles?: {
    enableCommandPalette?: boolean;
    enableScrollProgress?: boolean;
  };
  seo?: {
    metaTitle?: string;
    metaDescription?: string;
    canonicalUrl?: string;
    noIndex?: boolean;
    keywords?: string[];
    targetKeywords?: { primary?: string[]; secondary?: string[] };
    openGraph?: { ogTitle?: string; ogDescription?: string; ogImage?: string };
  };
}
