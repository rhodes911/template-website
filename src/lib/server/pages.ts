import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

export interface ServicesPageData {
  heroTitle: string;
  heroDescription: string;
  heroCtas: {
    primaryLabel: string;
    primaryHref: string;
    secondaryLabel: string;
    secondaryHref: string;
  };
  secondaryLink: {
    label: string;
    href: string;
  };
  pageCta: {
    title: string;
    description: string;
    buttonLabel: string;
    buttonHref: string;
  };
  content: string;
  seo?: {
    metaTitle?: string;
    metaDescription?: string;
    canonicalUrl?: string;
    keywords?: string[];
    noIndex?: boolean;
  };
}

export interface BlogPageData {
  heroTitle: string;
  heroDescription: string;
  heroTagline: string;
  stats: {
    label: string;
  }[];
  content: string;
  seo?: {
    metaTitle?: string;
    metaDescription?: string;
    canonicalUrl?: string;
    keywords?: string[];
    noIndex?: boolean;
  };
}

export interface CaseStudiesPageData {
  heroTitle: string;
  heroDescription: string;
  pageCta: {
    title: string;
    description: string;
    buttonLabel: string;
    buttonHref: string;
  };
  content: string;
  seo?: {
    metaTitle?: string;
    metaDescription?: string;
    canonicalUrl?: string;
    keywords?: string[];
    noIndex?: boolean;
  };
}

export interface ContactPageData {
  heroTitle: string;
  heroSubtitle: string;
  heroDescription: string;
  contactSectionTitle: string;
  contactSectionSubtitle: string;
  contactMethods: {
    icon: string;
    title: string;
    subtitle: string;
    value?: string;
    href: string;
  }[];
  expectations: string[];
  formTitle: string;
  expectationsTitle: string;
  faqs: {
    question: string;
    answer: string;
  }[];
  pageCta: {
    title: string;
    description: string;
    buttonLabel: string;
    buttonHref: string;
  };
  content: string;
  seo?: {
    metaTitle?: string;
    metaDescription?: string;
    canonicalUrl?: string;
    keywords?: string[];
    noIndex?: boolean;
  };
}

export function getServicesPageData(): ServicesPageData {
  try {
    const contentPath = path.join(process.cwd(), 'content', 'services.md');
    const fileContents = fs.readFileSync(contentPath, 'utf8');
    const { data, content } = matter(fileContents);

    return {
      heroTitle: data.heroTitle || "REPLACE Services Page Title",
      heroDescription: data.heroDescription || "REPLACE Services page description. Describe what you offer and how it helps clients.",
      heroCtas: data.heroCtas || {
        primaryLabel: "REPLACE Primary CTA Label",
        primaryHref: "/contact",
        secondaryLabel: "REPLACE Secondary CTA Label",
        secondaryHref: "/case-studies",
      },
      secondaryLink: data.secondaryLink || {
        label: "View Case Studies",
        href: "/case-studies",
      },
      pageCta: data.pageCta || {
        title: "REPLACE Services CTA Title",
        description: "REPLACE Services CTA. Encourage visitors to contact you about your services.",
        buttonLabel: "REPLACE Services CTA Button",
        buttonHref: "/contact",
      },
      content,
      seo: data.seo,
    };
  } catch (error) {
    console.error('Error loading services page data:', error);
    // Return defaults
    return {
      heroTitle: "REPLACE Services Page Title",
      heroDescription: "REPLACE Services page description. Describe what you offer and how it helps clients.",
      heroCtas: {
        primaryLabel: "REPLACE Primary CTA Label",
        primaryHref: "/contact",
        secondaryLabel: "REPLACE Secondary CTA Label",
        secondaryHref: "/case-studies",
      },
      secondaryLink: {
        label: "REPLACE Secondary Link Label",
        href: "/case-studies",
      },
      pageCta: {
        title: "REPLACE Services CTA Title",
        description: "REPLACE Services CTA. Encourage visitors to contact you about your services.",
        buttonLabel: "REPLACE Services CTA Button",
        buttonHref: "/contact",
      },
      content: "",
    };
  }
}

