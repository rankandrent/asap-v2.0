# Dynamic Sitemap System Guide

## Overview

This project now includes a **fully dynamic, component-based sitemap system** that automatically updates whenever new manufacturers, categories, subcategories, or parts are added to the database. The sitemaps are generated on-the-fly using Netlify Functions.

## Domain

All sitemaps use the domain: **https://asap-amatom.com**

## Sitemap Structure

### 1. Main Sitemap: `/sitemap.xml`

**URL:** `https://asap-amatom.com/sitemap.xml`

**Contains:**
- Static pages:
  - Homepage (`/`)
  - About Us (`/about-us`)
  - Categories (`/categories`)
  - Search (`/search`)
- Manufacturer sitemap links (dynamically generated):
  - `/Amatom.xml`
  - `/[OtherManufacturer].xml`
  - etc.

### 2. Manufacturer Sitemap: `/[manufacturer].xml`

**Example:** `https://asap-amatom.com/Amatom.xml`

**Contains:**
- All category-level sitemaps for that manufacturer:
  - `/Standoffs.xml`
  - `/Handles.xml`
  - `/Spacers.xml`
  - etc.

### 3. Category Sitemap: `/[category].xml`

**Example:** `https://asap-amatom.com/Standoffs.xml`

**Contains:**
- All parts in that category
- Supports pagination for categories with 50,000+ parts:
  - First page: `/Standoffs.xml`
  - Second page: `/Standoffs.xml?page=2`
  - etc.

## How It Works

### Dynamic Generation

1. **No Static Files:** Sitemaps are generated on-demand using Netlify Functions
2. **Database-Driven:** All data comes directly from your Supabase database
3. **Auto-Updates:** New manufacturers, categories, or parts automatically appear in sitemaps

### Technical Implementation

- **Netlify Function:** `netlify/functions/sitemap/sitemap.ts`
- **Routing:** Handled via `netlify.toml` redirects
- **Caching:** 1-hour cache for performance (`Cache-Control: public, max-age=3600`)

## Features

### ✅ Automatic Updates
- New manufacturers → Automatically appear in `/sitemap.xml`
- New categories → Automatically appear in `/[manufacturer].xml`
- New parts → Automatically appear in `/[category].xml`

### ✅ Pagination Support
- Categories with 50,000+ parts are split across multiple pages
- Google's limit: 50,000 URLs per sitemap
- Large categories use `?page=N` parameter

### ✅ SEO Optimized
- Proper XML format following sitemaps.org schema
- Priority and change frequency settings
- Last modification dates

## Configuration

### Environment Variables

Make sure these are set in Netlify:
- `VITE_SUPABASE_URL` - Your Supabase project URL
- `VITE_SUPABASE_ANON_KEY` - Your Supabase anon key

### Netlify Redirects

The `netlify.toml` file includes redirects that route XML requests to the Netlify Function:
```toml
[[redirects]]
  from = "/sitemap.xml"
  to = "/.netlify/functions/sitemap"
  status = 200
  force = true

[[redirects]]
  from = "/*.xml"
  to = "/.netlify/functions/sitemap/:splat"
  status = 200
  force = true
```

## Testing

### Test Main Sitemap
```
https://asap-amatom.com/sitemap.xml
```

### Test Manufacturer Sitemap
```
https://asap-amatom.com/Amatom.xml
```

### Test Category Sitemap
```
https://asap-amatom.com/Standoffs.xml
```

### Test Pagination
```
https://asap-amatom.com/Standoffs.xml?page=2
```

## Google Search Console

1. Submit your main sitemap: `https://asap-amatom.com/sitemap.xml`
2. Google will automatically discover manufacturer and category sitemaps through the links
3. No need to manually submit individual sitemaps

## Priority Levels

- **Homepage:** Priority 1.0, Updated Daily
- **Static Pages:** Priority 0.9, Updated Monthly/Weekly
- **Categories:** Priority 0.9, Updated Weekly
- **Parts:** Priority 0.7, Updated Monthly

## Performance

- **Caching:** 1-hour cache reduces database queries
- **Lazy Loading:** Data is fetched only when sitemap is requested
- **Efficient Queries:** Uses pagination and limits to keep queries fast

## Maintenance

**No manual updates needed!** The system automatically:
- Detects new manufacturers
- Discovers new categories
- Includes new parts
- Updates last modification dates

## Troubleshooting

### Sitemap returns 500 error
- Check environment variables in Netlify
- Verify Supabase connection
- Check Netlify Function logs

### Manufacturer/Category not found
- Verify the name exists in the database
- Check for typos or case sensitivity
- Ensure data is in the `products_data` table

### Parts not showing in category sitemap
- Verify category name matches exactly
- Check pagination (use `?page=2` for large categories)
- Ensure parts have valid `productname` values

