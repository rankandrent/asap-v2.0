# Hierarchical Sitemap Structure

## Overview

This project uses a **hierarchical sitemap structure** optimized for large e-commerce sites with 500,000+ products. This approach follows Google's best practices for large websites.

## Sitemap Hierarchy

```
📄 sitemap.xml (Main Index)
│
├── 📄 sitemap-main.xml (Main Pages)
│   ├── Homepage (/)
│   ├── Categories Page (/categories)
│   └── Search Page (/search)
│
├── 📁 sitemap-standoffs.xml (Standoffs Category Index)
│   ├── 📄 sitemap-standoffs-page.xml
│   │   └── /categories/standoffs
│   │
│   ├── 📄 sitemap-standoffs-brass-standoffs.xml (1001 URLs)
│   │   ├── /categories/standoffs/brass-standoffs
│   │   └── 1000 parts URLs
│   │
│   ├── 📄 sitemap-standoffs-aluminum-standoffs.xml (1001 URLs)
│   │   ├── /categories/standoffs/aluminum-standoffs
│   │   └── 1000 parts URLs
│   │
│   ├── 📄 sitemap-standoffs-stainless-steel-standoffs.xml (1001 URLs)
│   │   ├── /categories/standoffs/stainless-steel-standoffs
│   │   └── 1000 parts URLs
│   │
│   └── 📄 sitemap-standoffs-steel-standoffs.xml (1001 URLs)
│       ├── /categories/standoffs/steel-standoffs
│       └── 1000 parts URLs
│
└── 📁 sitemap-spacers.xml (Spacers Category Index)
    ├── 📄 sitemap-spacers-page.xml
    │   └── /categories/spacers
    │
    ├── 📄 sitemap-spacers-brass-spacers.xml (1001 URLs)
    ├── 📄 sitemap-spacers-aluminum-spacers.xml (1001 URLs)
    ├── 📄 sitemap-spacers-steel-spacers.xml (1001 URLs)
    ├── 📄 sitemap-spacers-stainless-steel-spacers.xml (1001 URLs)
    ├── 📄 sitemap-spacers-nylon-spacers.xml (1001 URLs)
    └── 📄 sitemap-spacers-phenolic-spacers.xml (1001 URLs)
```

## How It Works

### Level 1: Main Sitemap Index
**File:** `sitemap.xml`

This is the root sitemap that search engines will crawl first. It contains references to:
- Main pages sitemap
- All category sitemap indexes

```xml
<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap>
    <loc>https://www.asapamatom.com/sitemap-main.xml</loc>
    <lastmod>2025-11-05</lastmod>
  </sitemap>
  <sitemap>
    <loc>https://www.asapamatom.com/sitemap-standoffs.xml</loc>
    <lastmod>2025-11-05</lastmod>
  </sitemap>
  <sitemap>
    <loc>https://www.asapamatom.com/sitemap-spacers.xml</loc>
    <lastmod>2025-11-05</lastmod>
  </sitemap>
</sitemapindex>
```

### Level 2: Category Sitemap Indexes
**Example:** `sitemap-standoffs.xml`

Each category has its own sitemap index that references:
- The category page itself
- All subcategory sitemaps (which contain parts)

```xml
<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap>
    <loc>https://www.asapamatom.com/sitemap-standoffs-page.xml</loc>
    <lastmod>2025-11-05</lastmod>
  </sitemap>
  <sitemap>
    <loc>https://www.asapamatom.com/sitemap-standoffs-brass-standoffs.xml</loc>
    <lastmod>2025-11-05</lastmod>
  </sitemap>
  <sitemap>
    <loc>https://www.asapamatom.com/sitemap-standoffs-aluminum-standoffs.xml</loc>
    <lastmod>2025-11-05</lastmod>
  </sitemap>
  <!-- ... more subcategories ... -->
</sitemapindex>
```

### Level 3: Subcategory Sitemaps with Parts
**Example:** `sitemap-standoffs-brass-standoffs.xml`

Each subcategory sitemap contains:
- The subcategory page URL
- All parts within that subcategory

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://www.asapamatom.com/categories/standoffs/brass-standoffs</loc>
    <lastmod>2025-11-05</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://www.asapamatom.com/parts/17300-B-0256-0</loc>
    <lastmod>2025-11-05</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  <!-- ... 1000 more parts ... -->
