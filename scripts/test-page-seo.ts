import assert from 'node:assert'
import { getPageSeo, buildMetadataFromSeo } from '@/lib/pageSeo'

function check(slug: string) {
  const seo = getPageSeo(slug)
  assert.ok(seo, `seo frontmatter should exist for ${slug}`)
  const md = buildMetadataFromSeo(
    { 
      slug, 
      pageType: 'listing' // default for test purposes
    }, 
    seo
  )
  assert.ok(md.title && md.description, `${slug} metadata should have title and description`)
  const og = md.openGraph as { url?: string } | undefined
  assert.ok(og && og.url, `${slug} openGraph should include url`)
}

;['services','blog','case-studies','contact','faq'].forEach(check)

console.log('PASS test-page-seo.ts')