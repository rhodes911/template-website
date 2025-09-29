'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function NavigationLogo() {
  const [logoError, setLogoError] = useState(false);

  return (
    <Link href="/" className="flex items-center gap-3">
      <Image
        src={logoError ? "/images/ellie-edwards-profile.jpg" : "/images/ellie-edwards-logo.png"}
        alt="Ellie Edwards Marketing Logo"
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
          Ellie Edwards Marketing
        </p>
        <p className="text-sm text-primary-600 font-medium">
          Expert Digital Marketing Solutions
        </p>
      </div>
    </Link>
  );
}
