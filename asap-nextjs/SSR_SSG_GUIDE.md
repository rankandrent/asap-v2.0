# SSR/SSG Implementation Guide

This guide explains how Server-Side Rendering (SSR) and Static Site Generation (SSG) are implemented in this Next.js application.

## Overview

This Next.js application uses a **hybrid approach** combining:
1. **Next.js Metadata API** - For server-side rendered meta tags (primary method)
2. **React Helmet Async** - For client-side dynamic meta tag updates (when needed)
3. **ISR (Incremental Static Regeneration)** - For optimal performance with 500k+ pages

## Architecture

### Server-Side Rendering (SSR)

All pages are **server-rendered by default** in Next.js 14 App Router. This means:
- HTML is generated on the server
- Meta tags are included in the initial HTML response
- Search engines see fully rendered content immediately
- No JavaScript required for SEO

### Static Site Generation (SSG) with ISR

We use **Incremental Static Regeneration (ISR)** for optimal performance:

```typescript
// Example from app/parts/[productname]/page.tsx
export const revalidate = 86400 // Revalidate every 24 hours
export const dynamicParams = true // Generate pages on-demand
```

**How it works:**
1. **Build time**: Pre-generate important pages (homepage, categories, subcategories)
2. **Runtime**: Generate part pages on first request (on-demand ISR)
3. **Caching**: Pages are cached and served instantly
4. **Revalidation**: Pages regenerate in background after cache expires

## Implementation Details

### 1. Next.js Metadata API (Primary - SSR)

**Location**: Each page file exports `generateMetadata` function

**Example** (`app/parts/[productname]/page.tsx`):
```typescript
export async function generateMetadata({ 
  params 
}: { 
  params: { productname: string } 
}): Promise<Metadata> {
  const part = await getPartByProductname(decodedProductname, 'Amatom')
  
  return {
    title: `${part.productname} - Amatom Parts`,
    description: `Buy ${part.productname}...`,
    keywords: '...',
    alternates: {
      canonical: `https://asap-amatom.com/parts/${part.productname}`,
    },
    openGraph: {
      title: '...',
      description: '...',
      type: 'product',
      images: [...],
    },
  }
}
```

**Benefits:**
- ✅ Server-side rendered (in HTML source)
- ✅ No JavaScript required
- ✅ Perfect for SEO
- ✅ Automatic canonical URLs
- ✅ Type-safe

### 2. React Helmet Async (Secondary - Client-Side)

**Location**: `src/components/common/SEO.tsx`

**When to use:**
- Client-side dynamic updates
- Real-time meta tag changes
- Interactive components that update meta tags

**Example usage**:
```typescript
'use client'

import SEO from '@/components/common/SEO'

