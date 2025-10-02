import { Metadata } from 'next';
import { Mail, MapPin, Clock, ArrowRight, Calendar, MessageCircle } from 'lucide-react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { LeadFormWithHeadingLevel } from '@/components/LeadFormWithHeadingLevel';
import { FAQSectionWithHeadingLevel } from '@/components/FAQSectionWithHeadingLevel';
import { themeStyles, getThemeClasses } from '@/lib/theme';
import { getPageSeo, buildMetadataFromSeo } from '@/lib/pageSeo';
import { getMainPageData } from '@/tina/queries/mainPages';

const contactSeo = getPageSeo('contact')
export const metadata: Metadata = buildMetadataFromSeo(
  { 
    slug: 'contact', 
    pageType: 'contact'
  }, 
  contactSeo
)

export default function ContactPage() {
  const page = getMainPageData('contact', {
    heroTitle: 'Get In Touch',
    heroSubtitle: 'Let’s Grow Your Business Together',
    heroDescription: 'Ready to take your marketing to the next level? I’d love to hear about your business goals and discuss how we can work together to achieve them.',
  });
  const contactItems = (page.contactMethods && page.contactMethods.length)
    ? page.contactMethods
    : [
        { icon: 'Mail', title: 'Email Me', subtitle: 'Get a response within 24 hours', value: 'ellieedwardsmarketing@gmail.com', href: 'mailto:ellieedwardsmarketing@gmail.com' },
        { icon: 'Calendar', title: 'Book a Consultation', subtitle: 'Schedule a free 30-minute strategy call', href: '#consultation-form' },
        { icon: 'MapPin', title: 'Local Service Area', subtitle: 'Based in Camberley, serving Surrey • Hampshire • Basingstoke • Reading' },
        { icon: 'MessageCircle', title: 'Connect on LinkedIn', subtitle: 'Let’s connect and discuss opportunities', href: 'https://www.linkedin.com/in/ellie-edwards-marketing/' },
      ];
  const expectations = (page.expectations && page.expectations.length)
    ? page.expectations
    : [
        'Response within 24 hours',
        'Free 30-minute strategy consultation',
        'Custom marketing plan discussion',
        'No-pressure approach',
      ];
  const IconMap: Record<string, React.ComponentType<{ className?: string }>> = {
    Mail,
    Calendar,
    MapPin,
    MessageCircle,
  };
  return (
    // Added overflow-x-hidden to prevent any horizontal scroll caused by scaled elements/pills on small screens
    <div className={`min-h-screen overflow-x-hidden ${themeStyles.backgrounds.page}`}>
      <Navigation />
      
      {/* Hero Section */}
      <section className={`pt-16 ${getThemeClasses.hero()}`}>
        {/* Background decorative elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-20 -left-20 w-60 h-60 sm:w-80 sm:h-80 bg-gradient-to-br from-primary-200/20 to-primary-400/10 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 -right-20 w-40 h-40 sm:w-60 sm:h-60 bg-gradient-to-tr from-neutral-200/30 to-neutral-400/10 rounded-full blur-2xl"></div>
        </div>
        
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <h1 className={`${themeStyles.text.h1} mb-6`}>
            {page.heroTitle || 'Get In Touch'}
            <span className={`block ${themeStyles.text.accent}`}>{page.heroSubtitle || 'Let’s Grow Your Business Together'}</span>
          </h1>
          {page.heroDescription && (
            <p className={`${themeStyles.text.bodyLarge} mb-8 max-w-3xl mx-auto`}>
              {page.heroDescription}
            </p>
          )}
        </div>
      </section>

      {/* Contact Methods & Form Section */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12">
            
            {/* Contact Information */}
            <div>
              <h2 className="text-3xl font-bold text-neutral-900 mb-8">Let’s Start the Conversation</h2>
              
              {/* Contact Methods (from Tina) */}
              <div className="space-y-6 mb-8">
                {contactItems.map((item, idx) => {
                  const Icon = IconMap[item.icon || 'Mail'] || Mail;
                  return (
                    <div key={idx} className="flex flex-col sm:flex-row sm:items-start sm:space-x-4 gap-4 p-4 sm:p-6 bg-gradient-to-br from-primary-50/50 to-neutral-50/50 border border-neutral-200 rounded-2xl hover:shadow-lg transition-all duration-300 overflow-hidden">
                      <div className="flex-shrink-0 w-12 h-12 bg-primary-600 text-white rounded-xl flex items-center justify-center mx-auto sm:mx-0">
                        <Icon className="h-6 w-6" />
                      </div>
                      <div className="min-w-0">
                        {item.title && <h3 className="text-lg font-semibold text-neutral-900 mb-2">{item.title}</h3>}
                        {item.title === 'Local Service Area' && item.subtitle ? (
                          <div className="text-neutral-600">
                            <p className="mb-1">Camberley-based marketing consultant serving</p>
                            <ul className="list-disc pl-5">
                              <li>Surrey</li>
                              <li>Hampshire</li>
                              <li>Basingstoke</li>
                              <li>Reading</li>
                            </ul>
                          </div>
                        ) : (
                          item.subtitle && <p className="text-neutral-600 mb-2">{item.subtitle}</p>
                        )}
                        {item.href && (
                          <a
                            href={item.href}
                            target={/^https?:\/\//.test(item.href) ? '_blank' : undefined}
                            rel={/^https?:\/\//.test(item.href) ? 'noopener noreferrer' : undefined}
                            className="text-primary-600 hover:text-primary-700 font-medium break-all sm:break-normal text-sm sm:text-base"
                          >
                            {item.value || item.href}
                          </a>
                        )}
                        {!item.href && item.value && (
                          <p className="text-primary-600 font-medium break-all sm:break-normal text-sm sm:text-base">{item.value}</p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Response Time & Process */}
              <div className="bg-gradient-to-br from-neutral-50/50 via-primary-50/20 to-neutral-50/50 p-6 rounded-2xl border border-neutral-200">
                <h3 className="text-lg font-semibold text-neutral-900 mb-4 flex items-center">
                  <Clock className="h-5 w-5 text-primary-600 mr-2" />
                  What to Expect
                </h3>
                <ul className="space-y-3 text-neutral-600">
                  {expectations.map((exp, i) => (
                    <li key={i} className="flex items-start">
                      <ArrowRight className="h-5 w-5 text-primary-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span>{exp}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Contact Form */}
            <div id="consultation-form">
              <div className="bg-white p-8 rounded-3xl shadow-xl border border-neutral-100">
                <h3 className="text-2xl font-bold text-neutral-900 mb-6">Send Me a Message</h3>
                <LeadFormWithHeadingLevel headingLevel="h4" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <FAQSectionWithHeadingLevel 
        title="Frequently Asked Questions"
        subtitle="Common questions about working together"
        headingLevel="h3"
        faqs={[
          {
            question: "How quickly can we get started?",
            answer: "After our initial consultation, I typically start new projects within 1-2 weeks, depending on scope and current workload."
          },
          {
            question: "What's included in the free consultation?",
            answer: "We'll discuss your business goals, current marketing challenges, and I'll provide initial recommendations. No strings attached."
          },
          {
            question: "Do you work with businesses outside the UK?",
            answer: "Yes! I work with clients globally. Most of our communication happens via email and video calls, making location flexible."
          },
          {
            question: "What if I'm not sure which service I need?",
            answer: "That's perfectly fine! During our consultation, I'll assess your needs and recommend the best approach for your business goals."
          }
        ]}
      />

      {/* Final CTA Section */}
      <section className="py-16 bg-gradient-to-br from-primary-600 to-primary-700 relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-10 -left-10 w-40 h-40 bg-primary-400/20 rounded-full blur-2xl"></div>
          <div className="absolute -bottom-10 -right-10 w-60 h-60 bg-primary-800/20 rounded-full blur-3xl"></div>
        </div>
        
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h3 className="text-3xl font-bold text-white mb-4">
            {page.pageCta?.title || 'Ready to Transform Your Marketing?'}
          </h3>
          {page.pageCta?.description && (
            <p className="text-xl text-primary-100 mb-8">{page.pageCta.description}</p>
          )}
          <a 
            href={page.pageCta?.buttonHref || '#consultation-form'}
            className="inline-flex items-center px-8 py-4 bg-white text-primary-600 rounded-2xl hover:bg-neutral-50 transition-colors font-semibold shadow-lg"
          >
            {page.pageCta?.buttonLabel || 'Start Your Free Consultation'} <ArrowRight className="ml-2 h-5 w-5" />
          </a>
        </div>
      </section>

      <Footer />
    </div>
  );
}
