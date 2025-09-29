#!/usr/bin/env node

/**
 * View Latest Sitemap Test Results
 * Shows the most recent test results in a nice format
 */

const fs = require('fs');
const path = require('path');

// Find the most recent results file
function findLatestResultsFile() {
  const files = fs.readdirSync('.')
    .filter(file => file.startsWith('sitemap-speed-test-') && file.endsWith('.json'))
    .sort()
    .reverse();
  
  return files[0] || null;
}

// Display results in a nice table format
function displayResults() {
  const latestFile = findLatestResultsFile();
  
  if (!latestFile) {
    console.log('❌ No test results found. Run "node sitemap-speed-test.js" first.');
    return;
  }
  
  console.log('📊 LATEST SITEMAP SPEED TEST RESULTS');
  console.log('=' * 60);
  
  try {
    const data = JSON.parse(fs.readFileSync(latestFile, 'utf8'));
    
    console.log(`🗓️  Test Date: ${new Date(data.testDate).toLocaleString()}`);
    console.log(`🌐 Site: ${data.siteUrl}`);
    console.log(`📄 Total Pages: ${data.totalPages}`);
    console.log(`✅ Successful: ${data.successful}`);
    console.log(`❌ Failed: ${data.failed}`);
    console.log(`⚡ Average Load Time: ${data.averageLoadTime}ms`);
    console.log('');
    
    // Show successful pages table
    const successful = data.results.filter(r => r.success);
    if (successful.length > 0) {
      console.log('📈 SUCCESSFUL PAGES:');
      console.log('─'.repeat(60));
      console.log('Page                              Load Time    Status');
      console.log('─'.repeat(60));
      
      successful.forEach(result => {
        const pageName = result.pageName === 'Home' ? '/' : result.pageName;
        const name = pageName.padEnd(32);
        const time = `${result.loadTime}ms`.padEnd(11);
        const status = result.loadTime < 1000 ? '🚀 Excellent' : 
                      result.loadTime < 3000 ? '✅ Good' : '⚠️  Slow';
        console.log(`${name} ${time} ${status}`);
      });
    }
    
    // Show failed pages if any
    const failed = data.results.filter(r => !r.success);
    if (failed.length > 0) {
      console.log('\n❌ FAILED PAGES:');
      console.log('─'.repeat(40));
      failed.forEach(result => {
        console.log(`${result.pageName}: ${result.error || 'Unknown error'}`);
      });
    }
    
    // Show speed breakdown
    console.log('\n⚡ SPEED BREAKDOWN:');
    console.log('─'.repeat(30));
    const excellent = successful.filter(r => r.loadTime < 1000).length;
    const good = successful.filter(r => r.loadTime >= 1000 && r.loadTime < 3000).length;
    const slow = successful.filter(r => r.loadTime >= 3000).length;
    
    console.log(`🚀 Excellent (< 1s):  ${excellent} pages`);
    console.log(`✅ Good (1-3s):       ${good} pages`);
    console.log(`⚠️  Slow (> 3s):       ${slow} pages`);
    
    // Show fastest and slowest
    if (successful.length > 0) {
      const fastest = successful.reduce((min, r) => r.loadTime < min.loadTime ? r : min);
      const slowest = successful.reduce((max, r) => r.loadTime > max.loadTime ? r : max);
      
      console.log('\n🏆 PERFORMANCE HIGHLIGHTS:');
      console.log('─'.repeat(35));
      console.log(`Fastest: ${fastest.pageName} (${fastest.loadTime}ms)`);
      console.log(`Slowest: ${slowest.pageName} (${slowest.loadTime}ms)`);
    }
    
    console.log('\n💡 NEXT STEPS:');
    console.log('• For detailed PageSpeed scores: https://pagespeed.web.dev/');
    console.log('• Re-run test: node sitemap-speed-test.js');
    console.log('• View this summary: node view-results.js');
    
  } catch (error) {
    console.error('❌ Error reading results file:', error.message);
  }
}

displayResults();
