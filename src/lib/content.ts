import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

export interface CaseStudy {
  id: string;
  title: string;
  client: string;
  industry: string;
  challenge: string;
  solution: string;
  image: string;
  date: string;
  readTime: string;
  featured?: boolean;
  order?: number;
  tags: string[];
  testimonial?: { quote?: string; author?: string; role?: string; metrics?: string[]; featured?: boolean };
  seo?: {
    metaTitle?: string;
    metaDescription?: string;
    canonicalUrl?: string;
    noIndex?: boolean;
    openGraph?: {
      ogTitle?: string;
      ogDescription?: string;
      ogImage?: string;
    };
  };
  results: {
    [key: string]: string;
  };
  content: string;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  company: string;
  image: string;
  rating: number;
  featured?: boolean;
  order?: number;
  position?: string; // For backward compatibility
  results?: string[]; // For backward compatibility
  caseStudy?: string; // optional slug of linked case study
  content: string;
}

const contentDirectory = path.join(process.cwd(), 'content');

export function getCaseStudies(): CaseStudy[] {
  const caseStudiesDirectory = path.join(contentDirectory, 'case-studies');
  
  if (!fs.existsSync(caseStudiesDirectory)) {
    return [];
  }

  const fileNames = fs.readdirSync(caseStudiesDirectory);
  const caseStudies = fileNames
    .filter(name => name.endsWith('.md'))
    .map(name => {
      const id = name.replace(/\.md$/, '');
      const fullPath = path.join(caseStudiesDirectory, name);
      const fileContents = fs.readFileSync(fullPath, 'utf8');
      const { data, content } = matter(fileContents);

      return {
        id,
        ...data,
        content,
      } as CaseStudy;
    });

  // Sort by order if specified, then by date
  return caseStudies.sort((a, b) => {
    if (a.order && b.order) {
      return a.order - b.order;
    }
    if (a.order) return -1;
    if (b.order) return 1;
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });
}

export function getCaseStudy(id: string): CaseStudy | null {
  try {
    const fullPath = path.join(contentDirectory, 'case-studies', `${id}.md`);
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const { data, content } = matter(fileContents);

    return {
      id,
      ...data,
      content,
    } as CaseStudy;
  } catch {
    return null;
  }
}

export function getTestimonials(): Testimonial[] {
  const testimonialsDirectory = path.join(contentDirectory, 'testimonials');
  
  if (!fs.existsSync(testimonialsDirectory)) {
    return [];
  }

  const fileNames = fs.readdirSync(testimonialsDirectory);
  const testimonials = fileNames
    .filter(name => name.endsWith('.md'))
    .map(name => {
      const id = name.replace(/\.md$/, '');
      const fullPath = path.join(testimonialsDirectory, name);
      const fileContents = fs.readFileSync(fullPath, 'utf8');
      const { data, content } = matter(fileContents);

      return {
        id,
        ...data,
        content,
      } as Testimonial;
    });

  // Sort by order if specified, then featured first
  return testimonials.sort((a, b) => {
    if (a.order && b.order) {
      return a.order - b.order;
    }
    if (a.order) return -1;
    if (b.order) return 1;
    if (a.featured && !b.featured) return -1;
    if (!a.featured && b.featured) return 1;
    return 0;
  });
}

export function getFeaturedCaseStudies(): CaseStudy[] {
  return getCaseStudies().filter(study => study.featured);
}

export function getFeaturedTestimonials(): Testimonial[] {
  return getTestimonials().filter(testimonial => testimonial.featured);
}


