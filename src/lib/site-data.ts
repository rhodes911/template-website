import fs from 'fs';
import path from 'path';

export interface HeaderData {
  branding: {
    businessName: string;
    tagline: string;
    logo: string;
    logoAlt: string;
  };
  navigation: Array<{
    label: string;
    href: string;
    external: boolean;
  }>;
  ctaButton: {
    label: string;
    href: string;
    enabled: boolean;
  };
  search: {
    enabled: boolean;
    placeholder: string;
  };
}

export interface FooterData {
  branding: {
    businessName: string;
    tagline: string;
    description: string;
    logo: string;
    logoAlt: string;
  };
  contact: {
    email: string;
    phone: string;
    address: string;
  };
  socialLinks: Array<{
    platform: string;
    url: string;
    icon: string;
  }>;
  links: {
    company: Array<{
      label: string;
      href: string;
    }>;
    legal: Array<{
      label: string;
      href: string;
    }>;
  };
  copyrightText: string;
  developer: {
    name: string;
    url: string;
    show: boolean;
  };
}

export function getHeaderData(): HeaderData {
  try {
    const headerPath = path.join(process.cwd(), 'content', 'settings', 'header.json');
    const headerContent = fs.readFileSync(headerPath, 'utf8');
    return JSON.parse(headerContent);
  } catch (error) {
    console.warn('Could not load header data, using defaults:', error);
    return {
      branding: {
        businessName: "REPLACE Your Business Name",
        tagline: "REPLACE Your Business Tagline",
        logo: "/images/REPLACE-your-logo.png",
        logoAlt: "REPLACE Your Business Name Logo",
      },
      navigation: [
        { label: "About", href: "/about", external: false },
        { label: "Blog", href: "/blog", external: false },
        { label: "Case Studies", href: "/case-studies", external: false },
        { label: "FAQ", href: "/faq", external: false },
        { label: "Contact", href: "/contact", external: false },
      ],
      ctaButton: {
        label: "Get Started",
        href: "/contact",
        enabled: true,
      },
      search: {
        enabled: true,
        placeholder: "Search",
      },
    };
  }
}

export function getFooterData(): FooterData {
  try {
    const footerPath = path.join(process.cwd(), 'content', 'settings', 'footer.json');
    const footerContent = fs.readFileSync(footerPath, 'utf8');
    return JSON.parse(footerContent);
  } catch (error) {
    console.warn('Could not load footer data, using defaults:', error);
    return {
      branding: {
        businessName: "REPLACE Your Business Name",
        tagline: "REPLACE Your Business Tagline",
        description: "REPLACE Your business description. Explain what you do and how you help your clients.",
        logo: "/images/REPLACE-your-logo.png",
        logoAlt: "REPLACE Your Business Name Logo",
      },
      contact: {
        email: "hello@yourbusiness.com",
        phone: "+1 (555) 123-4567",
        address: "REPLACE Your Business Address\nCity, State ZIP",
      },
      socialLinks: [
        { platform: "LinkedIn", url: "https://linkedin.com/company/your-business", icon: "linkedin" },
        { platform: "Twitter", url: "https://twitter.com/yourbusiness", icon: "twitter" },
        { platform: "Facebook", url: "https://facebook.com/yourbusiness", icon: "facebook" },
      ],
      links: {
        company: [
          { label: "About Us", href: "/about" },
          { label: "Case Studies", href: "/case-studies" },
          { label: "Blog", href: "/blog" },
          { label: "FAQ", href: "/faq" },
        ],
        legal: [
          { label: "Privacy Policy", href: "/privacy" },
          { label: "Terms of Service", href: "/terms" },
        ],
      },
      copyrightText: "REPLACE Your Business Name. All rights reserved.",
      developer: {
        name: "Your Developer",
        url: "https://yourdev.com",
        show: false,
      },
    };
  }
}