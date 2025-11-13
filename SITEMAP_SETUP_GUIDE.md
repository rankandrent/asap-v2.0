# Dynamic Sitemap Setup - Complete Guide

## ✅ What Has Been Done

### 1. Domain Updated Everywhere
- Old: `asapamatom.netlify.app`
- **New: `https://asap-amatom.com`**

Updated in:
- ✅ `index.html` - All meta tags, canonical URLs, Schema.org
- ✅ `public/robots.txt` - Sitemap reference
- ✅ `dist/robots.txt` - Sitemap reference
- ✅ All React components (`src/**/*.tsx`)
- ✅ `src/pages/HomePage.tsx` - Schema and metadata
- ✅ `src/components/layout/Footer.tsx` - Contact info

### 2. Dynamic Sitemap System Created

#### New Files:
1. **`scripts/generate-dynamic-sitemap.ts`** - Main sitemap generation script
2. **`DYNAMIC_SITEMAP_README.md`** - Complete documentation
3. **`SITEMAP_SETUP_GUIDE.md`** - This file

#### New npm Script:
```bash
npm run generate-sitemap:dynamic
```

## 🗂️ Sitemap Structure (As Requested)

```
https://asap-amatom.com/sitemap.xml (Main Index)
│
├── https://asap-amatom.com/static-pages.xml
│   ├── https://asap-amatom.com/
│   ├── https://asap-amatom.com/about-us
│   ├── https://asap-amatom.com/search
│   └── https://asap-amatom.com/categories
│
└── https://asap-amatom.com/Amatom.xml (Manufacturer Index)
    │
    ├── https://asap-amatom.com/handles.xml
    │   └── All parts in "Handles" category
    │
    ├── https://asap-amatom.com/standoffs-1.xml (First 50,000 parts)
    ├── https://asap-amatom.com/standoffs-2.xml (Next 50,000 parts)
    ├── https://asap-amatom.com/standoffs-3.xml (Remaining parts)
    │   └── Automatically splits if >50,000 parts
    │
    ├── https://asap-amatom.com/spacers.xml
    │   └── All parts in "Spacers" category
    │
    └── ... (All other categories)
```

## 📋 Step-by-Step Usage

### Step 1: Generate Sitemap (First Time)

```bash
# Make sure you have environment variables set
# In your .env file:
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# Generate sitemap
npm run generate-sitemap:dynamic
```

### Step 2: What Happens?

The script will:
1. ✅ Connect to your Supabase database
2. ✅ Fetch all manufacturers (e.g., "Amatom")
3. ✅ For each manufacturer:
   - Fetch all categories (Handles, Standoffs, Spacers, etc.)
   - For each category:
     - Count total parts
     - If > 50,000 parts → Split into multiple files
     - Generate XML sitemap with all part URLs
4. ✅ Generate manufacturer sitemap index
5. ✅ Generate main sitemap.xml

### Step 3: Files Generated

After running the script, you'll see:
```
public/
├── sitemap.xml                    # Main index
├── static-pages.xml              # Static pages
├── Amatom.xml                    # Manufacturer index
├── handles.xml                   # Category sitemap
├── standoffs-1.xml               # Category sitemap (part 1)
├── standoffs-2.xml               # Category sitemap (part 2)
├── standoffs-3.xml               # Category sitemap (part 3)
├── spacers.xml                   # Category sitemap
└── ... (more category sitemaps)
```

### Step 4: Deploy

```bash
# Build your app
npm run build

# Deploy to Netlify (or your hosting)
netlify deploy --prod
```

## 🔄 When to Regenerate Sitemap?

Regenerate sitemap when:
- ✅ New manufacturer added to database
- ✅ New category added
- ✅ New parts added (weekly/monthly basis)
- ✅ Parts removed or updated

## 🤖 Automatic Updates (Recommended Setup)

### Option 1: Schedule with CI/CD

Add to `.github/workflows/generate-sitemap.yml`:
```yaml
name: Generate Sitemap
on:
  schedule:
    - cron: '0 0 * * 0'  # Every Sunday at midnight
  workflow_dispatch:      # Manual trigger

jobs:
  generate-sitemap:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          
      - name: Install dependencies
        run: npm install
        
      - name: Generate sitemap
        env:
          VITE_SUPABASE_URL: ${{ secrets.VITE_SUPABASE_URL }}
          VITE_SUPABASE_ANON_KEY: ${{ secrets.VITE_SUPABASE_ANON_KEY }}
        run: npm run generate-sitemap:dynamic
        
      - name: Commit and push
        run: |
          git config --global user.name 'GitHub Actions'
          git config --global user.email 'actions@github.com'
          git add public/*.xml
          git commit -m "Update sitemaps [automated]" || exit 0
          git push
```

### Option 2: Netlify Function (On-Demand)

Create `netlify/functions/generate-sitemap.ts`:
```typescript
import { Handler } from '@netlify/functions'
import { generateMainSitemap } from '../../scripts/generate-dynamic-sitemap'

export const handler: Handler = async (event, context) => {
  try {
    await generateMainSitemap()
    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Sitemap generated successfully' })
    }
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to generate sitemap' })
    }
  }
}
```

Then trigger via:
```bash
curl https://asap-amatom.com/.netlify/functions/generate-sitemap
```

