import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { getBlogPostsByCategory, getAllCategories } from '@/lib/blog';
import { buildMetadataFromSeo } from '@/lib/pageSeo';
import { Calendar, Clock, ArrowRight, Tag } from 'lucide-react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import Breadcrumbs from '@/components/Breadcrumbs';

interface CategoryPageProps {
  params: {
    category: string;
  };
}

export async function generateStaticParams() {
  const categories = getAllCategories();
  return categories.map((category) => ({
    category: category.toLowerCase().replace(/\s+/g, '-'),
  }));
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const categoryName = params.category.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  const posts = getBlogPostsByCategory(params.category);
  
  if (posts.length === 0) {
    return {
      title: 'Category Not Found',
    };
  }

  return buildMetadataFromSeo(
    { 
      slug: `blog/category/${params.category}`, 
      pageType: 'listing',
      contentData: {
        title: `${categoryName} Articles`,
        description: `Explore ${posts.length} expert articles about ${categoryName.toLowerCase()}. Learn proven strategies and insights to grow your business.`,
        keywords: [categoryName.toLowerCase(), 'marketing tips', 'digital marketing', 'business growth']
      }
    }
  );
}

export default function CategoryPage({ params }: CategoryPageProps) {
  const posts = getBlogPostsByCategory(params.category);
  const categoryName = params.category.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  
  if (posts.length === 0) {
    notFound();
  }

  return (
    <>
      <Navigation />
      <div className="min-h-screen bg-gradient-to-br from-white via-primary-50/10 to-neutral-50/30">
        {/* Navigation */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-8">
          <Breadcrumbs 
            items={[
              { label: 'Home', href: '/' },
              { label: 'Blog', href: '/blog' },
              { label: categoryName },
            ]}
          />
        </div>

        {/* Category Header */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
          <div className="text-center">
            <div className="inline-flex items-center bg-primary-100 text-primary-700 px-4 py-2 rounded-full text-sm font-medium mb-4">
              <Tag className="w-4 h-4 mr-2" />
              Category
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-neutral-900 mb-6">
              {categoryName}
            </h1>
      {/* Accessible H2 to prevent H1 -> H3 jump while keeping exactly one H2 on the page.
        Include category to avoid sitewide duplicate H2 text. */}
      <h2 className="sr-only">Articles about {categoryName}</h2>
            <p className="text-xl text-neutral-600 max-w-3xl mx-auto mb-8 leading-relaxed">
              Discover {posts.length} expert article{posts.length !== 1 ? 's' : ''} about {categoryName.toLowerCase()}. 
              Learn proven strategies and actionable insights to grow your business.
            </p>
          </div>
        </section>

        {/* Articles Grid */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post, index) => (
              <article key={post.slug} className="group">
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
                      {post.featured && (
                        <div className="absolute top-4 left-4">
                          <div className="bg-gradient-to-r from-primary-500 to-primary-600 text-white px-3 py-1 rounded-full text-sm font-medium shadow-lg">
                            Featured
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

        {/* Other Categories */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 bg-gradient-to-br from-neutral-50/50 via-white to-primary-50/30">
          <h3 className="text-3xl font-bold text-neutral-900 mb-8 text-center">Explore Other Topics</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {getAllCategories()
              .filter(cat => cat.toLowerCase().replace(/\s+/g, '-') !== params.category)
              .map((category) => (
                <Link
                  key={category}
                  href={`/blog/category/${category.toLowerCase().replace(/\s+/g, '-')}`}
                  className="bg-white border border-neutral-200/50 rounded-xl px-4 py-3 text-center hover:shadow-lg hover:border-primary-300/50 hover:bg-primary-50/30 transition-all duration-300 group"
                >
                  <span className="text-neutral-700 group-hover:text-primary-700 font-medium transition-colors duration-300">
                    {category}
                  </span>
                </Link>
              ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="bg-gradient-to-br from-primary-50/50 via-white to-neutral-50/30 rounded-3xl p-8 lg:p-12 text-center border border-neutral-100/50 shadow-lg">
            <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Tag className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-3xl font-bold text-neutral-900 mb-4">Need Help with {categoryName}?</h3>
            <p className="text-lg text-neutral-600 mb-8 max-w-2xl mx-auto leading-relaxed">
              Ready to implement these strategies for your business? Let’s discuss how I can help you achieve your marketing goals.
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-primary-600 to-primary-500 text-white rounded-xl hover:shadow-lg transition-all duration-300 font-semibold"
            >
              Get Expert Help
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </section>
      </div>
      <Footer />
    </>
  );
}
