#!/usr/bin/env node

/**
 * Sitemap PageSpeed Iterator
 * Automatically finds all pages from your sitemap and tests each one
 */

const https = require('https');
const { parseString } = require('xml2js');

function getBaseUrl() {
  const arg = process.argv.find(a => a.startsWith('--url='));
  const fromArg = arg ? arg.split('=')[1] : undefined;
  const url = (process.env.SITE_URL || process.env.BASE_URL || fromArg || 'https://www.ellieedwardsmarketing.com').trim();
  return url.replace(/\/+$/, '');
}

const SITE_URL = getBaseUrl();
const SITEMAP_URL = `${SITE_URL}/sitemap.xml`;

console.log('🗺️  Sitemap PageSpeed Iterator');
console.log('==================================================');
console.log(`📍 Site: ${SITE_URL}`);
console.log(`🗺️  Sitemap: ${SITEMAP_URL}`);
console.log('');

// Fetch sitemap and extract URLs
async function getSitemapUrls() {
  return new Promise((resolve, reject) => {
    console.log('📥 Fetching sitemap...');
    
    const token = (process.env.VERCEL_PROTECTION_BYPASS || process.env.PROTECTION_BYPASS || (process.argv.find(a => a.startsWith('--token=')) || '').split('=')[1]) || '';
    const su = new URL(SITEMAP_URL);
    const opts = {
      protocol: su.protocol,
      hostname: su.hostname,
      port: su.port || undefined,
      path: su.pathname + (su.search || ''),
      headers: {
        'User-Agent': 'SitemapSpeedTest/1.0 (+https://github.com/rhodes911)'
      }
    };
    if (token) opts.headers['x-vercel-protection-bypass'] = token;

    https.get(opts, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        console.log('✅ Sitemap downloaded');
        
        // Parse XML to extract URLs
        parseString(data, (err, result) => {
          if (err) {
            // If XML parsing fails, try to extract URLs manually
            console.log('⚠️  XML parsing failed, trying manual extraction...');
            const urls = extractUrlsManually(data);
            resolve(urls);
            return;
          }
          
          try {
            let urls = result.urlset.url.map(item => item.loc[0]);
            
            // Fix URLs if they're pointing to Vercel instead of actual domain
            urls = urls.map(url => {
              if (url.includes('vercel.com/jamies-projects-79ee6a8a/ellie-edwards-marketing-leadgen-site')) {
                // Convert Vercel URL to actual domain
                return url.replace(
                  'https://vercel.com/jamies-projects-79ee6a8a/ellie-edwards-marketing-leadgen-site',
                  SITE_URL
                );
              }
              return url;
            });
            
            console.log(`🔍 Found ${urls.length} URLs in sitemap (converted to ${SITE_URL})`);
            resolve(urls);
          } catch (parseError) {
            console.log('⚠️  XML structure parsing failed, trying manual extraction...');
            const urls = extractUrlsManually(data);
            resolve(urls);
          }
        });
      });
    }).on('error', (err) => {
      console.log('❌ Failed to fetch sitemap, using default pages...');
      // Fallback to known pages
      const defaultPages = [
        `${SITE_URL}`,
        `${SITE_URL}/about`,
        `${SITE_URL}/contact`,
        `${SITE_URL}/services`,
        `${SITE_URL}/services/brand-strategy`,
        `${SITE_URL}/services/content-marketing`,
        `${SITE_URL}/services/digital-campaigns`,
        `${SITE_URL}/services/email-marketing`,
        `${SITE_URL}/services/lead-generation`,
        `${SITE_URL}/services/ppc`,
        `${SITE_URL}/services/seo`,
        `${SITE_URL}/services/social-media`,
        `${SITE_URL}/services/website-design`,
        `${SITE_URL}/case-studies`
      ];
      resolve(defaultPages);
    });
  });
}

// Manual URL extraction as fallback
function extractUrlsManually(xmlData) {
  const urlMatches = xmlData.match(/<loc>(.*?)<\/loc>/g);
  if (urlMatches) {
    let urls = urlMatches.map(match => match.replace(/<\/?loc>/g, ''));
    
    // Fix URLs if they're pointing to Vercel instead of actual domain
    urls = urls.map(url => {
      if (url.includes('vercel.com/jamies-projects-79ee6a8a/ellie-edwards-marketing-leadgen-site')) {
        return url.replace(
          'https://vercel.com/jamies-projects-79ee6a8a/ellie-edwards-marketing-leadgen-site',
          SITE_URL
        );
      }
      return url;
    });
    
    return urls;
  }
  
  // If no URLs found, return default pages
  return [
    `${SITE_URL}`,
    `${SITE_URL}/about`,
    `${SITE_URL}/contact`,
    `${SITE_URL}/services`,
    `${SITE_URL}/case-studies`
  ];
}

