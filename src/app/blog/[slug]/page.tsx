import React from 'react';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import { getBlogPost, getBlogPosts, getRelatedPosts } from '@/lib/blog';
import { Calendar, Clock, ArrowRight, Linkedin, Twitter, Facebook, Send, MessageCircle, Tag } from 'lucide-react';
import Navigation from '@/components/Navigation';
import { buildMetadataFromSeo } from '@/lib/pageSeo';
import Footer from '@/components/Footer';
import Breadcrumbs from '@/components/Breadcrumbs';

interface BlogPostPageProps {
  params: {
    slug: string;
  };
}

export async function generateStaticParams() {
  const posts = getBlogPosts();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const post = getBlogPost(params.slug);
  
  if (!post) {
    return {
      title: 'Post Not Found',
    };
  }

  return buildMetadataFromSeo(
    { 
      slug: `blog/${params.slug}`, 
      pageType: 'blog',
      contentData: {
        title: post.title,
        excerpt: post.excerpt,
        keywords: post.keywords,
        socialShare: post.socialShare
      }
    }, 
    post.seo
  );
}

// Safely pick an optional subheading/deck field from a post-like object
function pickSubheading(post: unknown): string | undefined {
  if (!post || typeof post !== 'object') return undefined;
  const p = post as Record<string, unknown>;
  const keys = ['subheading', 'subTitle', 'subtitle', 'deck'] as const;
  for (const k of keys) {
    const v = p[k];
    if (typeof v === 'string' && v.trim()) return v;
  }
  return undefined;
}

