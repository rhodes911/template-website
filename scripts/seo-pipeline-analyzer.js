#!/usr/bin/env node

/**
 * SEO Pipeline Analyzer
 * 
 * This script analyzes every page in the site and documents:
 * 1. What SEO pipeline each page follows
 * 2. Where metadata comes from (TinaCMS vs hardcoded defaults)
 * 3. Which fields are missing or using fallbacks
 * 4. Progress tracking for migration to TinaCMS-driven SEO
 */

const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

const CONTENT_DIR = path.join(__dirname, '..', 'content');
const SRC_DIR = path.join(__dirname, '..', 'src');

// Define all the SEO fields we expect
const EXPECTED_SEO_FIELDS = [
  'metaTitle',
  'metaDescription', 
  'canonicalUrl',
  'keywords',
  'noIndex',
  'openGraph.ogTitle',
  'openGraph.ogDescription',
  'openGraph.ogImage'
];

// Page type configurations with their pipelines
const PAGE_PIPELINES = {
  'home': {
    path: '/src/app/page.tsx',
    contentSource: 'content/home.md (via TinaCMS)',
    metadataFunction: 'buildMetadataFromSeo() - STANDARDIZED',
    defaults: {
      metaTitle: 'Expert Digital Marketing Camberley Surrey | Ellie Edwards',
      metaDescription: 'Transform your brand with smart marketing strategies. Local digital marketing expert serving Camberley, Surrey, Hampshire, Basingstoke & Reading areas.',
      'openGraph.ogTitle': 'Ellie Edwards Marketing - Expert Digital Marketing for Entrepreneurs',
      'openGraph.ogDescription': 'Transform your brand with smart marketing strategies. We help entrepreneurs and personal brands create compelling campaigns that convert visitors into loyal customers.'
    }
  },
  
  'about': {
    path: '/src/app/about/page.tsx',
    contentSource: 'content/about.md (via TinaCMS)',
    metadataFunction: 'buildMetadataFromSeo() - STANDARDIZED',
    defaults: {
      metaTitle: 'About Ellie Edwards | Marketing Consultant',
      metaDescription: 'Meet Ellie Edwards, a marketing consultant helping small businesses grow with strategic, results‑driven marketing.'
    }
  },
  

  
  'service-pages': {
    path: '/src/app/services/[slug]/page.tsx',
    contentSource: 'content/services/*.md (via TinaCMS)',
    metadataFunction: 'buildMetadataFromSeo() - STANDARDIZED',
    defaults: {
      metaTitle: '${service.title} Services | Ellie Edwards Marketing',
      metaDescription: '${service.description}',
      'openGraph.ogTitle': '${metaTitle}',
      'openGraph.ogDescription': '${metaDescription}'
    }
  },
  
  'blog-listing': {
    path: '/src/app/blog/page.tsx',
    contentSource: 'content/blog.md (via TinaCMS)',
    metadataFunction: 'buildMetadataFromSeo() - STANDARDIZED',
    defaults: {
      // No hardcoded defaults - relies entirely on content or undefined
    }
  },
  
  'blog-posts': {
    path: '/src/app/blog/[slug]/page.tsx',
    contentSource: 'content/blog/*.md (via TinaCMS)',
    metadataFunction: 'buildMetadataFromSeo() - STANDARDIZED',
    defaults: {
      metaTitle: '${post.title} | Ellie Edwards Marketing',
      metaDescription: '${post.excerpt}',
      'openGraph.ogTitle': '${post.socialShare?.title || post.title}',
      'openGraph.ogDescription': '${post.socialShare?.description || post.excerpt}'
    }
  },
  
  'case-studies-listing': {
    path: '/src/app/case-studies/page.tsx',
    contentSource: 'content/case-studies.md (via TinaCMS)',
    metadataFunction: 'buildMetadataFromSeo() - STANDARDIZED',
    defaults: {
      // No hardcoded defaults - relies entirely on content or undefined
    }
  },
  
  'case-study-pages': {
    path: '/src/app/case-studies/[slug]/page.tsx',
    contentSource: 'content/case-studies/*.md (via TinaCMS)',
    metadataFunction: 'buildMetadataFromSeo() - STANDARDIZED',
    defaults: {
      metaTitle: '${caseStudy.title} | Case Study | Ellie Edwards Marketing',
      metaDescription: '${caseStudy.challenge} Learn how we helped ${caseStudy.client} achieve remarkable results through strategic digital marketing.',
      'openGraph.ogTitle': '${caseStudy.title} | Case Study',
      'openGraph.ogDescription': '${caseStudy.challenge} See how we helped ${caseStudy.client} transform their business.'
    }
  },
  
  'contact': {
    path: '/src/app/contact/page.tsx',
    contentSource: 'content/contact.md (via TinaCMS)',
    metadataFunction: 'buildMetadataFromSeo() - STANDARDIZED',
    defaults: {
      // No hardcoded defaults - relies entirely on content or undefined
    }
  },
  
  'faq': {
    path: '/src/app/faq/page.tsx',
    contentSource: 'content/faq.md (via TinaCMS)',
    metadataFunction: 'buildMetadataFromSeo() - STANDARDIZED',
    defaults: {
      // No hardcoded defaults - relies entirely on content or undefined
    }
  },
  
  'services-listing': {
    path: '/src/app/services/page.tsx',
    contentSource: 'content/services.md (via TinaCMS)',
    metadataFunction: 'buildMetadataFromSeo() - STANDARDIZED',
    defaults: {
      metaTitle: 'Digital Marketing Services | Ellie Edwards Marketing',
      metaDescription: 'Comprehensive digital marketing services to grow your business. SEO, PPC, content marketing, social media, and more.'
    }
  }
};

