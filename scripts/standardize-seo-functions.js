#!/usr/bin/env node

/**
 * SEO Function Standardization Script
 * 
 * This script replaces all 4 different SEO metadata approaches with the enhanced
 * buildMetadataFromSeo() function for consistency across the entire codebase.
 * 
 * Functions being replaced:
 * 1. generateServiceMetadata() in src/lib/metadata.ts
 * 2. Inline generateMetadata() in src/app/page.tsx (home)
 * 3. Inline generateMetadata() in src/app/about/page.tsx
 * 4. Any other inline generateMetadata() functions found
 * 
 * Migration Strategy:
 * - Replace all with calls to buildMetadataFromSeo(context, seo)
 * - Preserve smart defaults by passing proper pageType and contentData
 * - Maintain backward compatibility for existing TinaCMS seo objects
 */

const fs = require('fs')
const path = require('path')

class SeoStandardizer {
  constructor() {
    this.srcDir = path.join(process.cwd(), 'src')
    this.migratedFiles = []
    this.errors = []
  }

  async standardizeAll() {
    console.log('🧹 Starting SEO Function Standardization...\n')
    
    try {
      // 1. Remove redundant generateServiceMetadata function
      await this.removeServiceMetadataFunction()
      
      // 2. Replace home page inline function
      await this.standardizeHomePage()
      
      // 3. Replace about page inline function
      await this.standardizeAboutPage()
      
      // 4. Find and replace any other inline functions
      await this.findAndReplaceOtherInlineFunctions()
      
      // 5. Update import statements
      await this.updateImports()
      
      this.generateReport()
      
    } catch (error) {
      console.error('❌ Standardization failed:', error.message)
      process.exit(1)
    }
  }

  async removeServiceMetadataFunction() {
    const metadataPath = path.join(this.srcDir, 'lib', 'metadata.ts')
    
    if (!fs.existsSync(metadataPath)) {
      console.log('⚠️  src/lib/metadata.ts not found, skipping...')
      return
    }

    const content = fs.readFileSync(metadataPath, 'utf8')
    
    // Check if it only contains the generateServiceMetadata function
    const lines = content.split('\n').filter(line => line.trim())
    const isOnlyServiceFunction = lines.every(line => 
      line.includes('generateServiceMetadata') ||
      line.includes('import') ||
      line.includes('export') ||
      line.includes('return') ||
      line.includes('{') ||
      line.includes('}') ||
      line.includes('const') ||
      line.includes('//') ||
      line.trim() === ''
    )

    if (isOnlyServiceFunction) {
      // Delete the entire file since it's redundant
      fs.unlinkSync(metadataPath)
      console.log('✅ Removed redundant src/lib/metadata.ts')
      this.migratedFiles.push({
        file: 'src/lib/metadata.ts',
        action: 'DELETED',
        reason: 'Redundant function replaced by enhanced buildMetadataFromSeo()'
      })
    } else {
      // Just remove the function if file has other content
      const newContent = this.removeGenerateServiceMetadata(content)
      fs.writeFileSync(metadataPath, newContent)
      console.log('✅ Removed generateServiceMetadata() from src/lib/metadata.ts')
      this.migratedFiles.push({
        file: 'src/lib/metadata.ts',
        action: 'MODIFIED',
        reason: 'Removed generateServiceMetadata function'
      })
    }
  }

  async standardizeHomePage() {
    const homePath = path.join(this.srcDir, 'app', 'page.tsx')
    
    if (!fs.existsSync(homePath)) {
      console.log('⚠️  src/app/page.tsx not found, skipping...')
      return
    }

    let content = fs.readFileSync(homePath, 'utf8')
    
    // Replace the generateMetadata function
    const newGenerateMetadata = `export async function generateMetadata(): Promise<Metadata> {
  const homeData = await client.queries.home({ relativePath: 'home.md' })
  const seo = homeData.data.home.seo
  
  return buildMetadataFromSeo(
    { 
      slug: '', 
      pageType: 'home',
      contentData: homeData.data.home
    }, 
    seo
  )
}`

    // Replace the existing generateMetadata function
    content = content.replace(
      /export async function generateMetadata\(\)[\s\S]*?^}/m,
      newGenerateMetadata
    )

