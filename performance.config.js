// Performance optimization configuration
module.exports = {
  // Browser targets for modern JavaScript
  browserslist: [
    'Chrome >= 91',
    'Firefox >= 89', 
    'Safari >= 15',
    'Edge >= 91'
  ],
  
  // Critical CSS patterns (for future implementation)
  criticalCSS: {
    // Pages that need critical CSS extraction
    pages: ['/', '/contact', '/services'],
    // Critical viewport size
    width: 1200,
    height: 900
  },
  
  // Resource hints
  preconnectDomains: [
    'https://www.googletagmanager.com',
    'https://www.google-analytics.com',
    'https://fonts.googleapis.com'
  ],
  
  // Compression settings
  compression: {
    enabled: true,
    threshold: 1024, // Only compress files larger than 1KB
    level: 6 // Compression level (1-9)
  }
}