/**
 * Get the value of a nested field using dot notation
 */
function getNestedValue(obj, path) {
  return path.split('.').reduce((current, key) => current?.[key], obj);
}

/**
 * Check if a field has a value or is using a default with detailed source tracking
 */
function analyzeField(content, fieldPath, defaults, pageType) {
  const seoValue = getNestedValue(content.seo, fieldPath);
  const nonSeoValue = getNestedValue(content, fieldPath);
  const defaultValue = defaults[fieldPath];
  
  // Use !== undefined to properly handle boolean false values
  if (seoValue !== undefined) {
    return { 
      status: 'HAS_VALUE', 
      source: 'seo', 
      value: seoValue,
      sourceDetail: `content.seo.${fieldPath}`,
      pipeline: 'TinaCMS'
    };
  }
  
  if (nonSeoValue !== undefined) {
    return { 
      status: 'HAS_VALUE', 
      source: 'content', 
      value: nonSeoValue,
      sourceDetail: `content.${fieldPath}`,
      pipeline: 'Content Field'
    };
  }
  
  if (defaultValue) {
    // Determine the exact source of the default
    let sourceDetail = '';
    let pipeline = '';
    
    if (pageType === 'home' || pageType === 'about') {
      sourceDetail = `Hardcoded in src/app/${pageType === 'home' ? '' : pageType + '/'}page.tsx generateMetadata()`;
      pipeline = 'Inline Function';
    } else if (pageType === 'service-pages') {
      sourceDetail = 'src/lib/metadata.ts generateServiceMetadata()';
      pipeline = 'Smart Defaults';
    } else if (pageType === 'blog-posts') {
      sourceDetail = 'src/app/blog/[slug]/page.tsx generateMetadata()';
      pipeline = 'Inline Function';
    } else if (pageType === 'case-study-pages') {
      sourceDetail = 'src/app/case-studies/[slug]/page.tsx generateMetadata()';
      pipeline = 'Inline Function';
    } else {
      sourceDetail = 'buildMetadataFromSeo() - returns undefined';
      pipeline = 'No Defaults';
    }
    
    return { 
      status: 'USING_DEFAULT', 
      source: 'hardcoded', 
      value: defaultValue,
      sourceDetail,
      pipeline
    };
  }
  
  // Determine what happens when field is missing
  let sourceDetail = '';
  let pipeline = '';
  
  if (pageType.includes('listing') || pageType === 'contact' || pageType === 'faq') {
    sourceDetail = 'buildMetadataFromSeo() returns undefined';
    pipeline = 'No Fallback';
  } else {
    sourceDetail = 'No fallback defined';
    pipeline = 'Missing Logic';
  }
  
  return { 
    status: 'MISSING', 
    source: null, 
    value: null,
    sourceDetail,
    pipeline
  };
}

/**
 * Analyze a single content file
 */
