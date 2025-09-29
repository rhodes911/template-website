import { MetadataRoute } from 'next'
import { SITE_URL, IS_PROD } from '@/lib/seo'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: IS_PROD
      ? {
          userAgent: '*',
          allow: '/',
          disallow: [
            '/admin/',
            '/api/',
            '/_next/',
            '/.well-known/',
            '/private/',
          ],
        }
      : {
          userAgent: '*',
          allow: '',
          disallow: '/',
        },
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL.replace(/^https?:\/\//, ''),
  }
}
