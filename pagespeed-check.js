#!/usr/bin/env node

/**
 * Quick PageSpeed Insights Checker
 * Uses Google PageSpeed Insights API
 * Run: node pagespeed-check.js
 */

const https = require('https');
const fs = require('fs');

// Configuration
const SITE_URL = 'https://www.ellieedwardsmarketing.com';
const PAGES_TO_TEST = [
  '',
  '/about',
  '/contact',
  '/services',
  '/services/brand-strategy',
  '/services/content-marketing',
  '/case-studies'
];

// PageSpeed Insights API (no key needed for basic usage)
const PSI_API_URL = 'https://www.googleapis.com/pagespeedonline/v5/runPagespeed';

function makeRequest(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (error) {
          reject(error);
        }
      });
    }).on('error', reject);
  });
}

async function checkPageSpeed(pageUrl, strategy = 'mobile') {
  const apiUrl = `${PSI_API_URL}?url=${encodeURIComponent(pageUrl)}&strategy=${strategy}&category=performance&category=accessibility&category=best-practices&category=seo`;
  
  console.log(`🔍 Checking: ${pageUrl} (${strategy})`);
  
  try {
    const response = await makeRequest(apiUrl);
    
    if (response.error) {
      console.error(`❌ Error: ${response.error.message}`);
      return null;
    }
    
    const lighthouse = response.lighthouseResult;
    const categories = lighthouse.categories;
    const audits = lighthouse.audits;
    
    return {
      url: pageUrl,
      strategy,
      scores: {
        performance: Math.round(categories.performance.score * 100),
        accessibility: Math.round(categories.accessibility.score * 100),
        bestPractices: Math.round(categories['best-practices'].score * 100),
        seo: Math.round(categories.seo.score * 100)
      },
      metrics: {
        fcp: audits['first-contentful-paint']?.displayValue || 'N/A',
        lcp: audits['largest-contentful-paint']?.displayValue || 'N/A',
        tbt: audits['total-blocking-time']?.displayValue || 'N/A',
        cls: audits['cumulative-layout-shift']?.displayValue || 'N/A',
        si: audits['speed-index']?.displayValue || 'N/A'
      },
      opportunities: audits['unused-javascript'] ? [
        {
          title: 'Remove unused JavaScript',
          savings: audits['unused-javascript'].details?.overallSavingsMs || 0
        }
      ] : []
    };
  } catch (error) {
    console.error(`❌ Failed to check ${pageUrl}:`, error.message);
    return null;
  }
}

function displayResults(results) {
  console.log('\n📊 PAGESPEED INSIGHTS RESULTS');
  console.log('=' * 60);
  
  const validResults = results.filter(r => r !== null);
  
  if (validResults.length === 0) {
    console.log('❌ No successful results');
    return;
  }
  
  // Display individual results
  validResults.forEach(result => {
    const pageName = result.url.replace(SITE_URL, '') || 'Home';
    console.log(`\n🔍 ${pageName} (${result.strategy})`);
    console.log(`   Performance: ${result.scores.performance}/100`);
    console.log(`   Accessibility: ${result.scores.accessibility}/100`);
    console.log(`   Best Practices: ${result.scores.bestPractices}/100`);
    console.log(`   SEO: ${result.scores.seo}/100`);
    console.log(`   Core Web Vitals: FCP=${result.metrics.fcp}, LCP=${result.metrics.lcp}, CLS=${result.metrics.cls}`);
  });
  
  // Calculate averages
  const mobileResults = validResults.filter(r => r.strategy === 'mobile');
  const desktopResults = validResults.filter(r => r.strategy === 'desktop');
  
  function calculateAverage(results) {
    if (results.length === 0) return null;
    
    const totals = results.reduce((acc, result) => {
      acc.performance += result.scores.performance;
      acc.accessibility += result.scores.accessibility;
      acc.bestPractices += result.scores.bestPractices;
      acc.seo += result.scores.seo;
      return acc;
    }, { performance: 0, accessibility: 0, bestPractices: 0, seo: 0 });
    
    return {
      performance: Math.round(totals.performance / results.length),
      accessibility: Math.round(totals.accessibility / results.length),
      bestPractices: Math.round(totals.bestPractices / results.length),
      seo: Math.round(totals.seo / results.length)
    };
  }
  
  if (mobileResults.length > 0) {
    const mobileAvg = calculateAverage(mobileResults);
    console.log('\n📱 MOBILE AVERAGES');
    console.log(`   Performance: ${mobileAvg.performance}/100`);
    console.log(`   Accessibility: ${mobileAvg.accessibility}/100`);
    console.log(`   Best Practices: ${mobileAvg.bestPractices}/100`);
    console.log(`   SEO: ${mobileAvg.seo}/100`);
  }
  
  if (desktopResults.length > 0) {
    const desktopAvg = calculateAverage(desktopResults);
    console.log('\n💻 DESKTOP AVERAGES');
    console.log(`   Performance: ${desktopAvg.performance}/100`);
    console.log(`   Accessibility: ${desktopAvg.accessibility}/100`);
    console.log(`   Best Practices: ${desktopAvg.bestPractices}/100`);
    console.log(`   SEO: ${desktopAvg.seo}/100`);
  }
}

function saveResultsToFile(results) {
  const timestamp = new Date().toISOString().split('T')[0];
  const filename = `pagespeed-results-${timestamp}.json`;
  
  fs.writeFileSync(filename, JSON.stringify(results, null, 2));
  console.log(`\n💾 Results saved to: ${filename}`);
}

async function main() {
  console.log('🚀 Starting PageSpeed Insights Check');
  console.log(`🌐 Site: ${SITE_URL}`);
  console.log(`📄 Pages: ${PAGES_TO_TEST.length}`);
  
  const allResults = [];
  
  // Test mobile first (as per your PageSpeed link)
  for (const page of PAGES_TO_TEST) {
    const fullUrl = `${SITE_URL}${page}`;
    
    // Mobile check
    const mobileResult = await checkPageSpeed(fullUrl, 'mobile');
    if (mobileResult) allResults.push(mobileResult);
    
    // Small delay to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Desktop check
    const desktopResult = await checkPageSpeed(fullUrl, 'desktop');
    if (desktopResult) allResults.push(desktopResult);
    
    // Delay between pages
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  
  displayResults(allResults);
  saveResultsToFile(allResults);
  
  console.log('\n✅ PageSpeed check complete!');
}

// Run the check
main().catch(console.error);
