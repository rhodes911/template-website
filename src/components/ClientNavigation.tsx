'use client';

import { useEffect, useState } from 'react';
import NavigationClient from './NavigationClient';
import NavigationLogo from './NavigationLogo';
import { HeaderData } from '@/lib/site-data';
import { SimpleService } from '@/lib/server/services';

// This is a client component version of Navigation that fetches its own data
export default function ClientNavigation() {
  const [headerData, setHeaderData] = useState<HeaderData | null>(null);
  const [services, setServices] = useState<SimpleService[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch header data
        const headerResponse = await fetch('/api/header');
        if (!headerResponse.ok) {
          throw new Error('Failed to fetch header data');
        }
        const headerData = await headerResponse.json();
        setHeaderData(headerData);

        // Fetch services
        const servicesResponse = await fetch('/api/navigation/services');
        if (!servicesResponse.ok) {
          throw new Error('Failed to fetch services');
        }
        const servicesData = await servicesResponse.json();
        setServices(servicesData);
      } catch (error) {
        console.error('Error fetching navigation data:', error);
        // Use defaults
        setHeaderData({
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
        });
        setServices([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading || !headerData) {
    return <div className="bg-white shadow-sm py-4">Loading navigation...</div>;
  }

  return (
    <NavigationClient 
      logo={<NavigationLogo headerData={headerData} />}
      headerData={headerData}
      services={services}
    />
  );
}