export function getBlogPageData(): BlogPageData {
  try {
    const contentPath = path.join(process.cwd(), 'content', 'blog.md');
    const fileContents = fs.readFileSync(contentPath, 'utf8');
    const { data, content } = matter(fileContents);

    return {
      heroTitle: data.heroTitle || "REPLACE Blog Title",
      heroDescription: data.heroDescription || "REPLACE Blog description. Share insights and expertise with your audience.",
      heroTagline: data.heroTagline || "Marketing Insights",
      stats: data.stats || [
        { label: "Expert Articles" },
        { label: "Weekly Updates" },
        { label: "Real Case Studies" }
      ],
      content,
      seo: data.seo,
    };
  } catch (error) {
    console.error('Error loading blog page data:', error);
    return {
      heroTitle: "REPLACE Blog Title",
      heroDescription: "REPLACE Blog description. Share insights and expertise with your audience.",
      heroTagline: "Marketing Insights",
      stats: [
        { label: "Expert Articles" },
        { label: "Weekly Updates" },
        { label: "Real Case Studies" }
      ],
      content: "",
    };
  }
}

export function getCaseStudiesPageData(): CaseStudiesPageData {
  try {
    const contentPath = path.join(process.cwd(), 'content', 'case-studies.md');
    const fileContents = fs.readFileSync(contentPath, 'utf8');
    const { data, content } = matter(fileContents);

    return {
      heroTitle: data.heroTitle || "REPLACE Case Studies Title",
      heroDescription: data.heroDescription || "REPLACE Case studies description. Show how you've helped clients achieve success.",
      pageCta: data.pageCta || {
        title: "Ready To Achieve Similar Results?",
        description: "REPLACE Case studies CTA. Encourage visitors to contact you.",
        buttonLabel: "Get Started",
        buttonHref: "/contact",
      },
      content,
      seo: data.seo,
    };
  } catch (error) {
    console.error('Error loading case studies page data:', error);
    return {
      heroTitle: "REPLACE Case Studies Title",
      heroDescription: "REPLACE Case studies description. Show how you've helped clients achieve success.",
      pageCta: {
        title: "Ready To Achieve Similar Results?",
        description: "REPLACE Case studies CTA. Encourage visitors to contact you.",
        buttonLabel: "Get Started",
        buttonHref: "/contact",
      },
      content: "",
    };
  }
}

export function getContactPageData(): ContactPageData {
  try {
    const contentPath = path.join(process.cwd(), 'content', 'contact.md');
    const fileContents = fs.readFileSync(contentPath, 'utf8');
    const { data, content } = matter(fileContents);

    return {
      heroTitle: data.heroTitle || "Contact Us",
      heroSubtitle: data.heroSubtitle || "REPLACE Your Contact Subtitle",
      heroDescription: data.heroDescription || "REPLACE Contact page description. Encourage visitors to get in touch.",
      contactSectionTitle: data.contactSectionTitle || "Let's Start the Conversation",
      contactSectionSubtitle: data.contactSectionSubtitle || "REPLACE Contact Section Subtitle",
      contactMethods: data.contactMethods || [],
      expectations: data.expectations || [],
      formTitle: data.formTitle || "Send Me a Message",
      expectationsTitle: data.expectationsTitle || "What to Expect",
      faqs: data.faqs || [],
      pageCta: data.pageCta || {
        title: "REPLACE Contact CTA Title",
        description: "REPLACE Contact CTA description",
        buttonLabel: "REPLACE Contact CTA Button",
        buttonHref: "#contact-form"
      },
      content,
      seo: data.seo,
    };
  } catch (error) {
    console.error('Error loading contact page data:', error);
    return {
      heroTitle: "Contact Us",
      heroSubtitle: "REPLACE Your Contact Subtitle", 
      heroDescription: "REPLACE Contact page description. Encourage visitors to get in touch.",
      contactSectionTitle: "Let's Start the Conversation",
      contactSectionSubtitle: "REPLACE Contact Section Subtitle",
      contactMethods: [],
      expectations: [],
      formTitle: "Send Me a Message",
      expectationsTitle: "What to Expect",
      faqs: [],
      pageCta: {
        title: "REPLACE Contact CTA Title",
        description: "REPLACE Contact CTA description",
        buttonLabel: "REPLACE Contact CTA Button",
        buttonHref: "#contact-form"
      },
      content: "",
    };
  }
}