</urlset>
```

## Benefits

### 1. **Scalability**
- ✅ Can handle 500,000+ products easily
- ✅ Each sitemap file stays under 50MB limit
- ✅ Easy to add new categories without restructuring

### 2. **SEO Optimization**
- ✅ Clear hierarchy helps search engines understand site structure
- ✅ Category-based organization improves crawl efficiency
- ✅ Proper priority and update frequency settings

### 3. **Maintainability**
- ✅ Easy to regenerate specific category sitemaps
- ✅ Modular structure makes updates simple
- ✅ Clear naming convention

### 4. **Performance**
- ✅ Search engines can crawl sitemaps in parallel
- ✅ Faster discovery of new content
- ✅ Better crawl budget utilization

## Statistics

**Current Site:**
- Total URLs: **10,015**
- Categories: **2** (Standoffs, Spacers)
- Subcategories: **10** (4 Standoffs + 6 Spacers)
- Parts per subcategory: ~1,000
- Sitemap files created: **15**

## Usage

### Generate Hierarchical Sitemaps

```bash
npm run generate-sitemap:hierarchical
```

This command will:
1. ✅ Fetch all categories from database
2. ✅ Fetch all subcategories for each category
3. ✅ Fetch all parts for each subcategory
4. ✅ Generate hierarchical sitemap structure
5. ✅ Save all files to `public/` folder

### File Naming Convention

- **Main index:** `sitemap.xml`
- **Main pages:** `sitemap-main.xml`
- **Category index:** `sitemap-{category-slug}.xml`
- **Category page:** `sitemap-{category-slug}-page.xml`
- **Subcategory with parts:** `sitemap-{category-slug}-{subcategory-slug}.xml`

## Accessing Sitemaps

After deployment, sitemaps will be accessible at:

### Main Entry Point
- https://www.asapamatom.com/sitemap.xml

### Category Sitemaps
- https://www.asapamatom.com/sitemap-standoffs.xml
- https://www.asapamatom.com/sitemap-spacers.xml

### Subcategory Sitemaps (with parts)
- https://www.asapamatom.com/sitemap-standoffs-brass-standoffs.xml
- https://www.asapamatom.com/sitemap-standoffs-aluminum-standoffs.xml
- https://www.asapamatom.com/sitemap-spacers-brass-spacers.xml
- etc.

## Submitting to Search Engines

### Google Search Console

1. Go to: https://search.google.com/search-console
2. Add property: `asapamatom.com`
3. Submit **only the main sitemap**: `https://www.asapamatom.com/sitemap.xml`
4. Google will automatically discover and crawl all referenced sitemaps

### Bing Webmaster Tools

1. Go to: https://www.bing.com/webmasters
2. Add site: `asapamatom.com`
3. Submit **only the main sitemap**: `https://www.asapamatom.com/sitemap.xml`

⚠️ **Important:** Only submit the main `sitemap.xml`. Search engines will automatically discover the rest of the hierarchy.

## robots.txt Integration

Your `robots.txt` already references the main sitemap:

```
User-agent: *
Allow: /

Disallow: /admin

Sitemap: https://www.asapamatom.com/sitemap.xml
```

## Monitoring

### Check Sitemap Status

**Google Search Console:**
- Navigate to: Sitemaps section
- View: Discovered URLs, Index coverage
- Monitor: Crawl errors

**Manual Verification:**
```bash
# Check main sitemap
curl https://www.asapamatom.com/sitemap.xml

# Check category sitemap
curl https://www.asapamatom.com/sitemap-standoffs.xml

# Check subcategory sitemap
curl https://www.asapamatom.com/sitemap-standoffs-brass-standoffs.xml
```

## Best Practices

### When to Regenerate

- ✅ **After adding new products** - Run generator to include new parts
- ✅ **After adding categories/subcategories** - Structure will auto-update
- ✅ **Monthly** - Keep lastmod dates fresh
- ✅ **Before major deployments** - Ensure everything is current

### Automation Options

**Option 1: GitHub Actions**
```yaml
# .github/workflows/update-sitemap.yml
name: Update Sitemap
on:
  schedule:
    - cron: '0 2 * * *'  # Daily at 2 AM
  workflow_dispatch:

jobs:
  update:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm ci
      - run: npm run generate-sitemap:hierarchical
      - run: |
          git config user.name "GitHub Actions"
          git config user.email "actions@github.com"
          git add public/sitemap*.xml
          git commit -m "chore: update sitemaps" || exit 0
          git push
```

**Option 2: Netlify Build Plugin**
Add to `netlify.toml`:
```toml
[[plugins]]
  package = "@netlify/plugin-sitemap"
```

## Troubleshooting

### Sitemap not appearing?

1. Check file exists: `ls public/sitemap*.xml`
2. Verify build includes public folder
3. Clear Netlify cache and redeploy

### Search engines not crawling?

1. Verify sitemap is accessible via URL
2. Check robots.txt allows crawling
3. Submit sitemap to Search Console
4. Wait 24-48 hours for initial crawl

### Too many files?

Current structure: 15 files for 10,000+ URLs
- This is optimal and within Google limits
- Each file is < 10MB
- Structure is easy to maintain

## Technical Details

### Limits

- **Max URLs per sitemap:** 50,000 (we use ~1,000)
- **Max file size:** 50MB uncompressed (we're at ~180KB per file)
- **Max sitemaps in index:** 50,000 (we use ~15)

### Performance

- Generation time: ~30-60 seconds for full database
- File sizes: 180KB per subcategory sitemap
- Total size: ~2.5MB for all sitemaps

## Comparison: Simple vs Hierarchical

### Simple Sitemap (Old)
```
sitemap.xml (10,000 URLs)
```
❌ Hard to scale beyond 50,000 URLs
❌ Large file size
❌ Slow to regenerate
❌ No organization

### Hierarchical Sitemap (New)
```
sitemap.xml → category indexes → subcategory sitemaps → parts
```
✅ Scales to millions of URLs
✅ Small, manageable files
✅ Fast partial updates
✅ Clear organization
✅ Better SEO structure

## Resources

- [Google Sitemap Guidelines](https://developers.google.com/search/docs/advanced/sitemaps/overview)
- [Sitemap Index Protocol](https://www.sitemaps.org/protocol.html)
- [Large Site Sitemaps](https://developers.google.com/search/docs/advanced/sitemaps/large-sitemaps)

