'use client';

import React, { useEffect } from 'react';
import { CheckCircle, Star, Calendar, Clock, ArrowRight } from 'lucide-react';
import * as Icons from 'lucide-react';
import Link from 'next/link';
import Breadcrumbs from '@/components/Breadcrumbs';
import { FAQSectionWithHeadingLevel } from '@/components/FAQSectionWithHeadingLevel';
import type { Service } from '@/lib/client/serviceTypes';
import ReactMarkdown from 'react-markdown';
import ServiceRecommendations from '@/components/ServiceRecommendations';

interface RelatedServiceLink { id: string; title: string; href: string }
interface ServicePageProps {
  service: Service;
  relatedServices?: RelatedServiceLink[];
}

export default function ServicePage({ service, relatedServices = [] }: ServicePageProps) {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Get icon component from string name
  const getIconComponent = (iconName: string) => {
    return (Icons as unknown as Record<string, React.ComponentType<{ className?: string }>>)[iconName] || Icons.Target;
  };

  const ServiceIcon = getIconComponent(service.icon);

  return (
    <div className="min-h-screen bg-neutral-50">
        <div className="max-w-4xl mx-auto px-4 pt-6">
          <Breadcrumbs
            items={[
              { label: 'Home', href: '/' },
              { label: 'Services', href: '/services' },
              { label: service.title },
            ]}
          />
        </div>

        {/* Hero Section */}
        <div className="bg-white border-b border-neutral-200">
          <div className="max-w-4xl mx-auto px-4 py-16 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-50 text-primary-600 rounded-full text-sm font-semibold mb-6">
              <ServiceIcon className="w-4 h-4" />
              {service.subtitle}
            </div>
            
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-bold text-neutral-900 mb-6">
              {service.heroTitle}{' '}
              <span className="bg-gradient-to-r from-primary-600 to-primary-500 bg-clip-text text-transparent">
                {service.heroSubtitle}
              </span>
            </h1>
            
            <p className="text-lg sm:text-xl text-neutral-600 mb-8 leading-relaxed max-w-2xl mx-auto">
              {service.heroDescription}
            </p>
            
            {/* (Removed subtle scroll indicator per request) */}
          </div>
        </div>

        {/* Service Content Section */}
        {service.content && (
          <div className="max-w-4xl mx-auto px-4 py-16">
            <div className="bg-white rounded-2xl shadow-sm border border-neutral-200 overflow-hidden">
              <div className="p-6 md:p-12">
                {/* Primary section H2 placed inside the content card for stronger hierarchy */}
                <h2 className="text-2xl md:text-3xl font-bold mb-6 text-center">
                  <span className="bg-gradient-to-r from-primary-600 to-primary-500 bg-clip-text text-transparent">
                    {service.title} Overview
                  </span>
                </h2>
                <div className="markdown-content prose prose-lg prose-neutral max-w-none">
                  {/* Remap Markdown headings to avoid additional H1/H2 from content */}
                  <ReactMarkdown
                    components={{
                      h1: (props) => <h3 {...props} />,
                      h2: (props) => <h3 {...props} />,
                      h3: (props) => <h4 {...props} />,
                      h4: (props) => <h5 {...props} />,
                      h5: (props) => <h6 {...props} />,
                      h6: (props) => <h6 {...props} />,
                    }}
                  >
                    {service.content}
                  </ReactMarkdown>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* What You'll Get Section */}
        <div className="bg-gradient-to-br from-primary-50 to-primary-100/50 py-16">
          <div className="max-w-4xl mx-auto px-4">
            <div className="text-center mb-12">
              <h3 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-4">
                What You&apos;ll Get
              </h3>
              <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
                Everything included in your {service.title.toLowerCase()} package
              </p>
            </div>
            
            <div className="bg-white rounded-2xl shadow-sm border border-neutral-200 p-8">
              <ul className="grid sm:grid-cols-2 gap-4">
                {service.whatYouGet.map((item, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-primary-600 flex-shrink-0 mt-0.5" />
                    <span className="text-neutral-700">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="max-w-7xl mx-auto px-4 py-20">
          <div className="text-center mb-16">
            <h3 className="text-4xl md:text-5xl font-bold text-neutral-900 mb-6">
              Complete {service.title}{' '}
              <span className="bg-gradient-to-r from-primary-600 to-primary-500 bg-clip-text text-transparent">
                Solution
              </span>
            </h3>
            <p className="text-xl text-neutral-600 max-w-2xl mx-auto leading-relaxed">
              Every aspect of your {service.title.toLowerCase()} strategy is carefully planned and executed to deliver 
              maximum impact and sustainable business growth.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {service.features.map((feature, index) => {
              const FeatureIcon = getIconComponent(feature.icon);
              return (
                <div key={index} className="bg-white rounded-2xl shadow-lg border border-neutral-100 p-8 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                  <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl flex items-center justify-center shadow-lg mb-6">
                    <FeatureIcon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-neutral-900 mb-4">{feature.title}</h3>
                  <p className="text-neutral-600 leading-relaxed">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Process Section */}
        <div className="bg-gradient-to-br from-neutral-50 to-white py-20">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-16">
              <h3 className="text-4xl md:text-5xl font-bold text-neutral-900 mb-6">
                Our {service.title}{' '}
                <span className="bg-gradient-to-r from-primary-600 to-primary-500 bg-clip-text text-transparent">
                  Process
                </span>
              </h3>
              <p className="text-xl text-neutral-600 max-w-2xl mx-auto leading-relaxed">
                A proven methodology that ensures your {service.title.toLowerCase()} delivers results from day one.
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {service.process.map((step, index) => (
                <div key={index} className="relative">
                  <div className="bg-white rounded-2xl shadow-lg border border-neutral-100 p-8 h-full">
                    <div className="text-4xl font-bold bg-gradient-to-r from-primary-600 to-primary-500 bg-clip-text text-transparent mb-4">
                      {step.step}
                    </div>
                    <h3 className="text-xl font-bold text-neutral-900 mb-4">{step.title}</h3>
                    <p className="text-neutral-600 mb-4 leading-relaxed">{step.description}</p>
                    <div className="flex items-center gap-2 text-sm text-primary-600 font-medium">
                      <Clock className="w-4 h-4" />
                      {step.duration}
                    </div>
                  </div>
                  {index < service.process.length - 1 && (
                    <div className="hidden lg:block absolute top-1/2 -right-4 w-8 h-px bg-gradient-to-r from-primary-300 to-primary-500"></div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Results Section */}
        <div className="max-w-7xl mx-auto px-4 py-20">
          <div className="bg-gradient-to-br from-primary-50 to-primary-100/50 rounded-3xl p-12 text-center">
            <h3 className="text-4xl md:text-5xl font-bold text-neutral-900 mb-8">
              Results You Can{' '}
              <span className="bg-gradient-to-r from-primary-600 to-primary-500 bg-clip-text text-transparent">
                Expect
              </span>
            </h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto">
              {service.results.map((result, index) => (
                <div key={index} className="bg-white rounded-xl p-6 shadow-lg border border-primary-100">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center">
                      <CheckCircle className="w-5 h-5 text-white" />
                    </div>
                    <span className="font-semibold text-neutral-900">{result}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Thematic Recommended Reading based on this service */}
        <ServiceRecommendations serviceId={service.id} />

        {/* FAQ Section (demote to H3 to keep only one H2 on page) */}
        <FAQSectionWithHeadingLevel 
          title="Frequently Asked Questions"
          headingLevel="h3"
          faqs={service.faqs}
        />

        {/* Related Services (Internal Outlinks) */}
        {relatedServices.length > 0 && (
          <div className="max-w-7xl mx-auto px-4 py-12">
            <div className="bg-white rounded-2xl shadow-sm border border-neutral-200 p-8">
              <h3 className="text-2xl font-bold text-neutral-900 mb-6">Related Services</h3>
              <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {relatedServices.map((s) => (
                  <li key={s.id}>
                    <Link href={s.href} className="inline-flex items-center gap-2 text-primary-700 hover:text-primary-800 font-medium">
                      <span className="w-1.5 h-1.5 bg-primary-500 rounded-full"></span>
                      {s.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

  {/* CTA Section - After user has read everything */}
        <div className="bg-gradient-to-br from-primary-600 via-primary-500 to-primary-700 py-20">
          <div className="max-w-4xl mx-auto text-center px-4">
            <h3 className="text-3xl md:text-4xl font-bold text-white mb-6">
              {service.ctaTitle}
            </h3>
            <p className="text-xl text-white/90 mb-10 leading-relaxed">
              {service.ctaDescription}
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href={`mailto:REPLACE-your-email@domain.com?subject=${encodeURIComponent(service.emailSubject + ' - Project Inquiry')}&body=${encodeURIComponent(service.emailBody.replace('consultation', 'project').replace('Could we schedule a consultation', 'I would like to schedule a consultation'))}`}
                className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold bg-white text-primary-600 hover:bg-neutral-50 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                <Calendar className="w-5 h-5 mr-2" />
                Schedule Free Consultation
              </a>
              <Link 
                href="/case-studies"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 text-lg font-semibold bg-white/10 backdrop-blur-sm text-white hover:bg-white/20 rounded-lg transition-all duration-300 border border-white/20"
              >
                <Star className="w-5 h-5" />
                View Success Stories
              </Link>
              <Link 
                href="/services"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 text-lg font-semibold bg-white/10 backdrop-blur-sm text-white hover:bg-white/20 rounded-lg transition-all duration-300 border border-white/20"
              >
                <ArrowRight className="w-5 h-5 rotate-180" />
                Back to Services
              </Link>
            </div>
          </div>
        </div>
      </div>
  );
}
