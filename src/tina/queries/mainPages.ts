import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import type { PageSeoFrontmatter } from '@/lib/pageSeo';

export type MainPageSlug = 'blog' | 'case-studies' | 'services' | 'contact' | 'faq';

export type CTA = {
  title?: string;
  description?: string;
  buttonLabel?: string;
  buttonHref?: string;
};

export type HeroCtas = {
  primaryLabel?: string;
  primaryHref?: string;
  secondaryLabel?: string;
  secondaryHref?: string;
};

export type MainPageData = {
  heroTitle?: string;
  heroSubtitle?: string;
  heroDescription?: string;
  heroHighlights?: string[];
  heroCtas?: HeroCtas;
  secondaryLink?: { label?: string; href?: string };
  pageCta?: CTA;
  faqs?: { question: string; answer: string }[];
  blogCategories?: string[];
  contactMethods?: Array<{ icon?: string; title?: string; subtitle?: string; value?: string; href?: string }>;

  expectations?: string[];
  faqTiles?: Array<{ title?: string; description?: string; href?: string }>;

  seo?: PageSeoFrontmatter['seo'];
};

export function getMainPageData(slug: MainPageSlug, fallbacks?: Partial<MainPageData>): MainPageData {
  const p = path.join(process.cwd(), 'content', `${slug}.md`);
  const raw = fs.readFileSync(p, 'utf8');
  const { data } = matter(raw);

  return {
    heroTitle: data.heroTitle ?? fallbacks?.heroTitle,
    heroSubtitle: data.heroSubtitle ?? fallbacks?.heroSubtitle,
    heroDescription: data.heroDescription ?? fallbacks?.heroDescription,
    heroHighlights: data.heroHighlights ?? fallbacks?.heroHighlights,
    heroCtas: data.heroCtas ?? fallbacks?.heroCtas,
    secondaryLink: data.secondaryLink ?? fallbacks?.secondaryLink,
    pageCta: data.pageCta ?? fallbacks?.pageCta,
    faqs: data.faqs ?? fallbacks?.faqs ?? [],
    blogCategories: data.blogCategories ?? fallbacks?.blogCategories,
    contactMethods: data.contactMethods ?? fallbacks?.contactMethods,
    expectations: data.expectations ?? fallbacks?.expectations,
    faqTiles: data.faqTiles ?? fallbacks?.faqTiles,
    seo: data.seo,
  };
}