function analyzeContentFile(filePath, pageType) {
  if (!fs.existsSync(filePath)) {
    return null;
  }
  
  const content = fs.readFileSync(filePath, 'utf-8');
  const { data } = matter(content);
  const pipeline = PAGE_PIPELINES[pageType];
  
  const analysis = {
    file: path.relative(process.cwd(), filePath),
    pageType,
    pipeline: pipeline.metadataFunction,
    contentSource: pipeline.contentSource,
    fields: {},
    summary: {
      totalFields: EXPECTED_SEO_FIELDS.length,
      hasValue: 0,
      usingDefaults: 0,
      missing: 0
    }
  };
  
  // Analyze each expected field
  EXPECTED_SEO_FIELDS.forEach(fieldPath => {
    const fieldAnalysis = analyzeField(data, fieldPath, pipeline.defaults, pageType);
    analysis.fields[fieldPath] = fieldAnalysis;
    
    // Update summary counts
    switch (fieldAnalysis.status) {
      case 'HAS_VALUE':
        analysis.summary.hasValue++;
        break;
      case 'USING_DEFAULT':
        analysis.summary.usingDefaults++;
        break;
      case 'MISSING':
        analysis.summary.missing++;
        break;
    }
  });
  
  // Calculate TinaCMS completion percentage
  analysis.tinaCmsCompletion = Math.round((analysis.summary.hasValue / analysis.summary.totalFields) * 100);
  
  return analysis;
}

/**
 * Get all content files for a directory
 */
function getContentFiles(dirPath) {
  if (!fs.existsSync(dirPath)) return [];
  
  return fs.readdirSync(dirPath)
    .filter(file => file.endsWith('.md'))
    .map(file => path.join(dirPath, file));
}

/**
 * Run the full SEO pipeline analysis
 */
function runAnalysis() {
  const results = {
    timestamp: new Date().toISOString(),
    summary: {
      totalPages: 0,
      averageTinaCmsCompletion: 0,
      pagesUsingDefaults: 0,
      fullyMigrated: 0
    },
    pageTypes: {},
    pages: []
  };
  
  // Analyze single pages
  const singlePages = ['home', 'about', 'contact', 'faq'];
  singlePages.forEach(pageType => {
    const contentFile = path.join(CONTENT_DIR, `${pageType}.md`);
    const analysis = analyzeContentFile(contentFile, pageType);
    
    if (analysis) {
      results.pages.push(analysis);
      if (!results.pageTypes[pageType]) {
        results.pageTypes[pageType] = { pages: [], pipeline: PAGE_PIPELINES[pageType] };
      }
      results.pageTypes[pageType].pages.push(analysis);
    }
  });
  
  // Analyze listing pages
  const listingPages = ['services', 'blog', 'case-studies'];
  listingPages.forEach(pageType => {
    const contentFile = path.join(CONTENT_DIR, `${pageType}.md`);
    const analysis = analyzeContentFile(contentFile, `${pageType}-listing`);
    
    if (analysis) {
      results.pages.push(analysis);
      const key = `${pageType}-listing`;
      if (!results.pageTypes[key]) {
        results.pageTypes[key] = { pages: [], pipeline: PAGE_PIPELINES[key] };
      }
      results.pageTypes[key].pages.push(analysis);
    }
  });
  
  // Analyze dynamic pages
  const dynamicTypes = [
    { type: 'service-pages', dir: 'services' },
    { type: 'blog-posts', dir: 'blog' },
    { type: 'case-study-pages', dir: 'case-studies' }
  ];
  
  dynamicTypes.forEach(({ type, dir }) => {
    const contentFiles = getContentFiles(path.join(CONTENT_DIR, dir));
    
    contentFiles.forEach(file => {
      const analysis = analyzeContentFile(file, type);
      if (analysis) {
        results.pages.push(analysis);
        if (!results.pageTypes[type]) {
          results.pageTypes[type] = { pages: [], pipeline: PAGE_PIPELINES[type] };
        }
        results.pageTypes[type].pages.push(analysis);
      }
    });
  });
  
  // Calculate summary statistics
  results.summary.totalPages = results.pages.length;
  results.summary.averageTinaCmsCompletion = Math.round(
    results.pages.reduce((sum, page) => sum + page.tinaCmsCompletion, 0) / results.pages.length
  );
  results.summary.pagesUsingDefaults = results.pages.filter(page => page.summary.usingDefaults > 0).length;
  results.summary.fullyMigrated = results.pages.filter(page => page.tinaCmsCompletion === 100).length;
  
  return results;
}

/**
 * Generate a detailed console report
 */