export default function DynamicPage() {
  const [data, setData] = useState(null)
  
  return (
    <>
      {data && (
        <SEO
          title={data.title}
          description={data.description}
          canonical={`https://asap-amatom.com/page/${data.id}`}
        />
      )}
      {/* Page content */}
    </>
  )
}
```

**Note**: React Helmet updates meta tags client-side. For SEO-critical pages, always use Next.js Metadata API.

## Page Types & Configuration

### Homepage (`app/page.tsx`)
- **Type**: ISR (Incremental Static Regeneration)
- **Revalidation**: 1 hour
- **Pre-generated**: Yes (at build time)

```typescript
export const revalidate = 3600 // 1 hour
```

### Category Pages (`app/categories/[categorySlug]/page.tsx`)
- **Type**: ISR with Static Params
- **Revalidation**: 1 hour
- **Pre-generated**: All categories at build time

```typescript
export const revalidate = 3600
export async function generateStaticParams() {
  const categories = await getCategories('Amatom')
  return categories.map(c => ({ categorySlug: c.slug }))
}
```

### Subcategory Pages (`app/categories/[categorySlug]/[subcategorySlug]/page.tsx`)
- **Type**: ISR with Static Params
- **Revalidation**: 1 hour
- **Pre-generated**: All subcategories at build time

### Part Detail Pages (`app/parts/[productname]/page.tsx`)
- **Type**: On-Demand ISR
- **Revalidation**: 24 hours
- **Pre-generated**: No (generated on first request)

```typescript
export const revalidate = 86400 // 24 hours
export const dynamicParams = true // Generate on-demand
```

**Why on-demand?**
- 500,000+ part pages
- Pre-generating all would take hours/days
- Most parts are rarely visited
- On-demand generation is more efficient

## SEO Features

### 1. Meta Tags (Server-Side)
- ✅ Title tags
- ✅ Meta descriptions
- ✅ Keywords
- ✅ Canonical URLs
- ✅ Open Graph tags
- ✅ Twitter Cards
- ✅ Robots directives

### 2. Structured Data (JSON-LD)
- ✅ Product schema
- ✅ Breadcrumb schema
- ✅ Organization schema
- ✅ Website schema

### 3. Performance
- ✅ Image optimization (Next.js Image)
- ✅ Font optimization
- ✅ Code splitting
- ✅ Static asset caching

## Verification

### Check SSR is Working

1. **View Page Source** (Right-click → View Page Source):
   ```html
   <title>Part Name - Amatom Parts | ASAP-Amatom.com</title>
   <meta name="description" content="...">
   <link rel="canonical" href="https://asap-amatom.com/parts/...">
   ```

2. **Disable JavaScript**:
   - Open DevTools → Settings → Disable JavaScript
   - Reload page
   - Meta tags should still be visible in source

3. **Check Network Tab**:
   - Initial HTML response should contain all meta tags
   - No client-side JavaScript needed for meta tags

### Check ISR is Working

1. **Build the app**:
   ```bash
   npm run build
   ```

2. **Check build output**:
   ```
   ○ /categories/[categorySlug] (ISR: 1 Hour)
   ○ /categories/[categorySlug]/[subcategorySlug] (ISR: 1 Hour)
   ○ /parts/[productname] (ISR: 24 Hours) (On-Demand)
   ```

3. **Test on-demand generation**:
   - Visit a part page that wasn't pre-generated
   - First request: Generates page (slightly slower)
   - Subsequent requests: Served from cache (instant)

## Best Practices

### ✅ DO

1. **Use Next.js Metadata API for all pages**
   - It's server-side rendered
   - Perfect for SEO
   - Type-safe

2. **Use React Helmet only for client-side updates**
   - When meta tags change based on user interaction
   - For dynamic content that updates after initial render

3. **Set appropriate revalidation times**
   - Homepage: 1 hour (high traffic)
   - Categories: 1 hour (moderate changes)
   - Parts: 24 hours (rarely change)

4. **Pre-generate important pages**
   - Use `generateStaticParams()` for categories/subcategories
   - Improves initial load time

### ❌ DON'T

1. **Don't use React Helmet for static pages**
   - Next.js Metadata API is better
   - React Helmet is client-side only

2. **Don't pre-generate all 500k part pages**
   - Use on-demand ISR instead
   - Pre-generating would take too long

3. **Don't set revalidation too low**
   - Causes unnecessary regeneration
   - Increases server load

## Deployment

### Vercel (Recommended)

Next.js is optimized for Vercel:
- Automatic ISR support
- Edge functions
- Global CDN

```bash
npm run build
npx vercel
```

### Netlify

Requires Next.js plugin:
```bash
npm install @netlify/plugin-nextjs
```

Add to `netlify.toml`:
```toml
[[plugins]]
  package = "@netlify/plugin-nextjs"
```

### Other Platforms

Any Node.js hosting that supports:
- Server-side rendering
- File system access (for ISR cache)
- Environment variables

## Troubleshooting

### Meta tags not in HTML source

**Problem**: Meta tags only appear after JavaScript loads

**Solution**: Ensure you're using `generateMetadata` function, not React Helmet for static pages

### Pages not generating on-demand

**Problem**: 404 errors for part pages

**Solution**: Check `dynamicParams = true` is set in page config

### Build taking too long

**Problem**: Build times out

**Solution**: Reduce `generateStaticParams()` scope, use on-demand ISR for less important pages

## Summary

- ✅ **SSR**: All pages server-rendered by default
- ✅ **SSG**: Important pages pre-generated at build time
- ✅ **ISR**: Pages regenerate in background after cache expires
- ✅ **On-Demand**: 500k+ part pages generated on first request
- ✅ **Metadata API**: Primary method for SEO (server-side)
- ✅ **React Helmet**: Secondary method for client-side updates

This setup provides:
- Perfect SEO (server-rendered meta tags)
- Fast performance (ISR caching)
- Scalability (on-demand generation for 500k+ pages)
- Flexibility (both server and client-side meta tag updates)

