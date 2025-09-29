'use client'

import { useState } from 'react';
import { ArrowRight } from 'lucide-react';

interface FAQItem {
  question: string;
  answer: string;
}

interface FAQSectionProps {
  title?: string;
  subtitle?: string;
  faqs: FAQItem[];
  className?: string;
  headingLevel?: 'h2' | 'h3' | 'h4';
}

export function FAQSectionWithHeadingLevel({ 
  title = "Frequently Asked Questions",
  subtitle,
  faqs,
  className = "",
  headingLevel = 'h2'
}: FAQSectionProps) {
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  
  const HeadingTag = headingLevel as keyof JSX.IntrinsicElements;

  return (
    <section className={`bg-gradient-to-br from-neutral-50 to-white py-16 ${className}`}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <HeadingTag className="text-3xl md:text-4xl font-bold text-neutral-900 mb-4">
            {title.includes('Questions') ? (
              <>
                {title.split('Questions')[0]}
                <span className="bg-gradient-to-r from-primary-600 to-primary-500 bg-clip-text text-transparent">
                  Questions
                </span>
              </>
            ) : (
              <span className="bg-gradient-to-r from-primary-600 to-primary-500 bg-clip-text text-transparent">
                {title}
              </span>
            )}
          </HeadingTag>
          {subtitle && (
            <p className="text-lg text-neutral-600">{subtitle}</p>
          )}
        </div>
        
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div key={index} className="bg-white rounded-2xl shadow-lg border border-neutral-100 overflow-hidden hover:shadow-xl transition-all duration-300">
              <button
                className="w-full p-6 text-left hover:bg-neutral-50 transition-colors duration-200"
                onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
              >
                <div className="flex items-center justify-between">
                  {headingLevel === 'h2' ? (
                    <h3 className="text-lg font-semibold text-neutral-900 pr-4">{faq.question}</h3>
                  ) : headingLevel === 'h3' ? (
                    <h4 className="text-lg font-semibold text-neutral-900 pr-4">{faq.question}</h4>
                  ) : (
                    <h5 className="text-lg font-semibold text-neutral-900 pr-4">{faq.question}</h5>
                  )}
                  <div className={`transform transition-transform duration-200 flex-shrink-0 ${expandedFaq === index ? 'rotate-90' : ''}`}>
                    <ArrowRight className="w-5 h-5 text-primary-600" />
                  </div>
                </div>
              </button>
              {expandedFaq === index && (
                <div className="px-6 pb-6">
                  <div className="border-t border-neutral-100 pt-4">
                    <p className="text-neutral-600 leading-relaxed">{faq.answer}</p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}