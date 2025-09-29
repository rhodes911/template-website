import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import type { HomeData } from '@/app/home.types';

export function getHomeData(): HomeData {
  const p = path.join(process.cwd(), 'content', 'home.md');
  const raw = fs.readFileSync(p, 'utf8');
  const { data } = matter(raw);

  // Minimal normalization with fallbacks so builds never break
  return {
    heroTitle: data.heroTitle || 'Digital Marketing in Camberley, Surrey',
    heroSubtitle: data.heroSubtitle || 'Creating Measurable Growth',
    heroDescription: data.heroDescription || '',
    heroCtas: data.heroCtas || { primaryLabel: 'Book Strategy Call', primaryHref: '/contact', secondaryLabel: 'Explore Services', secondaryHref: '/services' },
    coreBlocks: {
      title: data.coreBlocks?.title || 'Core Building Blocks',
      intro: data.coreBlocks?.intro,
      items: data.coreBlocks?.items || [],
    },
    howWeHelp: {
      title: data.howWeHelp?.title || 'How We Help You Grow',
      intro: data.howWeHelp?.intro,
      ctaLabel: data.howWeHelp?.ctaLabel || 'Full Services Overview',
      ctaHref: data.howWeHelp?.ctaHref || '/services',
    },
    clientSignals: {
  title: data.clientSignals?.title || 'Client Signals',
  testimonialCaseStudies: data.clientSignals?.testimonialCaseStudies || [],
    },
    pageCta: {
      title: data.pageCta?.title || 'Ready To Build Compounding Growth?',
      description: data.pageCta?.description || '',
      buttonLabel: data.pageCta?.buttonLabel || 'Book Strategy Call',
      buttonHref: data.pageCta?.buttonHref || '/contact',
    },
    toggles: data.toggles || { enableCommandPalette: true, enableScrollProgress: true },
    seo: data.seo,
  };
}