function generateConsoleReport(results) {
  console.log('🔍 SEO Pipeline Analysis Report');
  console.log('================================\n');
  
  console.log(`📊 Summary:`);
  console.log(`  • Total Pages: ${results.summary.totalPages}`);
  console.log(`  • Average TinaCMS Completion: ${results.summary.averageTinaCmsCompletion}%`);
  console.log(`  • Pages Using Defaults: ${results.summary.pagesUsingDefaults}`);
  console.log(`  • Fully Migrated: ${results.summary.fullyMigrated}\n`);
  
  console.log('📋 Pipeline Breakdown by Page Type:');
  console.log('====================================\n');
  
  Object.entries(results.pageTypes).forEach(([pageType, data]) => {
    console.log(`🔸 ${pageType.toUpperCase()}`);
    console.log(`   Pipeline: ${data.pipeline.metadataFunction}`);
    console.log(`   Content Source: ${data.pipeline.contentSource}`);
    console.log(`   Pages: ${data.pages.length}`);
    
    const avgCompletion = Math.round(
      data.pages.reduce((sum, page) => sum + page.tinaCmsCompletion, 0) / data.pages.length
    );
    console.log(`   Avg TinaCMS Completion: ${avgCompletion}%\n`);
  });
  
  console.log('📄 Detailed Page Analysis:');
  console.log('===========================\n');
  
  // Group by completion status for easier review
  const groupedPages = {
    fullyMigrated: results.pages.filter(p => p.tinaCmsCompletion === 100),
    partiallyMigrated: results.pages.filter(p => p.tinaCmsCompletion > 0 && p.tinaCmsCompletion < 100),
    notMigrated: results.pages.filter(p => p.tinaCmsCompletion === 0)
  };
  
  Object.entries(groupedPages).forEach(([status, pages]) => {
    if (pages.length === 0) return;
    
    console.log(`\n${status === 'fullyMigrated' ? '✅' : status === 'partiallyMigrated' ? '⚠️' : '❌'} ${status.charAt(0).toUpperCase() + status.slice(1)} (${pages.length} pages):`);
    
    pages.forEach(page => {
      console.log(`   ${page.file} - ${page.tinaCmsCompletion}% complete`);
      
      // Show fields using defaults
      const defaultFields = Object.entries(page.fields)
        .filter(([fieldName, field]) => field.status === 'USING_DEFAULT')
        .map(([name, field]) => name);
        
      if (defaultFields.length > 0) {
        console.log(`     Using defaults: ${defaultFields.join(', ')}`);
      }
      
      // Show missing fields
      const missingFields = Object.entries(page.fields)
        .filter(([fieldName, field]) => field.status === 'MISSING')
        .map(([name, field]) => name);
        
      if (missingFields.length > 0) {
        console.log(`     Missing: ${missingFields.join(', ')}`);
      }
    });
  });
  
  console.log('\n💡 Recommendations:');
  console.log('===================\n');
  
  if (results.summary.pagesUsingDefaults > 0) {
    console.log(`• ${results.summary.pagesUsingDefaults} pages are still using hardcoded defaults`);
    console.log('  Action: Add SEO fields to TinaCMS content\n');
  }
  
  const missingFieldCount = results.pages.reduce((sum, page) => sum + page.summary.missing, 0);
  if (missingFieldCount > 0) {
    console.log(`• ${missingFieldCount} total missing SEO fields across all pages`);
    console.log('  Action: Add missing fields to content or implement fallbacks\n');
  }
  
  if (results.summary.fullyMigrated < results.summary.totalPages) {
    console.log(`• ${results.summary.totalPages - results.summary.fullyMigrated} pages not fully migrated to TinaCMS`);
    console.log('  Action: Complete migration for remaining pages\n');
  }
}

/**
 * Generate markdown report
 */
