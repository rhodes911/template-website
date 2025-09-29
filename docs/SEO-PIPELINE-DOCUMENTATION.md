# SEO Pipeline Documentation

This document maps out how SEO metadata flows from content to rendered pages for every page type in the site.

## Pipeline Summary

**Analysis Date:** September 22, 2025  
**Total Pages:** 21 pages  
**Average TinaCMS Completion:** 47%  
**Pages Using Hardcoded Defaults:** 14  
**Fully Migrated Pages:** 0  

## Page Type Pipelines

### 1. HOME PAGE (`/`)
- **File:** `src/app/page.tsx`
- **Content Source:** `content/home.md` (via `getHomeData()`)
- **Metadata Function:** `generateMetadata()` inline
- **Pipeline Flow:**
  ```
  content/home.md → getHomeData() → generateMetadata() → Next.js Metadata
  ```
- **Hardcoded Defaults:**
  - `metaTitle`: "Expert Digital Marketing Camberley Surrey | Ellie Edwards"
  - `metaDescription`: "Transform your brand with smart marketing strategies..."
  - `openGraph.ogTitle`: "Ellie Edwards Marketing - Expert Digital Marketing for Entrepreneurs"
  - `openGraph.ogDescription`: "Transform your brand with smart marketing strategies..."
- **Current Status:** 88% TinaCMS complete (missing: noIndex)

### 2. ABOUT PAGE (`/about`)
- **File:** `src/app/about/page.tsx`
- **Content Source:** `content/about.md` (via `getAboutData()`)
- **Metadata Function:** `generateMetadata()` inline
- **Pipeline Flow:**
  ```
  content/about.md → getAboutData() → generateMetadata() → Next.js Metadata
  ```
- **Hardcoded Defaults:**
  - `metaTitle`: "About Ellie Edwards | Marketing Consultant"
  - `metaDescription`: "Meet Ellie Edwards, a marketing consultant helping small businesses grow..."
- **Current Status:** 88% TinaCMS complete (missing: noIndex)

### 3. SERVICES LISTING (`/services`)
- **File:** `src/app/services/page.tsx`
- **Content Source:** `content/services.md` (via `getPageSeo()`)
- **Metadata Function:** `buildMetadataFromSeo()`
- **Pipeline Flow:**
  ```
  content/services.md → getPageSeo() → buildMetadataFromSeo() → Next.js Metadata
  ```
- **Hardcoded Defaults:** None (relies entirely on content or undefined)
- **Current Status:** 0% TinaCMS complete (content/services.md missing entirely)

### 4. SERVICE PAGES (`/services/[slug]`)
- **File:** `src/app/services/[slug]/page.tsx`
- **Content Source:** `content/services/*.md` (via `getService()`)
- **Metadata Function:** `generateServiceMetadata()` in `src/lib/metadata.ts`
- **Pipeline Flow:**
  ```
  content/services/{slug}.md → getService() → generateServiceMetadata() → Next.js Metadata
  ```
- **Hardcoded Defaults:**
  - `metaTitle`: `"${service.title} Services | Ellie Edwards Marketing"`
  - `metaDescription`: `"${service.description}"`
  - `openGraph.ogTitle`: falls back to `metaTitle`
  - `openGraph.ogDescription`: falls back to `metaDescription`
- **Current Status:** 34% TinaCMS complete (9 pages, many using defaults)

### 5. BLOG LISTING (`/blog`)
- **File:** `src/app/blog/page.tsx`
- **Content Source:** `content/blog.md` (via `getPageSeo()`)
- **Metadata Function:** `buildMetadataFromSeo()`
- **Pipeline Flow:**
  ```
  content/blog.md → getPageSeo() → buildMetadataFromSeo() → Next.js Metadata
  ```
- **Hardcoded Defaults:** None (relies entirely on content or undefined)
- **Current Status:** 88% TinaCMS complete (missing: noIndex)

### 6. BLOG POSTS (`/blog/[slug]`)
- **File:** `src/app/blog/[slug]/page.tsx`
- **Content Source:** `content/blog/*.md` (via `getBlogPost()`)
- **Metadata Function:** `generateMetadata()` inline
- **Pipeline Flow:**
  ```
  content/blog/{slug}.md → getBlogPost() → generateMetadata() → Next.js Metadata
  ```
- **Hardcoded Defaults:**
  - `metaTitle`: `"${post.title} | Ellie Edwards Marketing"`
  - `metaDescription`: `"${post.excerpt}"`
  - `openGraph.ogTitle`: `"${post.socialShare?.title || post.title}"`
  - `openGraph.ogDescription`: `"${post.socialShare?.description || post.excerpt}"`
- **Current Status:** 44% TinaCMS complete (2 pages, using some defaults)

### 7. CASE STUDIES LISTING (`/case-studies`)
- **File:** `src/app/case-studies/page.tsx`
- **Content Source:** `content/case-studies.md` (via `getPageSeo()`)
- **Metadata Function:** `buildMetadataFromSeo()`
- **Pipeline Flow:**
  ```
  content/case-studies.md → getPageSeo() → buildMetadataFromSeo() → Next.js Metadata
  ```
