'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { HeaderData } from '@/lib/site-data';

interface NavigationLogoProps {
  headerData?: HeaderData;
}

export default function NavigationLogo({ headerData }: NavigationLogoProps) {
  const [logoError, setLogoError] = useState(false);

  // Use default values if headerData is not provided
  const branding = headerData?.branding || {
    businessName: "REPLACE Your Business Name",
    tagline: "REPLACE Your Business Tagline",
    logo: "/images/sample-logo.png",
    logoAlt: "REPLACE Your Business Name Logo",
  };

  return (
    <Link href="/" className="flex items-center gap-3">
      <Image
        src={logoError ? "/images/sample-profile.jpg" : branding.logo}
        alt={branding.logoAlt}
        width={56}
        height={56}
        className="w-12 h-12 sm:w-14 sm:h-14 rounded-lg shadow-md object-cover"
        style={{ 
          backgroundColor: '#1f2937', 
          border: '2px solid #e5e5e5',
          padding: '2px'
        }}
        onError={() => setLogoError(true)}
      />
      <div>
        <p className="text-xl sm:text-2xl font-heading font-bold text-neutral-900">
          {branding.businessName}
        </p>
        <p className="text-sm text-primary-600 font-medium">
          {branding.tagline}
        </p>
      </div>
    </Link>
  );
}
