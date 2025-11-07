# Hierarchical Sitemap Structure

## 📊 Sitemap Organization (Category-Based)

Your sitemap is now organized in a **hierarchical, category-based structure** for better SEO and organization.

### 🏗️ Structure Overview:

```
sitemap.xml (MAIN INDEX)
│
├── sitemap-main.xml (3 URLs)
│   ├── Homepage: https://asapamatom.netlify.app/
│   ├── Categories Page: https://asapamatom.netlify.app/categories
│   └── Search Page: https://asapamatom.netlify.app/search
│
└── sitemap-standoffs.xml (CATEGORY INDEX)
    │
    ├── sitemap-standoffs-page.xml (1 URL)
    │   └── Category Page: .../categories/standoffs
    │
    ├── sitemap-standoffs-brass-standoffs-1.xml (50,000 parts)
    │   ├── Subcategory Page: .../categories/standoffs/brass-standoffs
    │   └── 49,999 part URLs
    │
    ├── sitemap-standoffs-brass-standoffs-2.xml (50,000 parts)
    │   └── 50,000 part URLs
    │
    ├── sitemap-standoffs-brass-standoffs-3.xml (22,485 parts)
    │   └── 22,484 part URLs
    │   [Total Brass Standoffs: 122,484 parts]
    │
    ├── sitemap-standoffs-aluminum-standoffs-1.xml (50,000 parts)
    ├── sitemap-standoffs-aluminum-standoffs-2.xml (50,000 parts)
    ├── sitemap-standoffs-aluminum-standoffs-3.xml (20,407 parts)
    │   [Total Aluminum Standoffs: 120,406 parts]
    │
    ├── sitemap-standoffs-steel-standoffs-1.xml (50,000 parts)
    ├── sitemap-standoffs-steel-standoffs-2.xml (32,462 parts)
    │   [Total Steel Standoffs: 82,461 parts]
    │
    ├── sitemap-standoffs-stainless-steel-standoffs.xml (35,869 parts)
    │   [Total Stainless Steel Standoffs: 35,868 parts]
    │
    └── sitemap-standoffs-nylon-standoffs.xml (4,646 parts)
        [Total Nylon Standoffs: 4,645 parts]
```

## 📈 Statistics:

- **Total URLs:** 365,873
- **Total Parts:** 365,864
- **Categories:** 1 (Standoffs)
- **Subcategories:** 5
  - Brass Standoffs: 122,484 parts
  - Aluminum Standoffs: 120,406 parts
  - Steel Standoffs: 82,461 parts
  - Stainless Steel Standoffs: 35,868 parts
  - Nylon Standoffs: 4,645 parts

## 📁 Files Created:

### Main Level:
- `sitemap.xml` - Main index (2 sitemap references)
- `sitemap-main.xml` - Static pages (3 URLs)

### Category Level:
- `sitemap-standoffs.xml` - Standoffs category index (11 sitemap references)
- `sitemap-standoffs-page.xml` - Category page (1 URL)

### Subcategory Level (with parts):
- `sitemap-standoffs-brass-standoffs-1.xml` (50,000 URLs)
- `sitemap-standoffs-brass-standoffs-2.xml` (50,000 URLs)
- `sitemap-standoffs-brass-standoffs-3.xml` (22,485 URLs)
- `sitemap-standoffs-aluminum-standoffs-1.xml` (50,000 URLs)
- `sitemap-standoffs-aluminum-standoffs-2.xml` (50,000 URLs)
- `sitemap-standoffs-aluminum-standoffs-3.xml` (20,407 URLs)
- `sitemap-standoffs-steel-standoffs-1.xml` (50,000 URLs)
- `sitemap-standoffs-steel-standoffs-2.xml` (32,462 URLs)
- `sitemap-standoffs-stainless-steel-standoffs.xml` (35,869 URLs)
- `sitemap-standoffs-nylon-standoffs.xml` (4,646 URLs)

## 🎯 Benefits of Hierarchical Structure:

1. **Better Organization:** Categories → Subcategories → Parts
2. **Easier to Maintain:** Update specific category sitemaps independently
3. **SEO Friendly:** Search engines can understand your site structure
4. **Scalable:** Easy to add new categories without reorganizing everything
5. **Faster Indexing:** Google can prioritize important categories

## 🔗 Main Sitemap URL:

```
https://asapamatom.netlify.app/sitemap.xml
```

## 📝 How It Works:

1. **Google crawls:** `sitemap.xml`
2. **Finds:** `sitemap-main.xml` + `sitemap-standoffs.xml`
3. **Crawls category:** `sitemap-standoffs.xml`
4. **Finds all subcategory sitemaps:** 11 files
5. **Indexes all parts:** 365,000+ pages

## ✅ Ready for:

- Google Search Console submission
- Bing Webmaster Tools
- Better SEO indexing
- Organized site structure

---

**Generated:** November 7, 2025  
**Domain:** https://asapamatom.netlify.app  
**Structure:** Hierarchical (Category-Based)

