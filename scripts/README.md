# SEO Analysis Scripts

This directory contains useful SEO analysis and testing scripts that were restored from the original project.

## Available Scripts

### 1. `test-headings.js`
Tests heading structure (H1-H6) across all pages for:
- Proper heading hierarchy (no skipped levels)
- Exactly one H1 per page
- Heading length limits
- Duplicate heading detection
- SEO compliance

**Usage:**
```bash
node scripts/test-headings.js
```

### 2. `test-seo-meta.js`
Validates SEO meta tags and basic page structure:
- Title tags (length, uniqueness)
- Meta descriptions (length, pixel width)
- Canonical URLs
- Language attributes
- Robots meta tags

**Usage:**
```bash
node scripts/test-seo-meta.js
```

### 3. `test-content-volume.js`
Checks content volume across pages:
- Minimum word count requirements
- Content quality thresholds
- Page-specific content minimums

**Usage:**
```bash
node scripts/test-content-volume.js
```

### 4. `test-page-seo.ts`
TypeScript-based SEO metadata validation:
- Tests SEO frontmatter structure
- Validates metadata generation functions

**Usage:**
```bash
npx tsx scripts/test-page-seo.ts
```

## Environment Variables

You can customize the tests using environment variables:

- `TEST_URL` - Base URL to test (default: http://localhost:3000)
- `PRODUCTION_ORIGIN` - Production URL for fallback testing
- `PAGE_PATH` - Specific page to test (comma-separated for multiple)
- `H1_MAX_CHARS` - Maximum H1 character length (default: 70)
- `H2_MAX_CHARS` - Maximum H2 character length (default: 70)
- `CONTENT_MIN_DEFAULT` - Minimum content words (default: 200)

## Running All Tests

To run all SEO tests in sequence:

```bash
# Test heading structure
node scripts/test-headings.js

# Test SEO meta tags
node scripts/test-seo-meta.js

# Test content volume
node scripts/test-content-volume.js

# Test TypeScript SEO functions
npx tsx scripts/test-page-seo.ts
```

## Prerequisites

These scripts require:
- Node.js
- Playwright (for browser automation)
- A running development server on localhost:3000

Install dependencies if needed:
```bash
npm install playwright
```

## Template Customization

When customizing this template for your business:

1. Update `PRODUCTION_ORIGIN` in the scripts to match your domain
2. Adjust content minimums based on your content strategy
3. Modify heading length limits if needed for your brand voice
4. Run these tests before deploying to catch SEO issues early

These scripts are valuable for maintaining SEO quality as you customize the template content.