function generateMarkdownReport(results) {
  const date = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
  
  let markdown = `# SEO Migration Progress Report

**Generated:** ${date}  
**Analysis Timestamp:** ${results.timestamp}

## 📊 Executive Summary

| Metric | Value | Progress |
|--------|-------|----------|
| **Total Pages** | ${results.summary.totalPages} | 📄 |
| **Average TinaCMS Completion** | ${results.summary.averageTinaCmsCompletion}% | ${getProgressBar(results.summary.averageTinaCmsCompletion)} |
| **Pages Using Defaults** | ${results.summary.pagesUsingDefaults} | ${results.summary.pagesUsingDefaults === 0 ? '✅' : '⚠️'} |
| **Fully Migrated Pages** | ${results.summary.fullyMigrated} | ${results.summary.fullyMigrated === results.summary.totalPages ? '✅' : '📈'} |

## 🎯 Migration Status

`;

  // Group pages by completion status
  const groupedPages = {
    fullyMigrated: results.pages.filter(p => p.tinaCmsCompletion === 100),
    partiallyMigrated: results.pages.filter(p => p.tinaCmsCompletion > 0 && p.tinaCmsCompletion < 100),
    notMigrated: results.pages.filter(p => p.tinaCmsCompletion === 0)
  };

  if (groupedPages.fullyMigrated.length > 0) {
    markdown += `### ✅ Fully Migrated (${groupedPages.fullyMigrated.length} pages)

`;
    groupedPages.fullyMigrated.forEach(page => {
      markdown += `- \`${page.file}\` - **${page.tinaCmsCompletion}%** complete\n`;
    });
    markdown += '\n';
  }

  if (groupedPages.partiallyMigrated.length > 0) {
    markdown += `### ⚠️ Partially Migrated (${groupedPages.partiallyMigrated.length} pages)

`;
    groupedPages.partiallyMigrated.forEach(page => {
      markdown += `- \`${page.file}\` - **${page.tinaCmsCompletion}%** complete\n`;
      
      // Show fields using defaults
      const defaultFields = Object.entries(page.fields)
        .filter(([fieldName, field]) => field.status === 'USING_DEFAULT')
        .map(([name, field]) => name);
        
      if (defaultFields.length > 0) {
        markdown += `  - 🔄 **Using defaults:** ${defaultFields.join(', ')}\n`;
      }
      
      // Show missing fields
      const missingFields = Object.entries(page.fields)
        .filter(([fieldName, field]) => field.status === 'MISSING')
        .map(([name, field]) => name);
        
      if (missingFields.length > 0) {
        markdown += `  - ❌ **Missing:** ${missingFields.join(', ')}\n`;
      }
    });
    markdown += '\n';
  }

  if (groupedPages.notMigrated.length > 0) {
    markdown += `### ❌ Not Migrated (${groupedPages.notMigrated.length} pages)

`;
    groupedPages.notMigrated.forEach(page => {
      markdown += `- \`${page.file}\` - **${page.tinaCmsCompletion}%** complete\n`;
      markdown += `  - ❌ **All fields missing or using defaults**\n`;
    });
    markdown += '\n';
  }

  markdown += `## 🏗️ Pipeline Breakdown by Page Type

| Page Type | Pages | Avg Completion | Pipeline | Content Source |
|-----------|-------|----------------|----------|----------------|
`;

  Object.entries(results.pageTypes).forEach(([pageType, data]) => {
    const avgCompletion = Math.round(
      data.pages.reduce((sum, page) => sum + page.tinaCmsCompletion, 0) / data.pages.length
    );
    const progressEmoji = avgCompletion === 100 ? '✅' : avgCompletion >= 75 ? '🟢' : avgCompletion >= 50 ? '🟡' : '🔴';
    
    markdown += `| **${pageType.toUpperCase()}** | ${data.pages.length} | ${avgCompletion}% ${progressEmoji} | \`${data.pipeline.metadataFunction}\` | \`${data.pipeline.contentSource}\` |\n`;
  });

  markdown += `

## 💡 Next Actions

`;

  if (results.summary.pagesUsingDefaults > 0) {
    markdown += `### 🔄 Pages Using Hardcoded Defaults (${results.summary.pagesUsingDefaults})
**Priority:** High  
**Action:** Add SEO fields to TinaCMS content for these pages to gain full control over metadata.

`;
  }

  const missingFieldCount = results.pages.reduce((sum, page) => sum + page.summary.missing, 0);
  if (missingFieldCount > 0) {
    markdown += `### ❌ Missing SEO Fields (${missingFieldCount} total)
**Priority:** Medium  
**Action:** Add missing fields to content files or implement fallback logic in components.

`;
  }

  if (results.summary.fullyMigrated < results.summary.totalPages) {
    markdown += `### 📈 Complete Migration (${results.summary.totalPages - results.summary.fullyMigrated} pages remaining)
**Priority:** Ongoing  
**Action:** Continue migrating remaining pages to achieve 100% TinaCMS-driven SEO.

`;
  }

  // Add detailed field analysis
  markdown += `## 📋 Detailed Field Analysis

### Expected SEO Fields
All pages should have these fields in their \`seo\` object:

1. \`metaTitle\` - Page title for search results
2. \`metaDescription\` - Description for search results  
3. \`canonicalUrl\` - Preferred URL for this content
4. \`keywords\` - Target keywords array
5. \`noIndex\` - Boolean to prevent indexing
6. \`openGraph.ogTitle\` - Social sharing title
7. \`openGraph.ogDescription\` - Social sharing description
8. \`openGraph.ogImage\` - Social sharing image

### Field Status Legend
- ✅ **HAS_VALUE**: Field is properly set in TinaCMS
- 🔄 **USING_DEFAULT**: Field is missing, using hardcoded fallback
- ❌ **MISSING**: Field is missing, no fallback available

## 🔄 Running This Analysis

To re-run this analysis and update this report:

\`\`\`bash
node scripts/seo-pipeline-analyzer.js
\`\`\`

The analysis will:
- Scan all content files for SEO fields
- Compare against expected schema
- Calculate completion percentages
- Update this report with current status
- Save detailed JSON data to \`reports/seo-pipeline-analysis.json\`

---
*This report is automatically generated. Last updated: ${date}*

## 📋 Detailed Field Analysis by Source

### Pipeline Inconsistencies Detected

`;

  // Analyze pipeline inconsistencies
  const pipelineGroups = {};
  results.pages.forEach(page => {
    Object.entries(page.fields).forEach(([fieldName, field]) => {
      if (!pipelineGroups[fieldName]) {
        pipelineGroups[fieldName] = new Set();
      }
      pipelineGroups[fieldName].add(field.pipeline);
    });
  });

  const inconsistentFields = Object.entries(pipelineGroups)
    .filter(([fieldName, pipelines]) => pipelines.size > 1);

  if (inconsistentFields.length > 0) {
    markdown += `**⚠️ These fields use different pipelines across pages:**

`;
    inconsistentFields.forEach(([fieldName, pipelines]) => {
      markdown += `- **${fieldName}**: Uses ${Array.from(pipelines).join(', ')}\n`;
    });
    markdown += '\n';
  } else {
    markdown += `**✅ All fields use consistent pipelines across pages**\n\n`;
  }

  // Detailed field breakdown - just show top 3 most problematic fields to keep report manageable
  const fieldProblems = EXPECTED_SEO_FIELDS.map(fieldName => {
    const fieldIssues = results.pages.filter(page => 
      page.fields[fieldName].status !== 'HAS_VALUE'
    );
    return { fieldName, issues: fieldIssues.length };
  }).sort((a, b) => b.issues - a.issues).slice(0, 3);

  markdown += `### Top Problem Fields (showing worst 3)

`;

  fieldProblems.forEach(({ fieldName, issues }) => {
    markdown += `#### ${fieldName} (${issues} pages with issues)

| Page | Status | Source | Pipeline | Location |
|------|--------|--------|----------|----------|
`;
    
    results.pages.forEach(page => {
      const field = page.fields[fieldName];
      if (field.status === 'HAS_VALUE') return; // Skip good ones
      
      const statusEmoji = field.status === 'USING_DEFAULT' ? '🔄' : '❌';
      const pageFile = page.file.replace(/\\/g, '/');
      
      markdown += `| \`${pageFile}\` | ${statusEmoji} ${field.status} | ${field.source || 'none'} | ${field.pipeline} | \`${field.sourceDetail}\` |\n`;
    });
    
    markdown += '\n';
  });

  markdown += `## 🔧 Standardization Recommendations

### Target Architecture
To achieve full consistency, we recommend:

1. **Single SEO Function**: Use \`buildMetadataFromSeo()\` for all pages
2. **Consistent Content Structure**: All pages should have \`seo\` object with same fields
3. **Smart Fallbacks**: Implement intelligent defaults in the SEO function itself
4. **No Inline Logic**: Remove hardcoded defaults from page components

### Migration Steps

#### Phase 1: Standardize Content Structure
`;

  // Group pages by missing seo structure
  const pagesNeedingSeoObject = results.pages.filter(page => 
    Object.values(page.fields).some(field => field.source === 'content' || field.status === 'MISSING')
  );

  if (pagesNeedingSeoObject.length > 0) {
    markdown += `Add \`seo\` objects to these content files:
`;
    pagesNeedingSeoObject.forEach(page => {
      markdown += `- \`${page.file}\`\n`;
    });
    markdown += '\n';
  }

  markdown += `#### Phase 2: Consolidate Functions
Replace these inconsistent functions with \`buildMetadataFromSeo()\`:

`;

  const functionsToReplace = new Set();
  results.pages.forEach(page => {
    if (page.pipeline !== 'buildMetadataFromSeo()') {
      functionsToReplace.add(`${page.pipeline} (${page.contentSource})`);
    }
  });

  Array.from(functionsToReplace).forEach(func => {
    markdown += `- ${func}\n`;
  });

  markdown += `
#### Phase 3: Enhanced Fallback Logic
Modify \`buildMetadataFromSeo()\` to include smart defaults:

\`\`\`typescript
// Example enhanced logic
const title = seo?.metaTitle || 
  (pageType === 'service' ? \`\${service.title} Services | Ellie Edwards Marketing\` : undefined);
\`\`\`

## 📊 Standardization Progress

### Current State Summary
`;

  const pipelineCounts = {};
  results.pages.forEach(page => {
    pipelineCounts[page.pipeline] = (pipelineCounts[page.pipeline] || 0) + 1;
  });

  markdown += `| Pipeline Function | Pages Using | Status |
|------------------|-------------|--------|
`;

  Object.entries(pipelineCounts).forEach(([pipeline, count]) => {
    const isTarget = pipeline === 'buildMetadataFromSeo()';
    const statusEmoji = isTarget ? '✅' : '🔄';
    markdown += `| \`${pipeline}\` | ${count} | ${statusEmoji} ${isTarget ? 'Target' : 'Needs Migration'} |\n`;
  });

  markdown += `

### Consistency Scores
- **Pipeline Consistency**: ${inconsistentFields.length === 0 ? '✅ 100%' : `⚠️ ${Math.round((1 - inconsistentFields.length / EXPECTED_SEO_FIELDS.length) * 100)}%`}
- **Function Standardization**: ${Object.keys(pipelineCounts).length === 1 ? '✅ 100%' : `🔄 ${Math.round((pipelineCounts['buildMetadataFromSeo()'] || 0) / results.pages.length * 100)}%`}
- **Content Structure**: ${results.summary.averageTinaCmsCompletion}%
- **Overall Consistency**: ${Math.round(((inconsistentFields.length === 0 ? 100 : 0) + (pipelineCounts['buildMetadataFromSeo()'] || 0) / results.pages.length * 100 + results.summary.averageTinaCmsCompletion) / 3)}%
`;

  return markdown;
}

