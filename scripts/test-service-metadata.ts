import assert from 'node:assert'
import { buildMetadataFromSeo, getPageSeo } from '@/lib/pageSeo'
import { getService } from '@/lib/server/services'

function run() {
  const svc = getService('seo')
  assert.ok(svc, 'SEO service should exist')
  
  // Use our standardized metadata generation
  const seo = getPageSeo('services') // services use the general services seo
  const md = buildMetadataFromSeo(
    { 
      slug: 'seo', 
      pageType: 'service',
      contentData: svc
    }, 
    seo
  )
  assert.ok(md.title && md.description, 'service metadata should include title and description')
  const og = md.openGraph as { url?: string } | undefined
  assert.ok(og && og.url && /^https?:\/\//.test(og.url), 'service og.url should be absolute')
}

run()
console.log('PASS test-service-metadata.ts')
