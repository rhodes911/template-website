#!/usr/bin/env node

/**
 * Comprehensive Performance Audit Script for VS Code
 * Run: node performance-audit.js
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Configuration
const SITE_URL = 'https://www.ellieedwardsmarketing.com';
const PAGES_TO_TEST = [
  '',
  '/about',
  '/contact',
  '/services',
  '/services/brand-strategy',
  '/services/content-marketing',
  '/services/digital-campaigns',
  '/services/email-marketing',
  '/case-studies'
];

const AUDIT_CONFIG = {
  mobile: {
    preset: 'perf',
    emulatedFormFactor: 'mobile',
    throttlingMethod: 'simulate',
    onlyCategories: ['performance', 'accessibility', 'best-practices', 'seo']
  },
  desktop: {
    preset: 'desktop',
    emulatedFormFactor: 'desktop',
    throttlingMethod: 'simulate',
    onlyCategories: ['performance', 'accessibility', 'best-practices', 'seo']
  }
};

console.log('🚀 Starting Comprehensive Performance Audit for Ellie Edwards Marketing');
console.log('=' * 80);

// Check if lighthouse is installed
function checkLighthouse() {
  try {
    execSync('npx lighthouse --version', { stdio: 'pipe' });
    console.log('✅ Lighthouse is available');
    return true;
  } catch (error) {
    console.log('📦 Installing Lighthouse...');
    try {
      execSync('npm install -g lighthouse', { stdio: 'inherit' });
      console.log('✅ Lighthouse installed successfully');
      return true;
    } catch (installError) {
      console.error('❌ Failed to install Lighthouse:', installError.message);
      return false;
    }
  }
}

// Run lighthouse audit for a specific page
function runLighthouseAudit(page, device = 'mobile') {
  const url = `${SITE_URL}${page}`;
  const outputDir = './performance-reports';
  
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const filename = `${device}-${page.replace(/\//g, '_') || 'home'}-${timestamp}`;
  const outputPath = path.join(outputDir, `${filename}.html`);
  const jsonPath = path.join(outputDir, `${filename}.json`);
  
  console.log(`\n🔍 Auditing: ${url} (${device})`);
  
  try {
    const config = AUDIT_CONFIG[device];
    let command = `npx lighthouse "${url}" --output=html,json --output-path="${outputPath.replace('.html', '')}"`;
    
    if (device === 'mobile') {
      command += ' --preset=perf --emulated-form-factor=mobile --throttling-method=simulate';
    } else {
      command += ' --preset=desktop --emulated-form-factor=desktop --throttling-method=simulate';
    }
    
    command += ' --only-categories=performance,accessibility,best-practices,seo';
    command += ' --chrome-flags="--headless --no-sandbox --disable-dev-shm-usage"';
    
    console.log(`Running: ${command}`);
    execSync(command, { stdio: 'inherit' });
    
    // Read and parse the JSON results
    const jsonResults = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
    return {
      url,
      device,
      scores: {
        performance: Math.round(jsonResults.categories.performance.score * 100),
        accessibility: Math.round(jsonResults.categories.accessibility.score * 100),
        bestPractices: Math.round(jsonResults.categories['best-practices'].score * 100),
        seo: Math.round(jsonResults.categories.seo.score * 100)
      },
      metrics: {
        fcp: jsonResults.audits['first-contentful-paint']?.displayValue || 'N/A',
        lcp: jsonResults.audits['largest-contentful-paint']?.displayValue || 'N/A',
        tbt: jsonResults.audits['total-blocking-time']?.displayValue || 'N/A',
        cls: jsonResults.audits['cumulative-layout-shift']?.displayValue || 'N/A',
        si: jsonResults.audits['speed-index']?.displayValue || 'N/A'
      },
      reportPath: outputPath
    };
  } catch (error) {
    console.error(`❌ Failed to audit ${url}:`, error.message);
    return null;
  }
}

// Generate summary report
function generateSummaryReport(results) {
  const summaryPath = './performance-reports/SUMMARY.md';
  let summary = `# Performance Audit Summary - ${new Date().toLocaleDateString()}\n\n`;
  summary += `**Site**: ${SITE_URL}\n`;
  summary += `**Pages Tested**: ${results.length}\n`;
  summary += `**Generated**: ${new Date().toLocaleString()}\n\n`;
  
  summary += `## 📊 Overall Scores\n\n`;
  summary += `| Page | Device | Performance | Accessibility | Best Practices | SEO | FCP | LCP | TBT | CLS |\n`;
  summary += `|------|--------|-------------|---------------|----------------|-----|-----|-----|-----|-----|\n`;
  
  let totalScores = { performance: 0, accessibility: 0, bestPractices: 0, seo: 0 };
  let count = 0;
  
  results.filter(r => r !== null).forEach(result => {
    const { url, device, scores, metrics } = result;
    const pageName = url.replace(SITE_URL, '') || '/';
    
    summary += `| ${pageName} | ${device} | ${scores.performance} | ${scores.accessibility} | ${scores.bestPractices} | ${scores.seo} | ${metrics.fcp} | ${metrics.lcp} | ${metrics.tbt} | ${metrics.cls} |\n`;
    
    totalScores.performance += scores.performance;
    totalScores.accessibility += scores.accessibility;
    totalScores.bestPractices += scores.bestPractices;
    totalScores.seo += scores.seo;
    count++;
  });
  
  if (count > 0) {
    const avg = {
      performance: Math.round(totalScores.performance / count),
      accessibility: Math.round(totalScores.accessibility / count),
      bestPractices: Math.round(totalScores.bestPractices / count),
      seo: Math.round(totalScores.seo / count)
    };
    
    summary += `\n## 🎯 Average Scores\n\n`;
    summary += `- **Performance**: ${avg.performance}/100\n`;
    summary += `- **Accessibility**: ${avg.accessibility}/100\n`;
    summary += `- **Best Practices**: ${avg.bestPractices}/100\n`;
    summary += `- **SEO**: ${avg.seo}/100\n\n`;
  }
  
  summary += `## 📈 Recommendations\n\n`;
  
  const avgPerf = totalScores.performance / count;
  if (avgPerf < 90) {
    summary += `### 🚀 Performance Improvements\n`;
    summary += `- Consider implementing lazy loading for images\n`;
    summary += `- Optimize JavaScript bundle size\n`;
    summary += `- Enable compression (Gzip/Brotli)\n`;
    summary += `- Use CDN for static assets\n\n`;
  }
  
  const avgAcc = totalScores.accessibility / count;
  if (avgAcc < 95) {
    summary += `### ♿ Accessibility Improvements\n`;
    summary += `- Add alt text to all images\n`;
    summary += `- Ensure sufficient color contrast\n`;
    summary += `- Add ARIA labels to interactive elements\n`;
    summary += `- Test with screen readers\n\n`;
  }
  
  summary += `## 📁 Individual Reports\n\n`;
  results.filter(r => r !== null).forEach(result => {
    const pageName = result.url.replace(SITE_URL, '') || 'Home';
    summary += `- [${pageName} (${result.device})](${path.basename(result.reportPath)})\n`;
  });
  
  fs.writeFileSync(summaryPath, summary);
  console.log(`\n📋 Summary report generated: ${summaryPath}`);
}

// Main execution
async function main() {
  if (!checkLighthouse()) {
    process.exit(1);
  }
  
  const allResults = [];
  
  // Test each page on both mobile and desktop
  for (const page of PAGES_TO_TEST) {
    // Mobile audit
    const mobileResult = runLighthouseAudit(page, 'mobile');
    if (mobileResult) allResults.push(mobileResult);
    
    // Desktop audit
    const desktopResult = runLighthouseAudit(page, 'desktop');
    if (desktopResult) allResults.push(desktopResult);
    
    // Small delay between audits
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  
  generateSummaryReport(allResults);
  
  console.log('\n🎉 Performance audit complete!');
  console.log('📁 Reports saved in ./performance-reports/');
  console.log('📋 Check SUMMARY.md for overview');
}

// Handle errors
process.on('unhandledRejection', (error) => {
  console.error('Unhandled rejection:', error);
  process.exit(1);
});

// Run the audit
main().catch(console.error);
