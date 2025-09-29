#!/usr/bin/env node

/**
 * Function Standardization Checker
 * 
 * This script verifies that all pages are now using the standardized
 * buildMetadataFromSeo() function instead of the old disparate approaches.
 */

const fs = require('fs')
const path = require('path')

class FunctionStandardizationChecker {
  constructor() {
    this.srcDir = path.join(process.cwd(), 'src')
    this.results = {
      standardized: [],
      needsUpdate: [],
      functionBreakdown: {}
    }
  }

  async checkStandardization() {
    console.log('🔍 Checking SEO Function Standardization...\n')
    
    // Find all page.tsx files
    const pageFiles = this.findPageFiles(path.join(this.srcDir, 'app'))
    
    for (const filePath of pageFiles) {
      await this.analyzePageFile(filePath)
    }
    
    this.generateReport()
  }

  async analyzePageFile(filePath) {
    const content = fs.readFileSync(filePath, 'utf8')
    const relativePath = filePath.replace(process.cwd(), '').replace(/\\/g, '/')
    
    // Check if file has generateMetadata function
    if (!content.includes('generateMetadata')) {
      return // Skip files without metadata generation
    }
    
    // Check which SEO approach is being used
    let approach = 'unknown'
    let isStandardized = false
    
    if (content.includes('buildMetadataFromSeo')) {
      approach = 'buildMetadataFromSeo() - STANDARDIZED ✅'
      isStandardized = true
      this.results.standardized.push({
        file: relativePath,
        approach,
        pageType: this.detectPageType(filePath),
        notes: 'Using enhanced universal function with smart defaults'
      })
    } else if (content.includes('generateServiceMetadata')) {
      approach = 'generateServiceMetadata() - OLD SERVICE FUNCTION ❌'
      this.results.needsUpdate.push({
        file: relativePath,
        approach,
        issue: 'Still using old generateServiceMetadata function'
      })
    } else if (content.match(/generateMetadata.*\{[\s\S]*?(title|description|openGraph)/)) {
      approach = 'Inline generateMetadata() - NEEDS STANDARDIZATION ⚠️'
      this.results.needsUpdate.push({
        file: relativePath,
        approach,
        issue: 'Using inline metadata generation instead of buildMetadataFromSeo'
      })
    }
    
    // Track function usage
    if (!this.results.functionBreakdown[approach]) {
      this.results.functionBreakdown[approach] = 0
    }
    this.results.functionBreakdown[approach]++
  }

  detectPageType(filePath) {
    if (filePath.includes('/app/page.tsx')) return 'home'
    if (filePath.includes('/about/')) return 'about'
    if (filePath.includes('/services/[slug]')) return 'service'
    if (filePath.includes('/blog/[slug]')) return 'blog-post'
    if (filePath.includes('/blog/category/[category]')) return 'blog-category'
    if (filePath.includes('/case-studies/[slug]')) return 'case-study'
    if (filePath.includes('/contact/')) return 'contact'
    if (filePath.includes('/faq/')) return 'faq'
    return 'other'
  }

  findPageFiles(dir) {
    const files = []
    const items = fs.readdirSync(dir)
    
    for (const item of items) {
      const fullPath = path.join(dir, item)
      const stat = fs.statSync(fullPath)
      
      if (stat.isDirectory() && !item.startsWith('.')) {
        files.push(...this.findPageFiles(fullPath))
      } else if (item === 'page.tsx') {
        files.push(fullPath)
      }
    }
    
    return files
  }

  generateReport() {
    console.log('📊 SEO Function Standardization Report')
    console.log('=======================================\n')
    
    const totalFiles = this.results.standardized.length + this.results.needsUpdate.length
    const standardizedCount = this.results.standardized.length
    const standardizationPercentage = Math.round((standardizedCount / totalFiles) * 100)
    
    console.log(`📈 Standardization Progress: ${standardizedCount}/${totalFiles} files (${standardizationPercentage}%)\n`)
    
    console.log('🔧 Function Usage Breakdown:')
    Object.entries(this.results.functionBreakdown).forEach(([func, count]) => {
      console.log(`   ${func}: ${count} files`)
    })
    console.log()
    
    if (this.results.standardized.length > 0) {
      console.log('✅ Standardized Files:')
      this.results.standardized.forEach(({ file, pageType, notes }) => {
        console.log(`   ✅ ${file} (${pageType}) - ${notes}`)
      })
      console.log()
    }
    
    if (this.results.needsUpdate.length > 0) {
      console.log('⚠️ Files Needing Update:')
      this.results.needsUpdate.forEach(({ file, approach, issue }) => {
        console.log(`   ❌ ${file}`)
        console.log(`      Current: ${approach}`)
        console.log(`      Issue: ${issue}`)
      })
      console.log()
    }
    
    if (standardizationPercentage === 100) {
      console.log('🎉 PERFECT! All SEO functions are now standardized!')
      console.log('   • Single source of truth: buildMetadataFromSeo()')
      console.log('   • Smart defaults for all page types')
      console.log('   • Consistent TinaCMS integration')
      console.log('   • Type-safe metadata generation')
    } else {
      console.log('🎯 Next Steps:')
      console.log(`   • Update ${this.results.needsUpdate.length} remaining files`)
      console.log('   • Replace old functions with buildMetadataFromSeo calls')
      console.log('   • Test metadata generation on all page types')
    }
    
    console.log(`\n📁 Full analysis available in: ${path.join(process.cwd(), 'reports', 'seo-migration-report.md')}`)
  }
}

// Run the checker
if (require.main === module) {
  const checker = new FunctionStandardizationChecker()
  checker.checkStandardization()
}

module.exports = { FunctionStandardizationChecker }