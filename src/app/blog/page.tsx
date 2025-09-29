import Link from 'next/link';
import Image from 'next/image';
import { Metadata } from 'next';
import { getBlogPosts, BlogPost } from '@/lib/blog';
import { Calendar, Clock, Tag, ArrowRight, CheckCircle, Star, Send } from 'lucide-react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import Breadcrumbs from '@/components/Breadcrumbs';
import { getPageSeo, buildMetadataFromSeo } from '@/lib/pageSeo';

const blogSeo = getPageSeo('blog')
export const metadata: Metadata = buildMetadataFromSeo(
  { 
    slug: 'blog', 
    pageType: 'listing',
    contentData: {
      title: 'Marketing Blog',
      description: 'Expert marketing insights, strategies, and tips to grow your business. Learn from proven case studies and industry expertise.'
    }
  }, 
  blogSeo
)

export default function BlogPage() {
  const posts = getBlogPosts();
  const featuredPosts = posts.filter((post: BlogPost) => post.featured);
  const recentPosts = posts.filter((post: BlogPost) => !post.featured).slice(0, 6);

  return (
    <>
      <Navigation />
      <div className="min-h-screen bg-gradient-to-br from-white via-primary-50/10 to-neutral-50/30">
        {/* Hero Section */}
        <section className="pt-24 pb-16 bg-gradient-to-br from-primary-50/30 via-white to-neutral-50/50 relative overflow-hidden">
          {/* Background decorative elements */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute -top-20 -left-20 w-60 h-60 sm:w-80 sm:h-80 bg-gradient-to-br from-primary-200/20 to-primary-400/10 rounded-full blur-3xl"></div>
            <div className="absolute top-1/2 -right-20 w-40 h-40 sm:w-60 sm:h-60 bg-gradient-to-tr from-neutral-200/30 to-neutral-400/10 rounded-full blur-2xl"></div>
          </div>
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="mb-8">
              <Breadcrumbs 
                items={[
                  { label: 'Home', href: '/' },
                  { label: 'Blog' },
                ]}
              />
            </div>
            
            <div className="text-center">
              <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm border border-primary-200/50 rounded-full px-4 py-2 mb-6">
                <Tag className="w-4 h-4 text-primary-600" />
                <span className="text-sm font-medium text-primary-700">Marketing Insights</span>
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-heading font-bold text-neutral-900 mb-6">
                Expert Marketing 
                <span className="block bg-gradient-to-r from-primary-600 to-primary-500 bg-clip-text text-transparent">
                  Insights & Strategies
                </span>
              </h1>
              <p className="text-lg sm:text-xl text-neutral-600 max-w-3xl mx-auto mb-8 leading-relaxed">
                Proven strategies, actionable insights, and real case studies to grow your business. Learn from 10+ years of marketing expertise and 200+ successful client campaigns.
              </p>
              
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8 text-sm text-neutral-600">
                {[`${posts.length} Expert Articles`, 'Weekly Updates', 'Real Case Studies'].map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-primary-600" />
                    <span className="font-medium">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
          {/* Featured Posts */}
          {featuredPosts.length > 0 && (
            <section className="mb-16">
              <div className="flex items-center justify-center gap-3 mb-8">
                <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center">
                  <Star className="w-4 h-4 text-white" />
                </div>
                <h2 className="text-3xl font-bold text-neutral-900">Blog Articles</h2>
              </div>
              <div className="flex flex-wrap justify-center gap-8 max-w-5xl mx-auto">
                {featuredPosts.map((post: BlogPost, index: number) => (
                  <article key={post.slug} className="group w-full md:w-[calc(50%-1rem)] lg:w-[calc(33.333%-1.34rem)] max-w-md">
                    <Link href={`/blog/${post.slug}`}>
                      <div className={`
                        bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border border-neutral-100/50
                        hover:-translate-y-2 hover:scale-[1.02] cursor-pointer h-full
                        ${index % 2 === 0 ? 'hover:bg-gradient-to-br hover:from-primary-50/30 hover:to-white' : 'hover:bg-gradient-to-br hover:from-neutral-50/50 hover:to-white'}
                      `}>
                        <div className="relative h-48">
                          <Image
                            src={post.featuredImage}
                            alt={post.alt}
                            fill
                            className="object-cover"
                          />
                          <div className="absolute top-4 left-4">
                            <div className="bg-gradient-to-r from-primary-500 to-primary-600 text-white px-3 py-1 rounded-full text-sm font-medium shadow-lg">
                              Featured
                            </div>
                          </div>
                        </div>
                        <div className="p-6">
                          <div className="flex items-center text-sm text-neutral-500 mb-3 gap-4">
                            <div className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              <span>{new Date(post.publishDate).toLocaleDateString()}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              <span>{post.readingTime} min read</span>
                            </div>
                          </div>
                          <h3 className="text-xl font-bold text-neutral-900 mb-3 group-hover:text-primary-700 transition-colors duration-300 leading-tight">
                            {post.title}
                          </h3>
                          <p className="text-neutral-600 mb-4 line-clamp-3 leading-relaxed">{post.excerpt}</p>
                          <div className="flex items-center justify-between pt-4 border-t border-neutral-100">
                            <div className="flex items-center gap-2">
                              <div className="relative w-8 h-8">
                                <Image
                                  src={post.author.avatar}
                                  alt={post.author.name}
                                  fill
                                  className="rounded-full object-cover"
                                />
                              </div>
                              <span className="text-sm font-medium text-neutral-700">{post.author.name}</span>
                            </div>
                            <div className="w-8 h-8 bg-primary-100 group-hover:bg-primary-600 rounded-full flex items-center justify-center transition-all duration-300">
                              <ArrowRight className="w-4 h-4 text-primary-600 group-hover:text-white transition-colors duration-300" />
                            </div>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </article>
                ))}
              </div>
            </section>
          )}

          {/* Recent Posts */}
          <section>
            <div className="flex items-center justify-center gap-3 mb-8">
              <div className="w-8 h-8 bg-gradient-to-br from-neutral-600 to-neutral-700 rounded-xl flex items-center justify-center">
                <Tag className="w-4 h-4 text-white" />
              </div>
              <h3 className="text-3xl font-bold text-neutral-900">Latest Articles</h3>
            </div>
            
            {recentPosts.length === 0 && featuredPosts.length === 0 ? (
              <div className="text-center py-16">
                <div className="max-w-md mx-auto">
                  <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-primary-100 to-primary-200 rounded-3xl flex items-center justify-center">
                    <Tag className="w-12 h-12 text-primary-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-neutral-900 mb-4">Coming Soon!</h3>
                  <p className="text-neutral-600 mb-6 leading-relaxed">
                    I’m working on some amazing content to help you grow your business. 
                    Check back soon for expert marketing insights and strategies.
                  </p>
                  <Link 
                    href="/contact" 
                    className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary-600 to-primary-500 text-white rounded-xl hover:shadow-lg transition-all duration-300 font-semibold"
                  >
                    Get Notified When I Publish
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            ) : (
              <div className="flex flex-wrap justify-center gap-8 max-w-5xl mx-auto">
                {recentPosts.map((post: BlogPost, index: number) => (
                  <article key={post.slug} className="group w-full md:w-[calc(50%-1rem)] lg:w-[calc(33.333%-1.34rem)] max-w-md">
                    <Link href={`/blog/${post.slug}`}>
                      <div className={`
                        bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border border-neutral-100/50
                        hover:-translate-y-2 hover:scale-[1.02] cursor-pointer h-full
                        ${index % 2 === 0 ? 'hover:bg-gradient-to-br hover:from-primary-50/30 hover:to-white' : 'hover:bg-gradient-to-br hover:from-neutral-50/50 hover:to-white'}
                      `}>
                        <div className="relative h-48">
                          <Image
                            src={post.featuredImage}
                            alt={post.alt}
                            fill
                            className="object-cover"
                          />
                          {post.categories && post.categories.length > 0 && (
                            <div className="absolute top-4 left-4">
                              <div className="bg-white/90 backdrop-blur-sm text-neutral-800 px-3 py-1 rounded-full text-sm font-medium shadow-sm">
                                {post.categories[0]}
                              </div>
                            </div>
                          )}
                        </div>
                        <div className="p-6">
                          <div className="flex items-center text-sm text-neutral-500 mb-3 gap-4">
                            <div className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              <span>{new Date(post.publishDate).toLocaleDateString()}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              <span>{post.readingTime} min read</span>
                            </div>
                          </div>
                          <h4 className="text-xl font-bold text-neutral-900 mb-3 group-hover:text-primary-700 transition-colors duration-300 leading-tight">
                            {post.title}
                          </h4>
                          <p className="text-neutral-600 mb-4 line-clamp-3 leading-relaxed">{post.excerpt}</p>
                          <div className="flex items-center justify-between pt-4 border-t border-neutral-100">
                            <div className="flex items-center gap-2">
                              <div className="relative w-8 h-8">
                                <Image
                                  src={post.author.avatar}
                                  alt={post.author.name}
                                  fill
                                  className="rounded-full object-cover"
                                />
                              </div>
                              <span className="text-sm font-medium text-neutral-700">{post.author.name}</span>
                            </div>
                            <div className="w-8 h-8 bg-primary-100 group-hover:bg-primary-600 rounded-full flex items-center justify-center transition-all duration-300">
                              <ArrowRight className="w-4 h-4 text-primary-600 group-hover:text-white transition-colors duration-300" />
                            </div>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </article>
                ))}
              </div>
            )}
          </section>
          
          {/* Topic Tags Section */}
          <section className="pt-8 pb-16">
            <div className="flex items-center justify-center gap-3 mb-8">
              <div className="w-8 h-8 bg-gradient-to-br from-primary-800/50 to-primary-700/50 rounded-xl flex items-center justify-center">
                <Tag className="w-4 h-4 text-white" />
              </div>
              <h5 className="text-2xl font-bold text-neutral-900">Explore by Topic</h5>
            </div>
            
            <div className="flex flex-wrap justify-center gap-3 max-w-3xl mx-auto">
              {['Content Marketing', 'SEO', 'Lead Generation', 'Email Marketing', 'Social Media', 'PPC', 'Branding', 'Analytics', 'Strategy'].map((tag, idx) => (
                <Link 
                  key={idx}
                  href={`/blog/tag/${tag.toLowerCase().replace(/\s+/g, '-')}`}
                  className="bg-white px-4 py-2 rounded-full border border-neutral-200 hover:border-primary-300 hover:bg-primary-50/50 transition-all duration-300 text-neutral-700 hover:text-primary-700 text-sm font-medium"
                >
                  {tag}
                </Link>
              ))}
            </div>
          </section>
          
          {/* Newsletter CTA */}
          <section className="pt-8 pb-16 bg-gradient-to-br from-primary-50 to-white rounded-3xl border border-primary-100/50 overflow-hidden relative">
            {/* Background decorative elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary-200/20 rounded-full blur-2xl"></div>
              <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-primary-300/10 rounded-full blur-3xl"></div>
            </div>
            
            <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center relative z-10">
              <div className="flex items-center justify-center gap-3 mb-6">
                <div className="w-8 h-8 bg-gradient-to-br from-primary-600 to-primary-500 rounded-full flex items-center justify-center">
                  <Send className="w-4 h-4 text-white" />
                </div>
                <h5 className="text-2xl font-bold text-neutral-900">Stay Updated with Marketing Insights</h5>
              </div>
              
              <p className="text-lg text-neutral-600 mb-8 max-w-2xl mx-auto">
                Get the latest marketing strategies and insights delivered to your inbox. 
                Join hundreds of marketers who read my weekly newsletter for actionable tips.
              </p>
              
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto">
                <Link 
                  href="/contact" 
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-primary-600 to-primary-500 text-white rounded-xl hover:shadow-lg transition-all duration-300 font-semibold"
                >
                  Subscribe to Newsletter
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </section>
        </div>
      </div>
      <Footer />
    </>
  );
}
