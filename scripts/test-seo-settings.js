// Quick runtime smoke tests for settings-driven SEO utilities
const assert = require('assert')

function run() {
  const seo = require('../dist/src/lib/seo')
  const settings = require('../dist/src/lib/settings')

  const biz = settings.getBusinessSettings()
  assert.ok(biz, 'Business settings should load')

  assert.ok(seo.SITE_URL && seo.SITE_URL.startsWith('http'), 'SITE_URL should be absolute')
  assert.ok(/^https?:\/\/.+/.test(seo.canonical('/contact')), 'canonical should build absolute URLs')

  const org = seo.organizationJsonLd()
  assert.equal(org['@type'], 'Organization')
  assert.ok(org.name && org.url, 'Organization JSON-LD should include name and url')

  const web = seo.websiteJsonLd()
  assert.equal(web['@type'], 'WebSite')

  const lb = seo.localBusinessJsonLd()
  assert.equal(lb['@type'], 'LocalBusiness')
  assert.ok(lb.address, 'LocalBusiness should include address')

  console.log('PASS test-seo-settings.js')
}

try { run() } catch (e) { console.error(e); process.exit(1) }
