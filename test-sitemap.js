// Test sitemap generation
const fs = require('fs');
const path = require('path');

// Simple test to see what URLs would be generated
function testSitemap() {
  const baseUrl = 'https://ellieedwardsmarketing.com';
  
  console.log('🔍 Testing sitemap URLs that should be generated:\n');
  
  // Static pages
  const staticPages = [
    baseUrl,
    `${baseUrl}/about`,
    `${baseUrl}/blog`, 
    `${baseUrl}/contact`,
    `${baseUrl}/faq`
  ];
  
  console.log('📄 Static Pages:');
  staticPages.forEach(url => console.log(`  ${url}`));
  
  // Service pages
  const services = [
    'brand-strategy',
    'content-marketing', 
    'digital-campaigns',
    'email-marketing',
    'lead-generation',
    'ppc',
    'seo',
    'social-media',
    'website-design'
  ];
  
  console.log('\n🔧 Service Pages:');
  services.forEach(service => console.log(`  ${baseUrl}/services/${service}`));
  
  // Case studies
  const caseStudies = [
    'bella-vista-restaurant',
    'ecohome-solutions', 
    'sarah-mitchell-coaching'
  ];
  
  console.log('\n📊 Case Study Pages:');
  caseStudies.forEach(study => console.log(`  ${baseUrl}/case-studies/${study}`));
  
  // Blog posts
  const blogDir = path.join(process.cwd(), 'content/blog');
  if (fs.existsSync(blogDir)) {
    const blogFiles = fs.readdirSync(blogDir).filter(name => name.endsWith('.md'));
    console.log('\n📝 Blog Posts:');
    blogFiles.forEach(file => {
      const slug = file.replace('.md', '');
      console.log(`  ${baseUrl}/blog/${slug}`);
    });
  }
  
  console.log('\n✅ Total URLs that should be in sitemap:', 
    staticPages.length + services.length + caseStudies.length + 
    (fs.existsSync(blogDir) ? fs.readdirSync(blogDir).filter(name => name.endsWith('.md')).length : 0)
  );
}

testSitemap();
