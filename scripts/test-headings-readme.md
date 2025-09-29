# Heading Structure Test

This simple test checks the heading structure of your website pages for SEO and accessibility issues.

## Usage

1. Make sure your development server is running:
   ```
   npm run dev
   ```

2. Run the test:
   ```
   npm run test:headings
   ```

## What it checks

- **Heading count**: Each page should have exactly one h1 element
- **Heading hierarchy**: Headings should follow proper hierarchy (no skipping levels)
- **Heading structure**: Lists all headings on each page with their text content
- **H1/H2 max length**: Flags H1 or H2 text over 70 characters (defaults, configurable via env)

## Customizing

You can customize the test by editing `scripts/test-headings.js`:

- Add or remove pages to test
- Change the heading structure rules
- Modify output format

You can also configure length thresholds via environment variables when running:

- `H1_MAX_CHARS` (default: 70)
- `H2_MAX_CHARS` (default: 70)

Example (PowerShell):

```
$env:H1_MAX_CHARS = '65'; $env:H2_MAX_CHARS = '65'; npm run test:headings
```

## Using with CI/CD

Add this to your CI/CD pipeline to verify heading structure before deployment:

```yaml
steps:
  - name: Start development server
    run: npm run dev & npx wait-on http://localhost:3000
    
  - name: Test heading structure
    run: npm run test:headings
```