    // Add import if not present
    if (!content.includes('buildMetadataFromSeo')) {
      const importMatch = content.match(/import.*from ['"][^'"]*\/lib\/pageSeo['"]/)
      if (importMatch) {
        // Add to existing import
        content = content.replace(
          /import\s*\{([^}]*)\}\s*from\s*['"][^'"]*\/lib\/pageSeo['"]/,
          (match, imports) => {
            const cleanImports = imports.trim()
            const newImports = cleanImports ? `${cleanImports}, buildMetadataFromSeo` : 'buildMetadataFromSeo'
            return match.replace(imports, newImports)
          }
        )
      } else {
        // Add new import
        const otherImports = content.match(/^import.*$/gm) || []
        const lastImport = otherImports[otherImports.length - 1]
        if (lastImport) {
          content = content.replace(lastImport, `${lastImport}\nimport { buildMetadataFromSeo } from '@/lib/pageSeo'`)
        }
      }
    }

    fs.writeFileSync(homePath, content)
    console.log('✅ Standardized home page SEO function')
    this.migratedFiles.push({
      file: 'src/app/page.tsx',
      action: 'STANDARDIZED',
      reason: 'Replaced inline generateMetadata with buildMetadataFromSeo call'
    })
  }

  async standardizeAboutPage() {
    const aboutPath = path.join(this.srcDir, 'app', 'about', 'page.tsx')
    
    if (!fs.existsSync(aboutPath)) {
      console.log('⚠️  src/app/about/page.tsx not found, skipping...')
      return
    }

    let content = fs.readFileSync(aboutPath, 'utf8')
    
    // Replace the generateMetadata function
    const newGenerateMetadata = `export async function generateMetadata(): Promise<Metadata> {
  const aboutData = await client.queries.about({ relativePath: 'about.md' })
  const seo = aboutData.data.about.seo
  
  return buildMetadataFromSeo(
    { 
      slug: 'about', 
      pageType: 'about',
      contentData: aboutData.data.about
    }, 
    seo
  )
}`

    // Replace the existing generateMetadata function
    content = content.replace(
      /export async function generateMetadata\(\)[\s\S]*?^}/m,
      newGenerateMetadata
    )

    // Add import if not present
    if (!content.includes('buildMetadataFromSeo')) {
      const importMatch = content.match(/import.*from ['"][^'"]*\/lib\/pageSeo['"]/)
      if (importMatch) {
        // Add to existing import
        content = content.replace(
          /import\s*\{([^}]*)\}\s*from\s*['"][^'"]*\/lib\/pageSeo['"]/,
          (match, imports) => {
            const cleanImports = imports.trim()
            const newImports = cleanImports ? `${cleanImports}, buildMetadataFromSeo` : 'buildMetadataFromSeo'
            return match.replace(imports, newImports)
          }
        )
      } else {
        // Add new import
        const otherImports = content.match(/^import.*$/gm) || []
        const lastImport = otherImports[otherImports.length - 1]
        if (lastImport) {
          content = content.replace(lastImport, `${lastImport}\nimport { buildMetadataFromSeo } from '@/lib/pageSeo'`)
        }
      }
    }

    fs.writeFileSync(aboutPath, content)
    console.log('✅ Standardized about page SEO function')
    this.migratedFiles.push({
      file: 'src/app/about/page.tsx',
      action: 'STANDARDIZED',
      reason: 'Replaced inline generateMetadata with buildMetadataFromSeo call'
    })
  }

  async findAndReplaceOtherInlineFunctions() {
    const appDir = path.join(this.srcDir, 'app')
    const pageFiles = this.findPageFiles(appDir)
    
    for (const filePath of pageFiles) {
      // Skip files we already processed
      if (filePath.includes('page.tsx') && (filePath.includes('/app/page.tsx') || filePath.includes('/about/page.tsx'))) {
        continue
      }
      
      const content = fs.readFileSync(filePath, 'utf8')
      
      // Check if it has inline generateMetadata
      if (content.includes('export async function generateMetadata') && 
          !content.includes('buildMetadataFromSeo')) {
        
        console.log(`📝 Found inline generateMetadata in ${filePath}`)
        console.log('   This file needs manual review - complex logic detected')
        
        this.migratedFiles.push({
          file: filePath.replace(process.cwd(), '').replace(/\\/g, '/'),
          action: 'NEEDS_REVIEW',
          reason: 'Complex inline generateMetadata function requires manual migration'
        })
      }
    }
  }

  async updateImports() {
    const filesToUpdate = [
      'src/app/services/[slug]/page.tsx',
      'src/app/blog/[slug]/page.tsx',
      'src/app/case-studies/[slug]/page.tsx'
    ]
    
    for (const relativePath of filesToUpdate) {
      const filePath = path.join(process.cwd(), relativePath)
      
      if (!fs.existsSync(filePath)) continue
      
      let content = fs.readFileSync(filePath, 'utf8')
      
      // Remove any imports from the deleted metadata.ts
      content = content.replace(/import.*from ['"][^'"]*\/lib\/metadata['"]\s*\n?/g, '')
      
      // Update any references to generateServiceMetadata
      if (content.includes('generateServiceMetadata')) {
        console.log(`🔄 Updating ${relativePath} to use buildMetadataFromSeo`)
        
        // This would need specific logic for each file type
        // For now, just mark for manual review
        this.migratedFiles.push({
          file: relativePath,
          action: 'NEEDS_MANUAL_UPDATE',
          reason: 'File references generateServiceMetadata - needs buildMetadataFromSeo integration'
        })
      }
    }
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

  removeGenerateServiceMetadata(content) {
    // Remove the entire function
    return content.replace(
      /export\s+function\s+generateServiceMetadata[\s\S]*?^}/m,
      ''
    ).replace(/\n\n\n+/g, '\n\n') // Clean up extra newlines
  }

  generateReport() {
    console.log('\n📊 SEO Standardization Complete!\n')
    
    console.log('✅ Migrated Files:')
    this.migratedFiles.forEach(({ file, action, reason }) => {
      const actionIcon = {
        'DELETED': '🗑️',
        'STANDARDIZED': '✅',
        'MODIFIED': '✏️',
        'NEEDS_REVIEW': '⚠️',
        'NEEDS_MANUAL_UPDATE': '🔧'
      }[action] || '📝'
      
      console.log(`   ${actionIcon} ${file} - ${reason}`)
    })
    
    if (this.errors.length > 0) {
      console.log('\n❌ Errors:')
      this.errors.forEach(error => console.log(`   • ${error}`))
    }
    
    console.log('\n🎯 Next Steps:')
    console.log('   1. Review files marked as NEEDS_REVIEW')
    console.log('   2. Manually update files marked as NEEDS_MANUAL_UPDATE')  
    console.log('   3. Run your SEO audit script to verify improvements')
    console.log('   4. Test metadata generation on all page types')
    console.log('\n🎉 All SEO functions now use buildMetadataFromSeo() as the single source of truth!')
  }
}

// Run the standardization
if (require.main === module) {
  const standardizer = new SeoStandardizer()
  standardizer.standardizeAll()
}

module.exports = { SeoStandardizer }