export default function BlogPostPage({ params }: BlogPostPageProps) {
  const post = getBlogPost(params.slug);
  
  if (!post) {
    notFound();
  }

  // Debug toggle no longer required since H2 is always visible when missing subheading

  const relatedPosts = getRelatedPosts(post);
  const shareUrl = `https://www.ellieedwardsmarketing.com/blog/${post.slug}`;
  const shareTitle = encodeURIComponent(post.title);
  const shareDescription = encodeURIComponent(post.excerpt);

  // Display full headings; test suite will flag over-length H1/H2 for editorial change

  // Optional visible H2: allow content authors to provide a subheading/deck in frontmatter.
  // If present, we'll render it as the single visible H2 just under the H1.
  // Must be unique sitewide and ≤70 chars to pass tests.
  const subheading = pickSubheading(post);
  // Derive a fallback from the excerpt (first sentence) if no subheading
  function firstSentence(text?: string): string | undefined {
    if (!text) return undefined;
    const trimmed = text.trim();
    const match = trimmed.match(/[^.!?]+[.!?]/);
    const candidate = (match ? match[0] : trimmed).trim();
    return candidate.length > 0 ? candidate : undefined;
  }
  type WithExcerpt = { excerpt?: string };
  const fallbackH2 = !subheading ? firstSentence((post as WithExcerpt).excerpt) : undefined;

  return (
    <React.Fragment>
      <Navigation />
      <div className="min-h-screen bg-gradient-to-br from-white via-primary-50/10 to-neutral-50/30">
        {/* Navigation */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="mb-4 md:mb-0">
              <Breadcrumbs 
                items={[
                  { label: 'Home', href: '/' },
                  { label: 'Blog', href: '/blog' },
                  { label: post.title },
                ]}
                className="mb-4"
              />
            </div>
          </div>
        </div>

        {/* Article Header - Beautiful styled header */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
          <div className="bg-white rounded-3xl shadow-xl border border-neutral-100 overflow-hidden">
            <div className="p-8 md:p-16">
              {/* Categories */}
              {post.categories && post.categories.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-6">
                  {post.categories.map((category) => (
                    <span
                      key={category}
                      className="bg-primary-100 text-primary-700 px-4 py-2 rounded-full text-sm font-medium shadow-sm"
                    >
                      <Tag className="w-3 h-3 inline mr-2" />
                      {category}
                    </span>
                  ))}
                </div>
              )}

              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-neutral-900 mb-2 leading-tight">
                {post.title}
              </h1>
              {subheading && (
                <h2 className="text-lg md:text-xl text-neutral-700 mb-6 leading-snug">
                  {subheading}
                </h2>
              )}

              <p className="text-xl text-neutral-600 mb-8 leading-relaxed">
                {post.excerpt}
              </p>

              {/* Article Meta - Beautiful styling */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between py-6 border-t border-b border-neutral-200">
                <div className="flex items-center mb-4 sm:mb-0">
                  <div className="relative w-12 h-12 flex-shrink-0">
                    <Image
                      src={post.author.avatar}
                      alt={post.author.name}
                      fill
                      className="rounded-full object-cover"
                      sizes="48px"
                    />
                  </div>
                  <div className="ml-4 min-w-0 overflow-hidden">
                    <div className="flex items-center">
                      <span className="font-semibold text-neutral-900">{post.author.name}</span>
                      {post.author.linkedin && (
                        <a
                          href={post.author.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="ml-2 text-primary-600 hover:text-primary-700"
                        >
                          <Linkedin className="w-4 h-4" />
                        </a>
                      )}
                    </div>
                    <p className="text-sm text-neutral-600">{post.author.bio}</p>
                </div>
              </div>
              
              <div className="flex items-center text-sm text-neutral-500 space-x-6">
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 mr-2" />
                  <span>{new Date(post.publishDate).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}</span>
                </div>
                <div className="flex items-center">
                  <Clock className="w-4 h-4 mr-2" />
                  <span>{post.readingTime} min read</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Featured Image */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
          <div className="relative h-64 md:h-96 rounded-3xl overflow-hidden shadow-lg">
            <Image
              src={post.featuredImage}
              alt={post.alt}
              fill
              className="object-cover"
              priority
            />
          </div>

          {/* Share Buttons */}
          <div className="mb-8 flex items-center justify-center space-x-4">
            <span className="text-sm text-neutral-600 mr-2">Share this article:</span>
            <a
              href={`https://www.linkedin.com/sharing/share-offsite/?url=${shareUrl}`}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 bg-primary-600 text-white rounded-full hover:bg-primary-700 transition-colors"
              aria-label="Share on LinkedIn"
            >
              <Linkedin className="w-4 h-4" />
            </a>
            <a
              href={`https://twitter.com/intent/tweet?text=${shareTitle}&url=${shareUrl}`}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 bg-sky-500 text-white rounded-full hover:bg-sky-600 transition-colors"
              aria-label="Share on Twitter"
            >
              <Twitter className="w-4 h-4" />
            </a>
            <a
              href={`https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 bg-blue-800 text-white rounded-full hover:bg-blue-900 transition-colors"
              aria-label="Share on Facebook"
            >
              <Facebook className="w-4 h-4" />
            </a>
            <a
              href={`mailto:?subject=${shareTitle}&body=${shareDescription}%0A%0A${shareUrl}`}
              className="p-2 bg-neutral-600 text-white rounded-full hover:bg-neutral-700 transition-colors"
              aria-label="Share via Email"
            >
              <Send className="w-4 h-4" />
            </a>
          </div>

          {/* Article Content - Beautiful rich styling matching case studies */}
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
                  prose-ol:my-6 prose-ol:list-decimal
                  prose-blockquote:border-l-4 prose-blockquote:border-primary-200 prose-blockquote:bg-primary-50/50 prose-blockquote:py-4 prose-blockquote:px-6 prose-blockquote:rounded-r-lg prose-blockquote:text-neutral-700 prose-blockquote:italic
                  prose-code:bg-neutral-100 prose-code:px-2 prose-code:py-1 prose-code:rounded prose-code:text-sm prose-code:font-mono prose-code:text-neutral-800
                  prose-pre:bg-neutral-900 prose-pre:text-neutral-100 prose-pre:p-4 prose-pre:rounded-lg prose-pre:overflow-x-auto
                ">
                  {/* If no subheading was provided, render a visible fallback H2 (excerpt first sentence) */}
                  {!subheading && (
                    <h2 className="text-lg md:text-xl text-neutral-700 mb-6 leading-snug">
                      {fallbackH2 || post.title}
                    </h2>
                  )}
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
                    {post.content}
                  </ReactMarkdown>
                </div>
              </div>
            </div>
          </div>

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="mb-12 p-6 bg-gradient-to-br from-neutral-50/50 via-white to-primary-50/30 rounded-3xl border border-neutral-100/50">
              <h3 className="text-lg font-bold text-neutral-900 mb-4 flex items-center gap-2">
                <Tag className="w-5 h-5 text-primary-600" />
                Tags
              </h3>
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag) => {
                  // Map tags to existing categories
                  const categoryMap: { [key: string]: string } = {
                    'seo': 'seo',
                    'search-engine-optimization': 'seo',
                    'content-marketing': 'content-marketing',
                    'content-strategy': 'content-marketing',
                    'social-media': 'social-media',
                    'facebook-marketing': 'social-media',
                    'instagram-marketing': 'social-media',
                    'linkedin-marketing': 'social-media',
                    'email-marketing': 'email-marketing',
                    'ppc': 'ppc',
                    'google-ads': 'ppc',
                    'paid-advertising': 'ppc',
                    'brand-strategy': 'brand-strategy',
                    'branding': 'brand-strategy',
                    'lead-generation': 'lead-generation',
                    'conversion-optimization': 'lead-generation',
                    'website-design': 'website-design',
                    'web-development': 'website-design',
                    'case-study': 'case-studies',
                    'marketing-tips': 'marketing-tips',
                    'marketing-strategy': 'marketing-tips',
                    'small-business': 'marketing-tips',
                    'digital-marketing': 'digital-marketing'
                  };
                  
                  const tagSlug = tag.toLowerCase().replace(/\s+/g, '-');
                  const category = categoryMap[tagSlug] || 'digital-marketing';
                  
                  return (
                    <Link
                      key={tag}
                      href={`/blog/category/${category}`}
                      className="bg-white border border-neutral-200/50 text-neutral-700 px-3 py-1 rounded-full text-sm hover:border-primary-300/50 hover:text-primary-600 hover:bg-primary-50/30 transition-all duration-300"
                    >
                      #{tag}
                    </Link>
                  );
                })}
              </div>
            </div>
          )}

          {/* Author Bio */}
          <div className="mb-12 p-6 bg-gradient-to-br from-primary-50/30 via-white to-neutral-50/30 rounded-3xl border border-neutral-100/50">
            <div className="flex items-start space-x-4">
              <div className="relative w-16 h-16 flex-shrink-0">
                <Image
                  src={post.author.avatar}
                  alt={post.author.name}
                  fill
                  className="rounded-full object-cover"
                />
              </div>
              <div className="flex-grow">
                <h3 className="text-xl font-bold text-neutral-900 mb-2">About {post.author.name}</h3>
                <p className="text-neutral-700 mb-4 leading-relaxed">{post.author.bio}</p>
                <div className="flex space-x-4">
                  {post.author.linkedin && (
                    <a
                      href={post.author.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-primary-600 hover:text-primary-700 font-medium"
                    >
                      <Linkedin className="w-4 h-4 mr-2" />
                      LinkedIn
                    </a>
                  )}
                  {post.author.twitter && (
                    <a
                      href={post.author.twitter}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-sky-600 hover:text-sky-700 font-medium"
                    >
                      <Twitter className="w-4 h-4 mr-2" />
                      Twitter
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Comments Section Placeholder */}
          <div className="mb-12 p-8 bg-white border border-neutral-200/50 rounded-3xl text-center shadow-lg">
            <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <MessageCircle className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-bold text-neutral-900 mb-2">Join the Conversation</h3>
            <p className="text-neutral-600 mb-6 leading-relaxed">
              I’d love to hear your thoughts on this article. Let’s discuss your marketing challenges and how we can solve them together.
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary-600 to-primary-500 text-white rounded-xl hover:shadow-lg transition-all duration-300 font-semibold"
            >
              Start a Conversation
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 bg-gradient-to-br from-neutral-50/50 via-white to-primary-50/30">
            <h3 className="text-3xl font-bold text-neutral-900 mb-8 text-center">Related Articles</h3>
            <div className="grid md:grid-cols-3 gap-8">
              {relatedPosts.map((relatedPost) => (
                <article key={relatedPost.slug} className="group">
                  <Link href={`/blog/${relatedPost.slug}`}>
                    <div className="bg-white rounded-3xl shadow-lg overflow-hidden transition-all duration-500 group-hover:shadow-2xl group-hover:-translate-y-2 group-hover:scale-[1.02] cursor-pointer h-full border border-neutral-100/50">
                      <div className="relative h-48">
                        <Image
                          src={relatedPost.featuredImage}
                          alt={relatedPost.alt}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="p-6">
                        <div className="flex items-center text-sm text-neutral-500 mb-3 gap-4">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            <span>{new Date(relatedPost.publishDate).toLocaleDateString()}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            <span>{relatedPost.readingTime} min read</span>
                          </div>
                        </div>
                        <h3 className="text-lg font-bold text-neutral-900 mb-2 group-hover:text-primary-700 transition-colors leading-tight">
                          {relatedPost.title}
                        </h3>
                        <p className="text-neutral-600 text-sm line-clamp-3 leading-relaxed">{relatedPost.excerpt}</p>
                      </div>
                    </div>
                  </Link>
                </article>
              ))}
            </div>
          </section>
        )}

        {/* CTA Section */}
        <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="bg-gradient-to-br from-primary-50/50 via-white to-neutral-50/30 rounded-3xl p-8 lg:p-12 text-center border border-neutral-100/50 shadow-lg">
            <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <ArrowRight className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-3xl font-bold text-neutral-900 mb-4">Ready to Grow Your Business?</h3>
            <p className="text-lg text-neutral-600 mb-8 max-w-2xl mx-auto leading-relaxed">
              If this article resonated with you, let’s discuss how I can help implement these strategies for your business.
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-primary-600 to-primary-500 text-white rounded-xl hover:shadow-lg transition-all duration-300 font-semibold"
            >
              Get Strategic Marketing Help
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </section>
      </div>
      </div>
      </div>
      <Footer />
    </React.Fragment>
  );
}