- **Hardcoded Defaults:** None (relies entirely on content or undefined)
- **Current Status:** 88% TinaCMS complete (missing: noIndex)

### 8. CASE STUDY PAGES (`/case-studies/[slug]`)
- **File:** `src/app/case-studies/[slug]/page.tsx`
- **Content Source:** `content/case-studies/*.md` (via `getCaseStudy()`)
- **Metadata Function:** `generateMetadata()` inline
- **Pipeline Flow:**
  ```
  content/case-studies/{slug}.md → getCaseStudy() → generateMetadata() → Next.js Metadata
  ```
- **Hardcoded Defaults:**
  - `metaTitle`: `"${caseStudy.title} | Case Study | Ellie Edwards Marketing"`
  - `metaDescription`: `"${caseStudy.challenge} Learn how we helped ${caseStudy.client} achieve..."`
  - `openGraph.ogTitle`: `"${caseStudy.title} | Case Study"`
  - `openGraph.ogDescription`: `"${caseStudy.challenge} See how we helped ${caseStudy.client}..."`
- **Current Status:** 25% TinaCMS complete (3 pages, heavily using defaults)

### 9. CONTACT PAGE (`/contact`)
- **File:** `src/app/contact/page.tsx`
- **Content Source:** `content/contact.md` (via `getPageSeo()`)
- **Metadata Function:** `buildMetadataFromSeo()`
- **Pipeline Flow:**
  ```
  content/contact.md → getPageSeo() → buildMetadataFromSeo() → Next.js Metadata
  ```
- **Hardcoded Defaults:** None (relies entirely on content or undefined)
- **Current Status:** 88% TinaCMS complete (missing: noIndex)

### 10. FAQ PAGE (`/faq`)
- **File:** `src/app/faq/page.tsx`
- **Content Source:** `content/faq.md` (via `getPageSeo()`)
- **Metadata Function:** `buildMetadataFromSeo()`
- **Pipeline Flow:**
  ```
  content/faq.md → getPageSeo() → buildMetadataFromSeo() → Next.js Metadata
  ```
- **Hardcoded Defaults:** None (relies entirely on content or undefined)
- **Current Status:** 88% TinaCMS complete (missing: noIndex)

## Key Metadata Functions

### 1. `buildMetadataFromSeo()` (`src/lib/pageSeo.ts`)
- **Used by:** Static pages (services, blog, case-studies, contact, faq)
- **Behavior:** Returns `undefined` for missing fields (no defaults)
- **Logic:** 
  ```typescript
  title: seo?.metaTitle || undefined
  description: seo?.metaDescription || undefined
  ```

### 2. `generateServiceMetadata()` (`src/lib/metadata.ts`)
- **Used by:** Individual service pages
- **Behavior:** Provides smart defaults using service content
- **Logic:**
  ```typescript
  title: service.seo?.metaTitle || `${service.title} Services | Ellie Edwards Marketing`
  description: service.seo?.metaDescription || service.description
  ```

### 3. Inline `generateMetadata()` functions
- **Used by:** Home, About, Blog posts, Case studies
- **Behavior:** Each has custom defaults specific to that page type
- **Logic:** Varies by page, but follows pattern: `seo?.field || customDefault`

## Migration Priorities

### High Priority (Pages Using Many Defaults)
1. **Service Pages** - 9 pages at 34% completion
   - Missing: canonicalUrl, noIndex, openGraph.ogImage on most pages
   - Using defaults: openGraph.ogTitle, openGraph.ogDescription
   
2. **Case Study Pages** - 3 pages at 25% completion
   - Missing: canonicalUrl, keywords, noIndex, openGraph.ogImage
   - Using defaults: openGraph.ogTitle, openGraph.ogDescription

### Medium Priority (Missing Content Files)
1. **Services Listing** - 0% completion
   - File `content/services.md` doesn't exist
   - Need to create with proper SEO fields

### Low Priority (Minor Missing Fields)
1. **All Listing Pages** - Missing `noIndex` field
   - Most pages at 88% completion
   - Just need to add `noIndex: false` to TinaCMS

## Expected SEO Fields

All pages should have these fields in their `seo` object:

1. `metaTitle` - Page title for search results
2. `metaDescription` - Description for search results  
3. `canonicalUrl` - Preferred URL for this content
4. `keywords` - Target keywords array
5. `noIndex` - Boolean to prevent indexing
6. `openGraph.ogTitle` - Social sharing title
7. `openGraph.ogDescription` - Social sharing description
8. `openGraph.ogImage` - Social sharing image

## Running the Analysis

To re-run this analysis and track migration progress:

```bash
node scripts/seo-pipeline-analyzer.js
```

The script will:
- Analyze all content files
- Check which fields are using TinaCMS vs hardcoded defaults
- Generate a completion percentage for each page
- Save detailed results to `reports/seo-pipeline-analysis.json`