// Simple speed test for each page
async function testPageSpeed(url) {
  return new Promise((resolve) => {
    const startTime = Date.now();
    
    console.log(`🔍 Testing: ${url.replace(SITE_URL, '') || '/'}`);
    
    const token = (process.env.VERCEL_PROTECTION_BYPASS || process.env.PROTECTION_BYPASS || (process.argv.find(a => a.startsWith('--token=')) || '').split('=')[1]) || '';
    const u = new URL(url);
    const opts = {
      protocol: u.protocol,
      hostname: u.hostname,
      port: u.port || undefined,
      path: u.pathname + (u.search || ''),
      headers: {
        'User-Agent': 'SitemapSpeedTest/1.0 (+https://github.com/rhodes911)'
      }
    };
    if (token) opts.headers['x-vercel-protection-bypass'] = token;

    https.get(opts, (res) => {
      const loadTime = Date.now() - startTime;
      const pageName = url.replace(SITE_URL, '') || 'Home';
      
      let status = '🚀 Excellent';
      if (loadTime > 1000) status = '✅ Good';
      if (loadTime > 3000) status = '⚠️  Slow';
      if (loadTime > 5000) status = '❌ Very Slow';
      
      resolve({
        url,
        pageName,
        loadTime,
        status,
        statusCode: res.statusCode,
        success: res.statusCode === 200,
        error: res.statusCode !== 200 ? `${res.statusCode} ${res.statusMessage}` : undefined
      });
    }).on('error', (err) => {
      resolve({
        url,
        pageName: url.replace(SITE_URL, '') || 'Home',
        loadTime: null,
        status: '❌ Error',
        statusCode: null,
        success: false,
        error: err.message
      });
    });
  });
}

// Test all pages and show results
async function testAllPages() {
  try {
    const urls = await getSitemapUrls();
    console.log('\n🚀 Starting speed tests...\n');
    
    const results = [];
    
    // Test each page
    for (const url of urls) {
      const result = await testPageSpeed(url);
      results.push(result);
      
      // Show result immediately
      console.log(`   ${result.status} ${result.pageName} (${result.loadTime}ms)`);
      
      // Small delay between requests
      await new Promise(resolve => setTimeout(resolve, 500));
    }
    
    // Show summary
    console.log('\n📊 SUMMARY REPORT');
    console.log('==================================================');
    
    const successful = results.filter(r => r.success);
    const failed = results.filter(r => !r.success);
    
    console.log(`✅ Successful tests: ${successful.length}`);
    console.log(`❌ Failed tests: ${failed.length}`);
    
    if (successful.length > 0) {
      const avgLoadTime = Math.round(
        successful.reduce((sum, r) => sum + r.loadTime, 0) / successful.length
      );
      
      const fastest = successful.reduce((min, r) => r.loadTime < min.loadTime ? r : min);
      const slowest = successful.reduce((max, r) => r.loadTime > max.loadTime ? r : max);
      
      console.log(`⚡ Average load time: ${avgLoadTime}ms`);
      console.log(`🏆 Fastest page: ${fastest.pageName} (${fastest.loadTime}ms)`);
      console.log(`🐌 Slowest page: ${slowest.pageName} (${slowest.loadTime}ms)`);
    }
    
    if (failed.length > 0) {
      console.log('\n❌ Failed Pages:');
      failed.forEach(f => {
        console.log(`   ${f.pageName}: ${f.error || 'Unknown error'}`);
      });
    }
    
    console.log('\n💡 For detailed PageSpeed Insights:');
    console.log('   Go to: https://pagespeed.web.dev/');
    console.log('   Test each page individually for full scores');
    
    // Save results
    const timestamp = new Date().toISOString().split('T')[0];
    const fs = require('fs');
    const filename = `sitemap-speed-test-${timestamp}.json`;
    
    fs.writeFileSync(filename, JSON.stringify({
      testDate: new Date().toISOString(),
      siteUrl: SITE_URL,
      totalPages: urls.length,
      successful: successful.length,
      failed: failed.length,
      averageLoadTime: successful.length > 0 ? Math.round(
        successful.reduce((sum, r) => sum + r.loadTime, 0) / successful.length
      ) : null,
      results
    }, null, 2));
    
    console.log(`\n💾 Results saved to: ${filename}`);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

// Check if xml2js is available, if not provide alternative
try {
  require('xml2js');
} catch (e) {
  console.log('📦 Installing xml2js for sitemap parsing...');
  console.log('Run: npm install xml2js');
  console.log('Or the script will use manual URL extraction as fallback.\n');
}

// Run the test
testAllPages();
