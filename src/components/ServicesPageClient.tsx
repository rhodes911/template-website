"use client";

import { ArrowRight, Star, Target, TrendingUp, Megaphone, Search, MousePointer, PenTool, Globe, Share2, Mail, Users, Database, Settings } from 'lucide-react';
import Link from 'next/link';
import { useMemo } from 'react';
import type { EnrichedServicePageData, ServicePageData } from '@/lib/client/serviceTypes';
import { themeStyles } from '@/lib/theme';


// Re-introduced icon map for service cards
const iconMap: { [key: string]: React.ComponentType<{ className?: string }> } = {
  Target,
  TrendingUp,
  Megaphone,
  Search,
  MousePointer,
  PenTool,
  Globe,
  Share2,
  Mail,
  Users,
  Database,
  Settings,
};

type ServiceCardData = ServicePageData & Partial<EnrichedServicePageData>;

const ServiceCard = ({ service, index }: { service: ServiceCardData; index: number }) => {
  const IconComponent = iconMap[service.icon] || Target;
  
  return (
    <Link href={service.href} className="block h-full">
      <div className={`
        group ${themeStyles.cards.default} ${themeStyles.cards.hover} ${themeStyles.cards.interactive}
        flex flex-col h-full
        ${index % 2 === 0 ? 'hover:bg-gradient-to-br hover:from-primary-50/30 hover:to-white' : 'hover:bg-gradient-to-br hover:from-neutral-50/50 hover:to-white'}
      `}>
        <div className="p-6 sm:p-8 flex flex-col h-full">
          {/* Header with Icon + Title (icons restored) */}
          <div className="flex items-start gap-4 mb-4">
            <div className={`${themeStyles.icons.medium} group-hover:scale-110 transition-transform duration-300`}>
              <IconComponent className="w-8 h-8 text-white" />
            </div>
            <div className="flex-1">
              <h3 className={`${themeStyles.text.h4} group-hover:text-primary-700 transition-colors duration-300`}>
                {service.title}
              </h3>
            </div>
          </div>

          {/* (Outcome badges removed per revision — keeping card cleaner) */}
          
          {/* Description */}
          <p className="text-neutral-600 group-hover:text-neutral-700 mb-6 font-medium transition-colors duration-300 leading-relaxed">
            {service.description}
          </p>
          
          {/* Features */}
          <div className="mb-6 flex-grow">
            <h4 className="text-sm font-bold text-neutral-900 mb-3 flex items-center gap-2">
              <span className="w-2 h-2 bg-primary-500 rounded-full"></span>
              What&apos;s Included:
            </h4>
            <ul className="space-y-2 mb-2">
              {service.features.slice(0,4).map((f: string, i: number) => (
                <li key={i} className="flex items-start gap-2 text-sm text-neutral-600 group-hover:text-neutral-700">
                  <span className="mt-1 w-1.5 h-1.5 rounded-full bg-primary-500/80 flex-shrink-0" />
                  <span>{f}</span>
                </li>
              ))}
            </ul>
          </div>
          
          {/* CTA */}
          <div className="flex items-center justify-between pt-4 border-t border-neutral-100 mt-auto">
            <span className="text-sm font-semibold text-neutral-700 group-hover:text-primary-700 transition-colors duration-300">
              Learn More & Get Started
            </span>
            <div className="w-8 h-8 bg-primary-100 group-hover:bg-primary-600 rounded-full flex items-center justify-center transition-all duration-300 shadow-sm group-hover:shadow-md">
              <ArrowRight className="w-4 h-4 text-primary-600 group-hover:text-white transition-colors duration-300" />
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

interface ServicesPageClientProps {
  services: (ServicePageData & Partial<EnrichedServicePageData>)[];
}

export default function ServicesPageClient({ services }: ServicesPageClientProps) {
  // Simple: show all services in a clean grid
  const displayServices = useMemo(() => services, [services]);

  return (
    <div className={`min-h-screen ${themeStyles.backgrounds.page}`}>
      
      {/* Hero Section */}
      <section className={`pt-24 pb-16 ${themeStyles.backgrounds.hero} relative overflow-hidden`}>
        {/* Background decorative elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-20 -left-20 w-60 h-60 sm:w-80 sm:h-80 bg-gradient-to-br from-primary-200/20 to-primary-400/10 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 -right-20 w-40 h-40 sm:w-60 sm:h-60 bg-gradient-to-tr from-neutral-200/30 to-neutral-400/10 rounded-full blur-2xl"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-12">
            <h1 className={`${themeStyles.text.h1} mb-6`}>
              <span className="bg-gradient-to-r from-primary-600 to-primary-500 bg-clip-text text-transparent">
                Marketing Services
              </span>{' '}
              <span className="text-neutral-900">That Drive Results</span>
            </h1>
            <p className={`${themeStyles.text.bodyLarge} max-w-3xl mx-auto`}>
              Comprehensive digital marketing solutions designed to grow your business, 
              increase your revenue, and establish your brand as an industry leader.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/contact"
              className={`${themeStyles.buttons.primary} transform hover:scale-105 shadow-lg`}
            >
              Get Your Free Consultation
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
            <Link 
              href="/case-studies"
              className={`${themeStyles.buttons.secondary}`}
            >
              <Star className="mr-2 w-5 h-5" />
              View Success Stories
            </Link>
          </div>
        </div>
      </section>

  {/* Archetype Question Selector moved below grid intro */}

      {/* Services Grid */}
  <section className="py-16 sm:py-20 lg:py-28" aria-labelledby="services-grid-heading">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 id="services-grid-heading" className={`${themeStyles.text.h2} mb-6`}>
              Our Services
            </h2>
            <p className={`${themeStyles.text.bodyLarge} max-w-3xl mx-auto`}>
              Clear, effective marketing services to help you grow—easy to scan and simple to get started.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {displayServices.map((service, index) => (
              <ServiceCard key={service.id} service={service} index={index} />
            ))}
            {displayServices.length === 0 && (
              <div className="col-span-full text-center py-12 border border-dashed rounded-xl">
                <p className="text-neutral-600 mb-2">No services available yet.</p>
                <Link href="/contact" className="inline-flex items-center gap-2 text-sm font-semibold text-primary-700 hover:text-primary-800">Get in touch <ArrowRight className="w-4 h-4"/></Link>
              </div>
            )}
          </div>
        </div>
      </section>

    {/* CTA Section */}
  <section className="py-16 sm:py-20 bg-gradient-to-r from-primary-600 to-primary-500 relative overflow-hidden" aria-labelledby="cta-heading">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary-600/90 to-primary-500/90"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 sm:p-12 border border-white/20">
            <h5 id="cta-heading" className={`${themeStyles.text.h4} text-white mb-6`}>
              Ready to Transform Your Business?
            </h5>
            <p className="text-lg sm:text-xl text-white/90 mb-8 max-w-3xl mx-auto leading-relaxed">
              Let&apos;s discuss which services align best with your goals and create a customized 
              strategy that delivers real results for your business.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/contact"
                className="inline-flex items-center justify-center px-8 py-4 bg-white text-primary-600 rounded-lg hover:bg-neutral-50 transition-all duration-300 transform hover:scale-105 shadow-lg font-semibold"
              >
                Get Free Consultation
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
              <Link 
                href="/case-studies"
                className="inline-flex items-center justify-center px-8 py-4 border-2 border-white text-white rounded-lg hover:bg-white hover:text-primary-600 transition-all duration-300 font-semibold"
              >
                <Star className="mr-2 w-5 h-5" />
                View Success Stories
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
