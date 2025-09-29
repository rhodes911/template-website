import assert from 'node:assert'
import { SITE_URL, canonical, organizationJsonLd, websiteJsonLd, localBusinessJsonLd } from '@/lib/seo'
import { getBusinessSettings } from '@/lib/settings'

function run() {
  const biz = getBusinessSettings()
  assert.ok(biz, 'Business settings should load')

  assert.ok(SITE_URL && SITE_URL.startsWith('http'), 'SITE_URL should be absolute')
  assert.ok(/^https?:\/\//.test(canonical('/contact')), 'canonical should build absolute URLs')

  const org = organizationJsonLd()
  assert.equal(org['@type'], 'Organization')
  assert.ok(org.name && org.url, 'Organization JSON-LD should include name and url')

  const web = websiteJsonLd()
  assert.equal(web['@type'], 'WebSite')

  const lb = localBusinessJsonLd()
  assert.equal(lb['@type'], 'LocalBusiness')
  assert.ok(lb.address, 'LocalBusiness should include address')

  console.log('PASS test-seo-settings.ts')
}

run()
