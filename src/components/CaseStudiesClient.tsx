'use client';

import { useState } from 'react';
import { Calendar, Clock, ArrowRight, ChevronLeft, ChevronRight, Star } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { themeStyles } from '@/lib/theme';

import { CaseStudy, Testimonial } from '@/lib/content';

interface CaseStudiesClientProps {
  caseStudies: CaseStudy[];
  testimonials: Testimonial[];
}

// Function to calculate reading time based on content
const calculateReadTime = (content: string): string => {
  const wordsPerMinute = 200; // Average reading speed
  const words = content.trim().split(/\s+/).length;
  const minutes = Math.ceil(words / wordsPerMinute);
  return `${minutes} min read`;
};

const CaseStudyCard = ({ caseStudy, index = 0 }: { caseStudy: CaseStudy; index?: number }) => (
  <Link href={`/case-studies/${caseStudy.id}`} className="block h-full">
    <div className={`${themeStyles.cards.default} ${themeStyles.cards.hover} ${themeStyles.cards.interactive} h-full overflow-hidden relative`}>
      {/* Subtle glow effect that doesn't interfere with text */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary-500/10 via-primary-400/10 to-primary-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl"></div>
      
      <div className="aspect-[4/3] relative overflow-hidden">
        <Image 
          src={caseStudy.image || "/images/case-study-stock.jpg"}
          alt={`${caseStudy.title} case study`}
          fill
          className="object-cover group-hover:scale-110 transition-transform duration-700"
          priority={index < 3} // Prioritize first 3 images
          loading={index < 3 ? "eager" : "lazy"}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          quality={85} // Optimize quality vs size
        />
        <div className="absolute inset-0 bg-gradient-to-br from-primary-600/30 via-neutral-900/20 to-neutral-900/60"></div>
        
        {/* Industry badge */}
        <div className="absolute top-4 left-4">
          <span className="px-3 py-1.5 bg-white/90 backdrop-blur-md text-neutral-800 text-sm font-semibold rounded-full shadow-lg">
            {caseStudy.industry}
          </span>
        </div>
        
        {/* Tags at bottom */}
        <div className="absolute bottom-4 left-4 right-4">
          <div className="flex flex-wrap gap-2">
            {caseStudy.tags?.slice(0, 3).map((tag, index) => (
              <span key={index} className="px-3 py-1 bg-white/15 backdrop-blur-md text-white text-xs font-medium rounded-full border border-white/20">
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
      
      <div className="p-8 relative z-10 bg-white group-hover:bg-white transition-colors duration-500">
        <div className="flex items-center gap-4 text-sm text-neutral-500 mb-4">
          <div className="flex items-center gap-1.5">
            <Calendar className={`w-4 h-4 ${themeStyles.text.accent}`} />
            <span className="font-medium">{new Date(caseStudy.date).toLocaleDateString()}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Clock className={`w-4 h-4 ${themeStyles.text.accent}`} />
            <span className="font-medium">{calculateReadTime(caseStudy.content)}</span>
          </div>
        </div>
        
        <h3 className={`${themeStyles.text.h3} group-hover:text-primary-700 mb-3 transition-colors duration-300 line-clamp-2`}>
          {caseStudy.title}
        </h3>
        
        <p className={`${themeStyles.text.body} group-hover:text-neutral-700 mb-6 font-medium transition-colors duration-300`}>
          <span className={`${themeStyles.text.accent} group-hover:text-primary-700 font-semibold transition-colors duration-300`}>{caseStudy.client}</span>
        </p>
        
        {caseStudy.results && Object.values(caseStudy.results).length > 0 && (
          <div className="grid grid-cols-2 gap-3 mb-6">
            {Object.entries(caseStudy.results).slice(0, 2).map(([key, value], index) => (
              <div key={index} className="text-center p-3 bg-gradient-to-br from-primary-50 to-primary-100/50 group-hover:from-primary-100 group-hover:to-primary-150 rounded-xl border border-primary-100 transition-colors duration-300">
                <div className="text-lg font-bold text-primary-700">{value}</div>
                <div className="text-xs text-primary-600 font-medium capitalize">{key.replace(/([A-Z])/g, ' $1')}</div>
              </div>
            ))}
          </div>
        )}
        
        <div className="flex items-center justify-between pt-4 border-t border-neutral-100">
          <span className={`text-sm font-semibold ${themeStyles.text.body} group-hover:text-primary-700 transition-colors duration-300`}>
            View Full Case Study
          </span>
          <div className="w-8 h-8 bg-primary-100 group-hover:bg-primary-600 rounded-full flex items-center justify-center transition-all duration-300 shadow-sm group-hover:shadow-md">
            <ArrowRight className={`w-4 h-4 ${themeStyles.text.accent} group-hover:text-white transition-colors duration-300`} />
          </div>
        </div>
      </div>
    </div>
  </Link>
);

const TestimonialCard = ({ testimonial }: { testimonial: Testimonial }) => (
  <div className="bg-white rounded-3xl shadow-xl border border-neutral-100 p-8 h-full flex flex-col relative overflow-hidden group hover:shadow-2xl transition-all duration-500">
    {/* Decorative background */}
    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary-100 to-primary-200 rounded-full -translate-y-16 translate-x-16 opacity-50"></div>
    <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-primary-50 to-primary-100 rounded-full translate-y-12 -translate-x-12 opacity-30"></div>
    
    <div className="flex items-center gap-4 mb-6 relative z-10">
      <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
        <span className="font-bold text-white text-xl">{testimonial.name.charAt(0)}</span>
      </div>
      <div className="flex-1">
        <h4 className="font-bold text-neutral-900 text-lg">{testimonial.name}</h4>
        <p className="text-primary-600 font-semibold">{testimonial.role}</p>
        <p className="text-neutral-500 text-sm">{testimonial.company}</p>
      </div>
      <div className="flex">
        {[...Array(testimonial.rating)].map((_, i) => (
          <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
        ))}
      </div>
    </div>
    
    <blockquote className="text-neutral-700 text-lg leading-relaxed mb-6 flex-grow relative z-10 italic">
  <span className="text-4xl text-primary-300 absolute -top-2 -left-2">“</span>
      <span className="relative z-10">{testimonial.content}</span>
  <span className="text-4xl text-primary-300 absolute -bottom-4 -right-2">”</span>
    </blockquote>
    
    <div className="border-t border-neutral-100 pt-6 relative z-10">
      <p className="text-sm font-bold text-neutral-900 mb-3 flex items-center gap-2">
        <span className="w-2 h-2 bg-primary-500 rounded-full"></span>
        Key Results:
      </p>
      <div className="flex flex-wrap gap-2">
        {testimonial.results && testimonial.results.map((result, index) => (
          <span key={index} className="text-xs px-3 py-1.5 bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 rounded-full font-medium border border-green-200 whitespace-nowrap flex-shrink-0">
            {result}
          </span>
        ))}
      </div>
    </div>
  </div>
);

export default function CaseStudiesClient({ caseStudies, testimonials }: CaseStudiesClientProps) {
  const [currentTestimonialIndex, setCurrentTestimonialIndex] = useState(0);

  const nextTestimonial = () => {
    setCurrentTestimonialIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentTestimonialIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <div className={`min-h-screen ${themeStyles.backgrounds.page}`}>
      {/* Hero Section (single H1) */}
      <section className="relative overflow-hidden pt-28 pb-16 bg-gradient-to-br from-white via-primary-50/10 to-neutral-50/30">
        <div className="absolute -top-24 -left-24 w-72 h-72 bg-primary-200/30 rounded-full blur-3xl" />
        <div className="absolute top-1/3 -right-24 w-60 h-60 bg-neutral-300/20 rounded-full blur-2xl" />
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-neutral-900 mb-6">
            <span className="bg-gradient-to-r from-primary-600 via-primary-500 to-neutral-900 bg-clip-text text-transparent">Proven Client Success Stories</span>
          </h1>
          {/* Add a visible H2 immediately after H1 to satisfy heading hierarchy checks */}
          <h2 className="text-xl md:text-2xl font-semibold text-neutral-800 mb-4">Explore our case studies</h2>
          <p className="text-lg md:text-xl text-neutral-600 max-w-2xl mx-auto leading-relaxed">
            Real-world results from strategy to execution. Explore the measurable growth delivered across industries.
          </p>
        </div>
      </section>

      {/* Case Studies Grid (add section heading for hierarchy) */}
      <section className="py-16 sm:py-20 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Keep a semantic subheading for the grid, demoted to H3 to preserve a single visible H2 on the page */}
          <h3 className="sr-only">Case Studies</h3>
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-8 lg:gap-12">
            {caseStudies.map((caseStudy, index) => (
              <div 
                key={caseStudy.id}
                className="animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CaseStudyCard caseStudy={caseStudy} index={index} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      {testimonials.length > 0 && (
        <section className="py-16 sm:py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <header className="text-center mb-14">
              <h3 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-4">What Our Clients Say</h3>
              <p className="text-neutral-600 max-w-2xl mx-auto text-lg">Direct feedback and headline metrics from growth journeys we’ve supported.</p>
            </header>
            {/* Provide a subheading level under the H3 for semantics; keep accessible structure */}
            <h4 className="sr-only">Testimonials</h4>

            <div className="relative">
              <div className="overflow-hidden">
                <div 
                  className="flex transition-transform duration-500 ease-in-out"
                  style={{ transform: `translateX(-${currentTestimonialIndex * 100}%)` }}
                >
                  {testimonials.map((testimonial) => (
                    <div key={testimonial.id} className="w-full flex-shrink-0 px-4">
                      <TestimonialCard testimonial={testimonial} />
                    </div>
                  ))}
                </div>
              </div>

              {/* Navigation */}
              <div className="flex items-center justify-center gap-8 mt-12">
                <button
                  onClick={prevTestimonial}
                  className="group p-4 rounded-2xl bg-white text-primary-600 hover:bg-primary-500 hover:text-white transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-1 border border-primary-100"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                
                <div className="flex gap-3">
                  {testimonials.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentTestimonialIndex(index)}
                      className={`w-3 h-3 rounded-full transition-all duration-300 ${
                        index === currentTestimonialIndex 
                          ? 'bg-primary-500 scale-125' 
                          : 'bg-neutral-300 hover:bg-primary-300'
                      }`}
                      aria-label={`Go to testimonial ${index + 1}`}
                    />
                  ))}
                </div>
                
                <button
                  onClick={nextTestimonial}
                  className="group p-4 rounded-2xl bg-white text-primary-600 hover:bg-primary-500 hover:text-white transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-1 border border-primary-100"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-primary-600 via-primary-500 to-primary-700 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-10 -left-10 w-40 h-40 bg-primary-400/20 rounded-full blur-2xl" />
          <div className="absolute -bottom-10 -right-10 w-60 h-60 bg-primary-800/20 rounded-full blur-3xl" />
        </div>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-10 sm:p-14 border border-white/20">
            <h3 className="text-3xl md:text-4xl font-bold text-white mb-6">Ready To Be The Next Growth Story?</h3>
            <p className="text-lg text-white/90 mb-10 max-w-2xl mx-auto leading-relaxed">Request a no-pressure strategy call. We’ll map quick wins, structural gaps and next-step acceleration paths tailored to your objectives.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/contact"
                className="inline-flex items-center justify-center px-8 py-4 bg-white text-primary-600 rounded-lg hover:bg-neutral-50 transition-all duration-300 transform hover:scale-105 shadow-lg font-semibold"
              >
                Get Your Free Consultation
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
              <Link 
                href="/services"
                className="inline-flex items-center justify-center px-8 py-4 border-2 border-white text-white rounded-lg hover:bg-white hover:text-primary-600 transition-all duration-300 font-semibold"
              >
                <Star className="mr-2 w-5 h-5" />
                View Our Services
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
