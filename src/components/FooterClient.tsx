'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface SimpleService {
  id: string;
  title: string;
  description: string;
  icon: string;
}

interface FooterClientProps {
  services: SimpleService[];
}

const FooterClient = ({ services }: FooterClientProps) => {
  const [logoError, setLogoError] = useState(false);

  return (
    <footer className="bg-white text-neutral-900 py-16 lg:py-20 border-t border-neutral-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-12 lg:gap-16">
          <div>
            <div className="flex items-center gap-4 mb-6">
              <Image
                src={logoError ? "/images/ellie-edwards-profile.jpg" : "/images/ellie-edwards-logo.png"}
                alt="Ellie Edwards Marketing Logo"
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
                  Ellie Edwards Marketing
                </h3>
                <p className="text-primary-600 font-semibold">
                  Strategic Marketing Solutions
                </p>
              </div>
            </div>
            <p className="text-lg text-neutral-600 leading-relaxed">
              Helping entrepreneurs and personal brands grow through smart campaigns, 
              bold design, and a people-first approach to digital marketing.
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
              <li>
                <Link href="/about" className="hover:text-primary-600 transition-colors cursor-pointer">
                  About Ellie
                </Link>
              </li>
              <li>
                <Link href="/case-studies" className="hover:text-primary-600 transition-colors cursor-pointer">
                  Case Studies
                </Link>
              </li>
              <li>
                <Link href="/blog" className="hover:text-primary-600 transition-colors cursor-pointer">
                  Marketing Blog
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-primary-600 transition-colors cursor-pointer">
                  FAQ
                </Link>
              </li>
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
              <li key="email">
                <a
                  href="mailto:ellieedwardsmarketing@gmail.com"
                  className="inline-flex items-center gap-2 hover:text-primary-600 transition-colors cursor-pointer"
                >
                  <span className="inline-flex items-center justify-center w-7 h-7 rounded-md bg-neutral-100 text-neutral-600">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4-8 5-8-5V6l8 5 8-5v2z"/></svg>
                  </span>
                  <span>ellieedwardsmarketing@gmail.com</span>
                </a>
              </li>
              <li key="linkedin">
                <a
                  href="https://www.linkedin.com/in/ellie-edwards-marketing/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 hover:text-primary-600 transition-colors cursor-pointer"
                >
                  <span className="inline-flex items-center justify-center w-7 h-7 rounded-md bg-neutral-100 text-neutral-600">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                  </span>
                  <span>LinkedIn</span>
                </a>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-neutral-200 mt-12 pt-8 text-center text-neutral-600">
          <p className="text-lg">&copy; 2025 Ellie Edwards Marketing. All rights reserved.</p>
          <p className="mt-3 text-base">
            Developed by <a href="https://linkedin.com/in/jamie-rhodes-444860234" className="text-primary-600 hover:text-primary-700 transition-colors">Jamie Rhodes</a>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default FooterClient;
