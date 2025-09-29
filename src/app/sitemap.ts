import { MetadataRoute } from 'next'
import { getBlogPosts, getAllCategories } from '@/lib/blog'
import { getServices } from '@/lib/server/services'
import { getCaseStudies } from '@/lib/content'
import { SITE_URL } from '@/lib/seo'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = SITE_URL
  
  // Static pages
  const staticPages = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 1,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/services`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/case-studies`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/faq`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    },
  ]

  // Service pages (from content)
  const services = getServices()
  const servicePages = services.map(svc => ({
    url: `${baseUrl}/services/${svc.serviceId}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.9,
  }))

  // Case study pages (from content)
  const caseStudies = getCaseStudies()
  const caseStudyPages = caseStudies.map(study => ({
    url: `${baseUrl}/case-studies/${study.id}`,
    lastModified: new Date(study.date || Date.now()),
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }))

  // Blog posts
  const blogPosts = getBlogPosts()
  const blogPages = blogPosts.map(post => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: new Date(post.lastModified || post.publishDate),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }))

  // Blog categories
  const categories = getAllCategories()
  const categoryPages = categories.map(categoryName => {
    const slug = categoryName.toLowerCase().replace(/\s+/g, '-')
    // Compute latest modification date among posts in this category
    const postsInCategory = blogPosts.filter(p =>
      p.categories?.some(cat => cat.toLowerCase().replace(/\s+/g, '-') === slug)
    )
    const mostRecent = postsInCategory.length
      ? new Date(
          Math.max(
            ...postsInCategory.map(p => new Date(p.lastModified || p.publishDate).getTime())
          )
        )
      : new Date()
    return {
      url: `${baseUrl}/blog/category/${slug}`,
      lastModified: mostRecent,
      changeFrequency: 'weekly' as const,
      priority: 0.6 as const,
    }
  })

  return [...staticPages, ...servicePages, ...caseStudyPages, ...blogPages, ...categoryPages]
}