export function buildTestimonialTiles(opts?: { limit?: number; includeSlugs?: string[] }) {
  const limit = opts?.limit ?? 6;
  const include = Array.isArray(opts?.includeSlugs) ? opts?.includeSlugs.filter(Boolean) : [];
  const caseStudies = getCaseStudies();
  // If explicit include order provided, map in that order and ignore others (up to limit)
  if (include && include.length) {
    const itemsOrdered = include
      .map(slug => caseStudies.find(cs => cs.id === slug))
      .filter((cs): cs is CaseStudy => Boolean(cs))
      .map(cs => {
        const quote = (cs.testimonial?.quote || '').trim();
        const name = cs.testimonial?.author || cs.client || 'Client';
        const role = cs.testimonial?.role;
        const metrics = (cs.testimonial?.metrics && cs.testimonial.metrics.length)
          ? cs.testimonial.metrics
          : Object.values(cs.results || {});
        return { quote, name, role, company: cs.client, metrics, slug: cs.id };
      })
      .filter(item => item.quote || (item.metrics && item.metrics.length));
    const outSel = itemsOrdered.slice(0, limit);
    if (outSel.length) return outSel;
  }
  const items = caseStudies
    .filter(cs => cs.testimonial && (cs.testimonial.quote || (cs.testimonial.metrics && cs.testimonial.metrics.length)))
    .map(cs => {
      const quote = (cs.testimonial?.quote || '').trim();
      const name = cs.testimonial?.author || cs.client || 'Client';
      const role = cs.testimonial?.role;
      const metrics = (cs.testimonial?.metrics && cs.testimonial.metrics.length)
        ? cs.testimonial.metrics
        : Object.values(cs.results || {});
      return {
        quote,
        name,
        role,
        company: cs.client,
        metrics,
        slug: cs.id,
      };
    })
    // Prefer featured case study snippets
    .sort((a, b) => {
      const ca = caseStudies.find(cs => cs.id === a.slug);
      const cb = caseStudies.find(cs => cs.id === b.slug);
      if (ca?.testimonial?.featured && !cb?.testimonial?.featured) return -1;
      if (!ca?.testimonial?.featured && cb?.testimonial?.featured) return 1;
      return 0;
    });
  const out = items.slice(0, limit);
  if (out.length) return out;
  // Fallback: original three defaults (ensures the section isn’t empty)
  return [
    {
      quote:
        "REPLACE Sample testimonial quote 1. This should be a genuine review from a satisfied client highlighting the value and results you provided.",
      name: 'REPLACE Client Name 1',
      role: 'REPLACE Client Title/Role, REPLACE Company Name',
      metrics: ['REPLACE Metric 1', 'REPLACE Metric 2', 'REPLACE Metric 3'],
      slug: 'sample-case-study-1',
    },
    {
      quote:
        "REPLACE Sample testimonial quote 2. Another positive review showcasing different aspects of your service and the impact on their business.",
      name: 'REPLACE Client Name 2',
      role: 'REPLACE Client Title/Role, REPLACE Company Name',
      metrics: ['REPLACE Metric 1', 'REPLACE Metric 2', 'REPLACE Metric 3'],
      slug: 'sample-case-study-2',
    },
    {
      quote:
        'REPLACE Sample testimonial quote 3. A third testimonial that demonstrates your expertise and the transformation you helped achieve.',
      name: 'REPLACE Client Name 3',
      role: 'REPLACE Client Title/Role, REPLACE Company Name',
      metrics: ['REPLACE Metric 1', 'REPLACE Metric 2', 'REPLACE Metric 3'],
      slug: 'sample-case-study-3',
    },
  ].slice(0, limit);
}

// Build full Testimonial objects (for the Case Studies index page) from Case Studies
export function buildTestimonialsFromCaseStudies(limit = 12): Testimonial[] {
  const caseStudies = getCaseStudies();
  const items = caseStudies
    .filter(cs => cs.testimonial && (cs.testimonial.quote || (cs.testimonial.metrics && cs.testimonial.metrics.length)))
    .map(cs => {
      const quote = (cs.testimonial?.quote || '').trim();
      const name = cs.testimonial?.author || cs.client || 'Client';
      const role = cs.testimonial?.role || '';
      const metrics = (cs.testimonial?.metrics && cs.testimonial.metrics.length)
        ? cs.testimonial.metrics
        : Array.isArray(cs.results) 
          ? cs.results.map(r => `${r.value} ${r.metric}`) 
          : Object.values(cs.results || {});
      return {
        id: cs.id,
        name,
        role,
        company: cs.client,
        image: '/android-chrome-192x192.png', // placeholder not used by UI
        rating: 5,
        featured: cs.testimonial?.featured,
        order: cs.order,
        results: metrics,
        caseStudy: cs.id,
        content: quote || (metrics && metrics.length ? metrics.join(' • ') : ''),
      } as Testimonial;
    })
    .sort((a, b) => {
      const ca = caseStudies.find(cs => cs.id === a.caseStudy);
      const cb = caseStudies.find(cs => cs.id === b.caseStudy);
      if (ca?.testimonial?.featured && !cb?.testimonial?.featured) return -1;
      if (!ca?.testimonial?.featured && cb?.testimonial?.featured) return 1;
      if (typeof a.order === 'number' && typeof b.order === 'number') return a.order - b.order;
      if (typeof a.order === 'number') return -1;
      if (typeof b.order === 'number') return 1;
      return 0;
    });
  return items.slice(0, limit);
}
