'use client';

import type { SimpleService } from '@/lib/client/serviceTypes';
import { useEffect, useState } from 'react';
import FooterClient from './FooterClient';
import { FooterData } from '@/lib/site-data';

// This is a client component version of Footer that fetches its own data
export default function ClientFooter() {
  const [services, setServices] = useState<SimpleService[]>([]);
  const [footerData, setFooterData] = useState<FooterData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch services
        const servicesResponse = await fetch('/api/services/simple');
        if (!servicesResponse.ok) {
          throw new Error('Failed to fetch services');
        }
        const servicesData = await servicesResponse.json();
        setServices(servicesData);

        // Fetch footer data
        const footerResponse = await fetch('/api/footer');
        if (!footerResponse.ok) {
          throw new Error('Failed to fetch footer data');
        }
        const footerData = await footerResponse.json();
        setFooterData(footerData);
      } catch (error) {
        console.error('Error fetching data:', error);
        // Use empty array as fallback for services
        setServices([]);
        // Use basic defaults for footer data
        setFooterData({
          branding: {
            businessName: "REPLACE Your Business Name",
            tagline: "REPLACE Your Business Tagline",
            description: "REPLACE Your business description. Explain what you do and how you help your clients.",
            logo: "/images/sample-logo.png",
            logoAlt: "REPLACE Your Business Name Logo",
          },
          contact: {
            email: "hello@yourbusiness.com",
            phone: "+1 (555) 123-4567",
            address: "REPLACE Your Business Address\nCity, State ZIP",
          },
          socialLinks: [
            { platform: "LinkedIn", url: "https://linkedin.com/company/your-business", icon: "linkedin" },
          ],
          links: {
            company: [
              { label: "About Us", href: "/about" },
              { label: "Contact", href: "/contact" },
            ],
            legal: [
              { label: "Privacy Policy", href: "/privacy" },
            ],
          },
          copyrightText: "REPLACE Your Business Name. All rights reserved.",
          developer: {
            name: "Your Developer",
            url: "https://yourdev.com",
            show: false,
          },
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading || !footerData) {
    return <div className="bg-neutral-900 py-12">Loading footer...</div>;
  }

  return <FooterClient services={services} footerData={footerData} />;
}
