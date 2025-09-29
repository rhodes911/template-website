import { Target, Megaphone, MousePointer, PenTool, Star, TrendingUp, Globe, Mail } from 'lucide-react';

import { type LucideIcon } from 'lucide-react';

export interface ServiceArchetypeConfig {
  id: string;
  question: string;
  icon: LucideIcon; // Lucide icon component
  serviceIds: string[]; // explicit mapping to service frontmatter ids
  blogSlugs: string[]; // related blog post slugs (without /blog/ prefix)
}

// Ensure every question maps to at least one service & one blog
export const serviceArchetypes: ServiceArchetypeConfig[] = [
  {
    id: 'positioning-clarity',
    question: 'Are prospects unclear about what you actually do?',
    icon: Target,
    serviceIds: ['brand-strategy', 'content-marketing'],
    // Primary pillar + supporting/legacy broad strategy guide
    blogSlugs: [
      'positioning-message-clarity-guide-2025',
      'marketing-strategy-small-business-guide'
    ]
  },
  {
    id: 'predictable-leads',
    question: 'Do you lack a predictable flow of qualified leads?',
    icon: Megaphone,
    serviceIds: ['lead-generation', 'ppc', 'social-media'],
    blogSlugs: [
      'predictable-lead-generation-systems-sme-2025',
      'content-marketing-vs-social-media-strategy'
    ]
  },
  {
    id: 'improve-conversion',
    question: 'Is website traffic not turning into enquiries?',
    icon: MousePointer,
    serviceIds: ['website-design', 'seo', 'lead-generation'],
    blogSlugs: [
      'website-conversion-optimization-playbook-post-sge',
      'marketing-strategy-small-business-guide'
    ]
  },
  {
    id: 'package-offer',
    question: 'Do you have services but no clear packaged offer?',
    icon: PenTool,
    serviceIds: ['brand-strategy', 'lead-generation'],
    blogSlugs: [
      'packaging-productizing-services-2025',
      'marketing-strategy-small-business-guide'
    ]
  },
  {
    id: 'build-authority',
    question: 'Do you feel invisible vs. competitors?',
    icon: Star,
    serviceIds: ['content-marketing', 'seo', 'brand-strategy'],
    blogSlugs: [
      'authority-trust-building-eeat-digital-pr-2025',
      'content-marketing-vs-social-media-strategy'
    ]
  },
  {
    id: 'scale-marketing',
    question: 'Is growth stalled because everything depends on you?',
    icon: TrendingUp,
    serviceIds: ['digital-campaigns', 'email-marketing', 'lead-generation'],
    blogSlugs: [
      'scaling-marketing-operations-ai-delegation-2025',
      'marketing-strategy-small-business-guide'
    ]
  },
  {
    id: 'increase-organic',
    question: 'Do you want more organic visibility & compounding traffic?',
    icon: Globe,
    serviceIds: ['seo', 'content-marketing'],
    blogSlugs: [
      'compounding-organic-growth-engine-2025',
      'content-marketing-vs-social-media-strategy'
    ]
  },
  {
    id: 'nurture-close',
    question: 'Are leads going cold without structured follow-up?',
    icon: Mail,
    serviceIds: ['email-marketing', 'lead-generation'],
    blogSlugs: [
      'lead-nurture-lifecycle-email-automation-framework-2025',
      'marketing-strategy-small-business-guide'
    ]
  }
];

export const archetypeById = Object.fromEntries(serviceArchetypes.map(a => [a.id, a]));