/**
 * Generate a progress bar for visual representation
 */
function getProgressBar(percentage) {
  const filledBlocks = Math.round(percentage / 10);
  const emptyBlocks = 10 - filledBlocks;
  return '█'.repeat(filledBlocks) + '░'.repeat(emptyBlocks) + ` ${percentage}%`;
}

/**
 * Save results to JSON and generate markdown report
 */
function saveResults(results) {
  const reportsDir = path.join(__dirname, '..', 'reports');
  
  if (!fs.existsSync(reportsDir)) {
    fs.mkdirSync(reportsDir, { recursive: true });
  }
  
  // Save JSON data
  const jsonPath = path.join(reportsDir, 'seo-pipeline-analysis.json');
  fs.writeFileSync(jsonPath, JSON.stringify(results, null, 2));
  console.log(`📁 JSON data saved to: ${jsonPath}`);
  
  // Generate and save markdown report
  const markdownContent = generateMarkdownReport(results);
  const markdownPath = path.join(reportsDir, 'seo-migration-report.md');
  fs.writeFileSync(markdownPath, markdownContent);
  console.log(`📄 Markdown report saved to: ${markdownPath}`);
  
  return { jsonPath, markdownPath };
}

// Run the analysis
if (require.main === module) {
  console.log('🚀 Starting SEO Pipeline Analysis...\n');
  
  const results = runAnalysis();
  generateConsoleReport(results);
  const { markdownPath } = saveResults(results);
  
  console.log('\n✅ Analysis complete!');
  console.log(`📄 Updated markdown report: ${markdownPath}`);
}

module.exports = { runAnalysis, generateConsoleReport, generateMarkdownReport, PAGE_PIPELINES };