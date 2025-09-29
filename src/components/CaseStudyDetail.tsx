'use client';

import { ArrowRight, Calendar, Clock, Tag, TrendingUp, Star, Linkedin, Twitter, Facebook } from 'lucide-react';
import Link from 'next/link';
import Breadcrumbs from '@/components/Breadcrumbs';
import ReactMarkdown from 'react-markdown';
import { CaseStudy } from '@/lib/content';
import { themeStyles, getThemeClasses } from '@/lib/theme';

interface CaseStudyDetailProps {
  caseStudy: CaseStudy;
}

export default function CaseStudyDetail({ caseStudy }: CaseStudyDetailProps) {
  const handleShare = (platform: string) => {
    const url = window.location.href;
    const title = `${caseStudy.title} - Case Study`;
    
    let shareUrl = '';
    switch (platform) {
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`;
        break;
      case 'linkedin':
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
        break;
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
        break;
    }
    
    if (shareUrl) {
      window.open(shareUrl, '_blank', 'width=600,height=400');
    }
  };

  return (
    <div className={`min-h-screen ${themeStyles.backgrounds.page}`}>
      {/* Hero Section */}
      <section className={getThemeClasses.hero()}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Breadcrumb */}
          <div className="pt-6 mb-6">
            <Breadcrumbs 
              items={[
                { label: 'Home', href: '/' },
                { label: 'Case Studies', href: '/case-studies' },
                { label: caseStudy.title },
              ]}
              className="max-w-4xl mx-auto"
            />
          </div>

          {/* Case Study Header */}
          <div className="text-center mb-12">
            <div className="flex flex-wrap items-center justify-center gap-4 mb-6">
              <span className={`px-3 py-1 ${themeStyles.text.accent} bg-primary-50 rounded-full text-sm font-medium`}>
                {caseStudy.industry}
              </span>
              <div className="flex items-center gap-4 text-sm text-neutral-500">
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  <span>{caseStudy.date}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  <span>{caseStudy.readTime}</span>
                </div>
              </div>
            </div>
            
            <h1 className={`${themeStyles.text.h1} mb-6`}>
              {caseStudy.title}
            </h1>
            
            <p className={`${themeStyles.text.bodyLarge} max-w-3xl mx-auto mb-8`}>
              {caseStudy.challenge}
            </p>

            {/* Share Buttons */}
            <div className="flex items-center justify-center gap-4">
              <span className={`text-sm ${themeStyles.text.muted}`}>Share this case study:</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleShare('linkedin')}
                  className="w-8 h-8 bg-[#0077B5] text-white rounded-full flex items-center justify-center hover:scale-110 transition-transform duration-300"
                  aria-label="Share on LinkedIn"
                >
                  <Linkedin className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleShare('twitter')}
                  className="w-8 h-8 bg-[#1DA1F2] text-white rounded-full flex items-center justify-center hover:scale-110 transition-transform duration-300"
                  aria-label="Share on Twitter"
                >
                  <Twitter className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleShare('facebook')}
                  className="w-8 h-8 bg-[#1877F2] text-white rounded-full flex items-center justify-center hover:scale-110 transition-transform duration-300"
                  aria-label="Share on Facebook"
                >
                  <Facebook className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Results Overview */}
      <section className={`py-16 ${themeStyles.backgrounds.card}`}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className={`${themeStyles.text.h2} mb-4`}>Results at a Glance for {caseStudy.client}</h2>
            <p className={`${themeStyles.text.body} max-w-2xl mx-auto`}>
              Heres what we achieved for {caseStudy.client}
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {Object.entries(caseStudy.results).map(([key, value]) => (
              <div key={key} className={`${themeStyles.cards.default} ${themeStyles.cards.hover} p-6 text-center group`}>
                <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
                <div className={`text-3xl font-bold ${themeStyles.text.accent} mb-2`}>
                  {value}
                </div>
                <div className={`text-sm ${themeStyles.text.muted} capitalize`}>
                  {key.replace(/([A-Z])/g, ' $1').trim()}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Case Study Content - Beautiful rich styling like original */}
      <div className="max-w-6xl mx-auto px-4 py-16">
        <div className="bg-white rounded-3xl shadow-xl border border-neutral-100 overflow-hidden">
          <div className="p-8 md:p-16">
            {/* Rich Markdown Content with beautiful styling */}
            <div className="markdown-content prose prose-lg prose-neutral max-w-none 
              prose-headings:text-neutral-900 prose-headings:font-bold
              prose-h1:text-4xl prose-h1:mb-8 prose-h1:text-primary-600
              prose-h2:text-3xl prose-h2:mb-6 prose-h2:mt-12 prose-h2:text-neutral-800 prose-h2:border-b prose-h2:border-primary-100 prose-h2:pb-3
              prose-h3:text-2xl prose-h3:mb-4 prose-h3:mt-8 prose-h3:text-neutral-700
              prose-p:text-neutral-600 prose-p:leading-relaxed prose-p:mb-6
              prose-a:text-primary-600 prose-a:font-semibold prose-a:no-underline hover:prose-a:underline
              prose-strong:text-neutral-900 prose-strong:font-bold
              prose-ul:my-6 prose-li:text-neutral-600 prose-li:mb-2
              prose-blockquote:border-l-4 prose-blockquote:border-primary-200 prose-blockquote:bg-primary-50/50 prose-blockquote:py-4 prose-blockquote:px-6 prose-blockquote:rounded-r-lg prose-blockquote:text-neutral-700 prose-blockquote:italic
            ">
              {/**
               * Enforce heading hierarchy from Markdown content:
               * - Prevent additional H1/H2 from Markdown by remapping them to H3.
               * - Shift lower levels down (H3->H4, H4->H5, H5->H6).
               * This ensures exactly one H1 (page title) and one H2 ("Results at a Glance").
               */}
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
                {caseStudy.content}
              </ReactMarkdown>
            </div>
          </div>
        </div>
      </div>

      {/* Tags Section */}
      <section className={`py-16 ${themeStyles.backgrounds.section}`}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h3 className={`${themeStyles.text.h3} mb-4`}>Services Used</h3>
          </div>
          <div className="flex flex-wrap justify-center gap-3">
            {caseStudy.tags.map((tag) => (
              <span
                key={tag}
                className={`px-4 py-2 bg-primary-50 ${themeStyles.text.accent} rounded-full text-sm font-medium border border-primary-100 hover:bg-primary-100 transition-colors duration-300`}
              >
                <Tag className="w-3 h-3 inline mr-2" />
                {tag}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 sm:py-20 bg-gradient-to-r from-primary-600 to-primary-500">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 sm:p-12 border border-white/20">
            <h3 className={`${themeStyles.text.h2} text-white mb-6`}>
              Ready for Similar Results?
            </h3>
            <p className="text-lg text-white/90 mb-8 max-w-2xl mx-auto leading-relaxed">
              Let’s discuss how we can apply these same strategies to transform your business
              and achieve outstanding results like {caseStudy.client}.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/contact"
                className="inline-flex items-center justify-center px-8 py-4 bg-white text-primary-600 rounded-lg hover:bg-neutral-50 transition-all duration-300 transform hover:scale-105 shadow-lg font-semibold"
              >
                Get Your Free Consultation
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
              <Link 
                href="/case-studies"
                className="inline-flex items-center justify-center px-8 py-4 border-2 border-white text-white rounded-lg hover:bg-white hover:text-primary-600 transition-all duration-300 font-semibold"
              >
                <Star className="mr-2 w-5 h-5" />
                View More Case Studies
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
