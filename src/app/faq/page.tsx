import { Metadata } from 'next';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { FAQSection } from '@/components/FAQSection';
import { getPageSeo, buildMetadataFromSeo } from '@/lib/pageSeo';
import { getMainPageData } from '@/tina/queries/mainPages';

const faqSeo = getPageSeo('faq')
export const metadata: Metadata = buildMetadataFromSeo(
  { 
    slug: 'faq', 
    pageType: 'faq'
  }, 
  faqSeo
)

export default function FAQPage() {
  const page = getMainPageData('faq', {
    heroTitle: 'Frequently Asked Questions',
    heroDescription: 'Get answers to common questions about working with me as your marketing consultant. Can’t find what you’re looking for? Feel free to get in touch!',
  });
  const generalFAQs = page.faqs && page.faqs.length > 0 ? page.faqs : [
    { question: 'REPLACE your FAQ question?', answer: 'REPLACE your answer with business-specific information that differentiates your approach and provides value to potential clients.' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-primary-50/10 to-neutral-50/30">
      <Navigation />
      
      {/* Hero Section */}
      <section className="pt-24 pb-16 bg-gradient-to-br from-primary-50/30 via-white to-neutral-50/50 relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-20 -left-20 w-60 h-60 sm:w-80 sm:h-80 bg-gradient-to-br from-primary-200/20 to-primary-400/10 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 -right-20 w-40 h-40 sm:w-60 sm:h-60 bg-gradient-to-tr from-neutral-200/30 to-neutral-400/10 rounded-full blur-2xl"></div>
        </div>
        
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <h1 className="text-4xl lg:text-5xl font-bold text-neutral-900 mb-6">
            {page.heroTitle || (
              <>
                Frequently Asked <span className="block text-primary-600">Questions</span>
              </>
            )}
          </h1>
          {page.heroDescription && (
            <p className="text-xl text-neutral-600 mb-8 leading-relaxed max-w-3xl mx-auto">{page.heroDescription}</p>
          )}
        </div>
      </section>

      {/* FAQ Section */}
      <FAQSection 
        title="General Questions"
        subtitle="Everything you need to know about working together"
        faqs={generalFAQs}
        className="py-0"
      />

      {/* Service-Specific FAQ Callout */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h3 className="text-3xl font-bold text-neutral-900 mb-4">
            Have Service-Specific Questions?
          </h3>
          <p className="text-lg text-neutral-600 mb-8">
            Each service page has detailed FAQs specific to that offering.
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            <a 
              href="/services/brand-strategy" 
              className="p-4 bg-gradient-to-br from-primary-50/50 to-neutral-50/50 border border-neutral-200 rounded-xl hover:shadow-lg transition-all duration-300 text-left"
            >
              <h3 className="font-semibold text-neutral-900 mb-2">Brand Strategy</h3>
              <p className="text-sm text-neutral-600">Brand positioning, messaging, and identity questions</p>
            </a>
            <a 
              href="/services/content-marketing" 
              className="p-4 bg-gradient-to-br from-primary-50/50 to-neutral-50/50 border border-neutral-200 rounded-xl hover:shadow-lg transition-all duration-300 text-left"
            >
              <h3 className="font-semibold text-neutral-900 mb-2">Content Marketing</h3>
              <p className="text-sm text-neutral-600">Content strategy and creation FAQs</p>
            </a>
            <a 
              href="/services/digital-campaigns" 
              className="p-4 bg-gradient-to-br from-primary-50/50 to-neutral-50/50 border border-neutral-200 rounded-xl hover:shadow-lg transition-all duration-300 text-left"
            >
              <h3 className="font-semibold text-neutral-900 mb-2">Digital Campaigns</h3>
              <p className="text-sm text-neutral-600">Paid advertising and campaign questions</p>
            </a>
            <a 
              href="/services/seo" 
              className="p-4 bg-gradient-to-br from-primary-50/50 to-neutral-50/50 border border-neutral-200 rounded-xl hover:shadow-lg transition-all duration-300 text-left"
            >
              <h3 className="font-semibold text-neutral-900 mb-2">REPLACE Service 1</h3>
              <p className="text-sm text-neutral-600">Search optimization and ranking FAQs</p>
            </a>
            <a 
              href="/services/social-media" 
              className="p-4 bg-gradient-to-br from-primary-50/50 to-neutral-50/50 border border-neutral-200 rounded-xl hover:shadow-lg transition-all duration-300 text-left"
            >
              <h3 className="font-semibold text-neutral-900 mb-2">Social Media</h3>
              <p className="text-sm text-neutral-600">Social strategy and management questions</p>
            </a>
            <a 
              href="/services/website-design" 
              className="p-4 bg-gradient-to-br from-primary-50/50 to-neutral-50/50 border border-neutral-200 rounded-xl hover:shadow-lg transition-all duration-300 text-left"
            >
              <h3 className="font-semibold text-neutral-900 mb-2">Website Design</h3>
              <p className="text-sm text-neutral-600">Web development and design FAQs</p>
            </a>
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-16 bg-gradient-to-br from-primary-600 to-primary-700 relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-10 -left-10 w-40 h-40 bg-primary-400/20 rounded-full blur-2xl"></div>
          <div className="absolute -bottom-10 -right-10 w-60 h-60 bg-primary-800/20 rounded-full blur-3xl"></div>
        </div>
        
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h3 className="text-3xl font-bold text-white mb-4">
            Still Have Questions?
          </h3>
          <p className="text-xl text-primary-100 mb-8">
            I’m here to help! Get in touch and I’ll answer any questions about how we can work together.
          </p>
          <a 
            href="/contact"
            className="inline-flex items-center px-8 py-4 bg-white text-primary-600 rounded-2xl hover:bg-neutral-50 transition-colors font-semibold shadow-lg"
          >
            Get In Touch
          </a>
        </div>
      </section>

      <Footer />
    </div>
  );
}
