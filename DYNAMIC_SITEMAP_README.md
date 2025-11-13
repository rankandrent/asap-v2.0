# Dynamic Sitemap System

## Overview
This dynamic sitemap system automatically generates hierarchical sitemaps based on your database content. It follows SEO best practices and handles large datasets efficiently.

## Sitemap Structure

```
https://asap-amatom.com/sitemap.xml (Main Sitemap Index)
├── https://asap-amatom.com/static-pages.xml (Static pages)
│   ├── https://asap-amatom.com/
│   ├── https://asap-amatom.com/about-us
│   ├── https://asap-amatom.com/search
│   └── https://asap-amatom.com/categories
│
└── https://asap-amatom.com/Amatom.xml (Manufacturer Sitemap Index)
    ├── https://asap-amatom.com/handles.xml (Category Sitemap)
    │   ├── https://asap-amatom.com/parts/PRODUCT-1
    │   ├── https://asap-amatom.com/parts/PRODUCT-2
    │   └── ... (up to 50,000 parts per file)
    │
    ├── https://asap-amatom.com/standoffs-1.xml (Category Sitemap - Part 1)
    │   └── ... (50,000 parts)
    │
    ├── https://asap-amatom.com/standoffs-2.xml (Category Sitemap - Part 2)
    │   └── ... (50,000 parts)
    │
    ├── https://asap-amatom.com/standoffs-3.xml (Category Sitemap - Part 3)
    │   └── ... (remaining parts)
    │
    └── ... (more category sitemaps)
```

## Features

1. **Automatic Updates**: Sitemap reflects current database content
2. **Hierarchical Structure**: 
   - Main sitemap → Manufacturer sitemaps → Category sitemaps → Parts
3. **SEO Optimized**:
   - Max 50,000 URLs per sitemap file (Google limit)
   - Proper XML formatting
   - Last modified dates
   - Priority and change frequency
4. **Large Dataset Support**: 
   - Automatically splits categories with 100k+ parts into multiple files
   - Example: `standoffs-1.xml`, `standoffs-2.xml`, `standoffs-3.xml`

## How to Use

### Generate Sitemaps

```bash
# Generate dynamic sitemap (recommended)
npm run generate-sitemap:dynamic

# This will:
# 1. Query your database for all manufacturers
# 2. Generate manufacturer-level sitemap indexes
# 3. Generate category-level sitemaps with parts
# 4. Create main sitemap.xml that links everything
```

### Environment Variables Required

Make sure these are set in your `.env` file:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Deployment

### Option 1: Manual Generation (Current)
1. Run `npm run generate-sitemap:dynamic` locally
2. Deploy the generated `public/*.xml` files to your server
3. Re-run whenever database changes significantly

### Option 2: Automated with CI/CD
Add to your deployment pipeline:

```yaml
# Example for GitHub Actions
- name: Generate Sitemap
  run: npm run generate-sitemap:dynamic
  
- name: Deploy
  run: npm run build && netlify deploy --prod
```

### Option 3: Serverless Function (Recommended)
Create a Netlify Function that generates sitemaps on-demand:

```bash
# Access: https://asap-amatom.com/.netlify/functions/generate-sitemap
# This would regenerate sitemaps automatically
```

## Sitemap Index Structure

### Main Sitemap (`sitemap.xml`)
Lists all manufacturer sitemaps and static pages sitemap.

### Manufacturer Sitemap (`Amatom.xml`)
Lists all category sitemaps for that manufacturer.

### Category Sitemap (`handles.xml`, `standoffs-1.xml`)
Lists all parts in that category (max 50,000 per file).

## SEO Best Practices

1. **URL Limits**: No sitemap file exceeds 50,000 URLs
2. **File Size**: Each file is under 50MB uncompressed
3. **Update Frequency**: 
   - Static pages: Monthly
   - Category pages: Weekly
   - Product pages: Weekly
4. **Priority**:
   - Homepage: 1.0
   - About/Search: 0.8-0.9
   - Category pages: 0.7
   - Product pages: 0.6

## Submitting to Search Engines

### Google Search Console
1. Go to https://search.google.com/search-console
2. Add property: `https://asap-amatom.com`
3. Go to Sitemaps section
4. Submit: `https://asap-amatom.com/sitemap.xml`

### Bing Webmaster Tools
1. Go to https://www.bing.com/webmasters
2. Add site: `https://asap-amatom.com`
3. Submit sitemap: `https://asap-amatom.com/sitemap.xml`

## Monitoring

Check sitemap status in:
- Google Search Console → Sitemaps
- Check for errors and coverage
- Monitor indexing status

## Troubleshooting

### Sitemap not updating?
```bash
# 1. Clear old sitemaps
rm public/*.xml

# 2. Regenerate
npm run generate-sitemap:dynamic

# 3. Redeploy
npm run build
netlify deploy --prod
```

### Database connection issues?
- Verify `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`
- Check Supabase project is active
- Test database connection manually

### Too many parts in one category?
The script automatically splits categories into multiple files when they exceed 50,000 parts.

## Example URLs

### Main Sitemap
`https://asap-amatom.com/sitemap.xml`

### Manufacturer Sitemap
`https://asap-amatom.com/Amatom.xml`

### Category Sitemaps
- `https://asap-amatom.com/handles.xml`
- `https://asap-amatom.com/standoffs-1.xml`
- `https://asap-amatom.com/standoffs-2.xml`
- `https://asap-amatom.com/spacers.xml`

### Static Pages Sitemap
`https://asap-amatom.com/static-pages.xml`

## Maintenance Schedule

### Weekly
- Run `npm run generate-sitemap:dynamic` if significant product updates

### Monthly
- Verify sitemap in Google Search Console
- Check for crawl errors
- Update static pages if content changed

### As Needed
- When adding new manufacturers
- When adding new categories
- After bulk product imports

