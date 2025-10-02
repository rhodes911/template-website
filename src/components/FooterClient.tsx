'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FooterData } from '@/lib/site-data';

interface SimpleService {
  id: string;
  title: string;
  description: string;
  icon: string;
}

interface FooterClientProps {
  services: SimpleService[];
  footerData: FooterData;
}

const FooterClient = ({ services, footerData }: FooterClientProps) => {
  const [logoError, setLogoError] = useState(false);

  return (
    <footer className="bg-white text-neutral-900 py-16 lg:py-20 border-t border-neutral-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-12 lg:gap-16">
          <div>
            <div className="flex items-center gap-4 mb-6">
              <Image
                src={logoError ? "/images/sample-profile.jpg" : footerData.branding.logo}
                alt={footerData.branding.logoAlt}
                width={56}
                height={56}
                className="w-12 h-12 sm:w-14 sm:h-14 rounded-lg shadow-md object-cover border-2 border-neutral-200"
                style={{ 
                  backgroundColor: '#1f2937', 
                  padding: '4px'
                }}
                loading="lazy"
                onError={() => setLogoError(true)}
              />
              <div>
                <h3 className="text-xl sm:text-2xl font-heading font-bold text-neutral-900">
                  {footerData.branding.businessName}
                </h3>
                <p className="text-primary-600 font-semibold">
                  {footerData.branding.tagline}
                </p>
              </div>
            </div>
            <p className="text-lg text-neutral-600 leading-relaxed">
              {footerData.branding.description}
            </p>
          </div>
          
          <div>
            <h4 className="text-xl font-semibold mb-6 text-primary-600">Services</h4>
            <ul className="space-y-3 text-lg text-neutral-600">
              {services.map((service) => (
                <li key={service.id}>
                  <Link 
                    href={`/services/${service.id}`} 
                    className="hover:text-primary-600 transition-colors cursor-pointer"
                  >
                    {service.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-xl font-semibold mb-6 text-primary-600">Company</h4>
            <ul className="space-y-3 text-lg text-neutral-600">
              {footerData.links.company.map((link, index) => (
                <li key={index}>
                  <Link href={link.href} className="hover:text-primary-600 transition-colors cursor-pointer">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h4 className="text-xl font-semibold mb-6 text-primary-600">Contact</h4>
            <ul className="space-y-3 text-lg text-neutral-600">
              <li>
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 hover:text-primary-600 transition-colors cursor-pointer"
                >
                  <span className="inline-flex items-center justify-center w-7 h-7 rounded-md bg-neutral-100 text-neutral-600">
                    {/* Chat bubble icon */}
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                      <path d="M20 2H4a2 2 0 0 0-2 2v17l4-4h14a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2Zm-3 9H7a1 1 0 0 1 0-2h10a1 1 0 0 1 0 2Zm-4 4H7a1 1 0 0 1 0-2h6a1 1 0 0 1 0 2Zm4-8H7a1 1 0 0 1 0-2h10a1 1 0 0 1 0 2Z"/>
                    </svg>
                  </span>
                  <span>Get in Touch</span>
                </Link>
              </li>
              {footerData.contact.email && (
                <li>
                  <a
                    href={`mailto:${footerData.contact.email}`}
                    className="inline-flex items-center gap-2 hover:text-primary-600 transition-colors cursor-pointer"
                  >
                    <span className="inline-flex items-center justify-center w-7 h-7 rounded-md bg-neutral-100 text-neutral-600">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4-8 5-8-5V6l8 5 8-5v2z"/></svg>
                    </span>
                    <span>{footerData.contact.email}</span>
                  </a>
                </li>
              )}
              {footerData.contact.phone && (
                <li>
                  <a
                    href={`tel:${footerData.contact.phone}`}
                    className="inline-flex items-center gap-2 hover:text-primary-600 transition-colors cursor-pointer"
                  >
                    <span className="inline-flex items-center justify-center w-7 h-7 rounded-md bg-neutral-100 text-neutral-600">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/></svg>
                    </span>
                    <span>{footerData.contact.phone}</span>
                  </a>
                </li>
              )}
              {footerData.socialLinks.map((social, index) => (
                <li key={index}>
                  <a
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 hover:text-primary-600 transition-colors cursor-pointer"
                  >
                    <span className="inline-flex items-center justify-center w-7 h-7 rounded-md bg-neutral-100 text-neutral-600">
                      {/* Generic social icon - you could create a component to handle different icons */}
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c5.05-.5 9-4.76 9-9.95z"/>
                      </svg>
                    </span>
                    <span>{social.platform}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
        
        <div className="border-t border-neutral-200 mt-12 pt-8 text-center text-neutral-600">
          <p className="text-lg">&copy; {new Date().getFullYear()} {footerData.copyrightText}</p>
          {footerData.developer && footerData.developer.show && (
            <p className="mt-3 text-base">
              Developed by <a href={footerData.developer.url} className="text-primary-600 hover:text-primary-700 transition-colors">{footerData.developer.name}</a>
            </p>
          )}
        </div>
      </div>
    </footer>
  );
};

export default FooterClient;
