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
    heroTitle: data.heroTitle || 'REPLACE Home Hero Title',
    heroSubtitle: data.heroSubtitle || 'REPLACE Home Hero Subtitle',
    heroDescription: data.heroDescription || '',
    heroCtas: data.heroCtas || { primaryLabel: 'REPLACE Primary CTA', primaryHref: '/contact', secondaryLabel: 'REPLACE Secondary CTA', secondaryHref: '/services' },
    coreBlocks: {
      title: data.coreBlocks?.title || 'REPLACE Core Blocks Title',
      intro: data.coreBlocks?.intro,
      items: data.coreBlocks?.items || [],
    },
    howWeHelp: {
      title: data.howWeHelp?.title || 'REPLACE Your Services Section Title',
      intro: data.howWeHelp?.intro,
      ctaLabel: data.howWeHelp?.ctaLabel || 'View All Services',
      ctaHref: data.howWeHelp?.ctaHref || '/services',
    },
    clientSignals: {
  title: data.clientSignals?.title || 'Client Signals',
  testimonialCaseStudies: data.clientSignals?.testimonialCaseStudies || [],
    },
    pageCta: {
      title: data.pageCta?.title || 'Ready To Build Compounding Growth?',
      description: data.pageCta?.description || '',
      buttonLabel: data.pageCta?.buttonLabel || 'REPLACE CTA Button Text',
      buttonHref: data.pageCta?.buttonHref || '/contact',
    },
    toggles: data.toggles || { enableCommandPalette: true, enableScrollProgress: true },
    seo: data.seo,
  };
}