### Option 3: Manual (Current Setup)

```bash
# Run locally when needed
npm run generate-sitemap:dynamic

# Then deploy
npm run build
netlify deploy --prod
```

## 🔍 SEO Best Practices Implemented

1. ✅ **URL Limits**: Max 50,000 URLs per sitemap file
2. ✅ **Automatic Splitting**: Categories with >50k parts split into multiple files
3. ✅ **Proper XML Format**: Valid sitemap XML structure
4. ✅ **Last Modified Dates**: Included for better crawling
5. ✅ **Change Frequency**: Set appropriately for each URL type
6. ✅ **Priority Values**: Homepage=1.0, Products=0.6, etc.
7. ✅ **Sitemap Index**: Main sitemap references all sub-sitemaps

## 📊 Example URLs

### Accessing Your Sitemaps

1. **Main Sitemap**
   ```
   https://asap-amatom.com/sitemap.xml
   ```
   Shows: Static pages sitemap + Manufacturer sitemaps

2. **Manufacturer Sitemap**
   ```
   https://asap-amatom.com/Amatom.xml
   ```
   Shows: All category sitemaps for Amatom

3. **Category Sitemap (Small)**
   ```
   https://asap-amatom.com/handles.xml
   ```
   Shows: All parts in Handles category

4. **Category Sitemap (Large - Split)**
   ```
   https://asap-amatom.com/standoffs-1.xml
   https://asap-amatom.com/standoffs-2.xml
   https://asap-amatom.com/standoffs-3.xml
   ```
   Shows: Standoffs parts (split because >100k parts)

## 🚀 Submit to Search Engines

### Google Search Console

1. Go to: https://search.google.com/search-console
2. Add property: `https://asap-amatom.com`
3. Verify ownership (HTML tag method)
4. Go to **Sitemaps** section
5. Submit: `https://asap-amatom.com/sitemap.xml`
6. Wait for indexing (can take days/weeks)

### Bing Webmaster Tools

1. Go to: https://www.bing.com/webmasters
2. Add site: `https://asap-amatom.com`
3. Verify ownership
4. Submit sitemap: `https://asap-amatom.com/sitemap.xml`

## 📈 Monitoring

### Check Sitemap Status

**Google Search Console:**
- Sitemaps → View submitted sitemaps
- Check for errors/warnings
- Monitor indexed pages

**Manual Check:**
```bash
# Check if sitemaps are accessible
curl https://asap-amatom.com/sitemap.xml
curl https://asap-amatom.com/Amatom.xml
curl https://asap-amatom.com/handles.xml
```

### Typical Timeline

- **Submitted**: Immediately
- **Discovered**: Within hours
- **Indexed**: Days to weeks
- **Full Indexing**: 1-3 months for large sites

## 🔧 Troubleshooting

### Issue: Sitemap not generating

**Solution:**
```bash
# Check environment variables
echo $VITE_SUPABASE_URL
echo $VITE_SUPABASE_ANON_KEY

# Test database connection
npm run dev
# Check browser console for errors
```

### Issue: Too many files generated

**Cause:** Categories with millions of parts
**Solution:** Script automatically splits at 50k. This is normal and SEO-friendly.

### Issue: Sitemap not updating on site

**Solution:**
```bash
# 1. Regenerate
npm run generate-sitemap:dynamic

# 2. Clear old build
rm -rf dist

# 3. Rebuild
npm run build

# 4. Redeploy
netlify deploy --prod
```

### Issue: Google says "Couldn't fetch"

**Cause:** File not publicly accessible
**Solution:**
1. Check file exists: `ls public/sitemap.xml`
2. Rebuild: `npm run build`
3. Verify deployed: Visit `https://asap-amatom.com/sitemap.xml`
4. Check robots.txt allows access

## 📝 Summary

### What You Now Have:

1. ✅ **Dynamic Sitemap System**
   - Automatically reads from database
   - Handles unlimited manufacturers
   - Handles unlimited categories
   - Handles unlimited parts (with auto-splitting)

2. ✅ **Hierarchical Structure**
   - Main sitemap → Manufacturer → Category → Parts
   - As you requested

3. ✅ **SEO Optimized**
   - Follows Google guidelines
   - Proper XML format
   - Handles large datasets

4. ✅ **Easy to Use**
   - Single command: `npm run generate-sitemap:dynamic`
   - Automatic file generation
   - Ready to deploy

### Next Steps:

1. ✅ Test locally: `npm run generate-sitemap:dynamic`
2. ✅ Check generated files in `public/` folder
3. ✅ Deploy: `npm run build && netlify deploy --prod`
4. ✅ Submit to Google Search Console
5. ✅ Monitor indexing status

## 🎯 Important Notes

1. **Database Must Have Data**: Script needs actual data to generate sitemaps
2. **Large Sites**: First generation may take 10-30 minutes
3. **Regular Updates**: Run weekly/monthly for best SEO
4. **Backup**: Keep old sitemaps until new ones are indexed

## 📞 Need Help?

If sitemaps aren't working:
1. Check console logs during generation
2. Verify `.env` variables
3. Test database connection
4. Check file permissions in `public/` folder

---

**Created**: $(date)
**Domain**: `https://asap-amatom.com`
**Status**: ✅ Ready to use

