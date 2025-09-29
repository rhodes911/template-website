#!/usr/bin/env node

/**
 * SIMPLE Performance Checker
 * Checks the homepage of a target site and prints basic timing + status.
 * Usage:
 *   node simple-check.js --url=https://preview-url.vercel.app
 *   SITE_URL=https://preview-url.vercel.app node simple-check.js
 */

const https = require('https');

function getBypassToken() {
  const arg = process.argv.find(a => a.startsWith('--token='));
  const fromArg = arg ? arg.split('=')[1] : undefined;
  return (process.env.VERCEL_PROTECTION_BYPASS || process.env.PROTECTION_BYPASS || fromArg || '').trim();
}

function getBaseUrl() {
  const arg = process.argv.find(a => a.startsWith('--url='));
  const fromArg = arg ? arg.split('=')[1] : undefined;
  const url = (process.env.SITE_URL || process.env.BASE_URL || fromArg || 'https://www.ellieedwardsmarketing.com').trim();
  return url.replace(/\/+$/, '');
}

const BASE_URL = getBaseUrl();

console.log('🔍 Checking your website performance...');
console.log(`📍 Testing: ${BASE_URL}`);
console.log('');

function checkSite() {
  const startTime = Date.now();
  const url = new URL(BASE_URL);
  const token = getBypassToken();
  const options = {
    protocol: url.protocol,
    hostname: url.hostname,
    port: url.port || undefined,
    path: url.pathname + (url.search || ''),
    headers: {
      'User-Agent': 'SimpleCheck/1.0 (+https://github.com/rhodes911)'
    }
  };
  if (token) {
    options.headers['x-vercel-protection-bypass'] = token;
  }

  https.get(options, (res) => {
    const loadTime = Date.now() - startTime;
    
    console.log('✅ Website is online!');
    console.log(`⚡ Load time: ${loadTime}ms`);
    console.log(`📊 Status: ${res.statusCode} ${res.statusMessage}`);
    console.log('');
    
    if (loadTime < 1000) {
      console.log('🚀 EXCELLENT - Very fast loading!');
    } else if (loadTime < 3000) {
      console.log('✅ GOOD - Decent loading speed');
    } else {
      console.log('⚠️  SLOW - Could be improved');
    }
    
    console.log('');
    console.log('💡 For detailed analysis:');
    console.log('   1. Go to: https://pagespeed.web.dev/');
    console.log(`   2. Enter: ${BASE_URL}`);
    console.log('   3. Click "Analyze"');
  }).on('error', (err) => {
    console.error('❌ Error checking website:', err.message);
    process.exitCode = 1;
  });
}

checkSite();
