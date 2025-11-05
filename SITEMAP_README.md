# Sitemap & SEO Setup Guide

This project includes comprehensive sitemap and robots.txt configuration for optimal SEO.

## Files Overview

### 1. **robots.txt** (`public/robots.txt`)
- Allows all search engines to crawl the site
- Blocks admin pages from being indexed
- References the main sitemap

### 2. **sitemap.xml** (`public/sitemap.xml`)
- Static sitemap with main pages and important categories
- Updated manually or via the generation script
- Includes homepage, categories, and subcategories

### 3. **Dynamic Sitemap Generator** (`scripts/generate-sitemap.ts`)
- Automatically generates comprehensive sitemap from database
- Fetches all categories, subcategories, and parts
- Updates with current dates

## Usage

### Generate Sitemap Manually

Run the sitemap generator to create a comprehensive sitemap from your database:

```bash
npm run generate-sitemap
```

This will:
- ✅ Fetch all categories from Supabase
- ✅ Fetch all subcategories
- ✅ Fetch sample parts (10,000 max to keep file size manageable)
- ✅ Generate sitemap.xml in the public folder
- ✅ Update with today's date

### Build & Deploy

The sitemap is automatically included when you build and deploy:

```bash
npm run build
```

The `public/` folder contents (including sitemap.xml and robots.txt) are copied to the dist folder during build.

## SEO Best Practices

### Current Setup

1. **Homepage**: Priority 1.0, Updated Daily
2. **Categories**: Priority 0.9, Updated Weekly
3. **Subcategories**: Priority 0.8, Updated Weekly
4. **Parts**: Priority 0.7, Updated Monthly

### For Large Sites (500,000+ URLs)

If you need to include all 500,000 parts, consider using **Sitemap Index**:

1. Modify the script to generate multiple sitemap files:
   - `sitemap-main.xml` (main pages)
   - `sitemap-parts-1.xml` (parts 1-50,000)
   - `sitemap-parts-2.xml` (parts 50,001-100,000)
   - etc.

2. Create `sitemap-index.xml` that references all sitemap files

3. Submit the sitemap index to Google Search Console

### Sitemap Submission

After deployment, submit your sitemap to search engines:

1. **Google Search Console**
   - Go to: https://search.google.com/search-console
   - Add property: `https://www.asapamatom.com`
   - Submit sitemap: `https://www.asapamatom.com/sitemap.xml`

2. **Bing Webmaster Tools**
   - Go to: https://www.bing.com/webmasters
   - Add site: `https://www.asapamatom.com`
   - Submit sitemap: `https://www.asapamatom.com/sitemap.xml`

## Verification

Check if your sitemap is accessible:

```bash
curl https://www.asapamatom.com/sitemap.xml
curl https://www.asapamatom.com/robots.txt
```

Or visit in browser:
- https://www.asapamatom.com/sitemap.xml
- https://www.asapamatom.com/robots.txt

## Automation

### GitHub Actions (Optional)

You can automate sitemap generation on every deploy by adding a GitHub Action:

```yaml
# .github/workflows/generate-sitemap.yml
name: Generate Sitemap

on:
  push:
    branches: [main]

jobs:
  generate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run generate-sitemap
        env:
          VITE_SUPABASE_URL: ${{ secrets.VITE_SUPABASE_URL }}
          VITE_SUPABASE_ANON_KEY: ${{ secrets.VITE_SUPABASE_ANON_KEY }}
      - name: Commit sitemap
        run: |
          git config --local user.email "action@github.com"
          git config --local user.name "GitHub Action"
          git add public/sitemap.xml
          git commit -m "chore: update sitemap" || exit 0
          git push
```

## Troubleshooting

### Sitemap not updating?

1. Clear Netlify cache: Netlify Dashboard → Deploys → Clear cache and deploy
2. Regenerate sitemap: `npm run generate-sitemap`
3. Commit and push changes

### Search engines not crawling?

1. Verify robots.txt is accessible
2. Submit sitemap to Google Search Console
3. Check for crawl errors in Search Console
4. Ensure your site is not blocking search engines

## Resources

- [Google Sitemap Guidelines](https://developers.google.com/search/docs/advanced/sitemaps/overview)
- [Sitemap Protocol](https://www.sitemaps.org/protocol.html)
- [Robots.txt Specification](https://developers.google.com/search/docs/advanced/robots/intro)

