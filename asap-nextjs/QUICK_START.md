# Quick Start Guide - SSR/SSG Implementation

## ✅ What's Implemented

### 1. Server-Side Rendering (SSR)
- ✅ All pages are server-rendered by default
- ✅ Meta tags included in HTML source
- ✅ Perfect for SEO crawlers

### 2. Static Site Generation (SSG) with ISR
- ✅ Homepage: Pre-generated, revalidates every 1 hour
- ✅ Categories: Pre-generated, revalidates every 1 hour
- ✅ Subcategories: Pre-generated, revalidates every 1 hour
- ✅ Parts: Generated on-demand, revalidates every 24 hours

### 3. SEO Implementation
- ✅ Next.js Metadata API (server-side) - Primary method
- ✅ React Helmet Async (client-side) - For dynamic updates
- ✅ Structured data (JSON-LD)
- ✅ Canonical URLs
- ✅ Open Graph tags
- ✅ Twitter Cards

## 🚀 Getting Started

### 1. Install Dependencies

```bash
cd asap-nextjs
npm install
```

### 2. Set Up Environment Variables

Create `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 3. Run Development Server

```bash
npm run dev
```

Visit: `http://localhost:3000`

### 4. Build for Production

```bash
npm run build
npm start
```

## 📋 How It Works

### Server-Side Meta Tags (Next.js Metadata API)

**Example**: `app/parts/[productname]/page.tsx`

```typescript
export async function generateMetadata({ params }): Promise<Metadata> {
  const part = await getPartByProductname(params.productname, 'Amatom')
  
  return {
    title: `${part.productname} - Amatom Parts`,
    description: `Buy ${part.productname}...`,
    canonical: `https://asap-amatom.com/parts/${part.productname}`,
    openGraph: {
      title: '...',
      type: 'product',
    },
  }
}
```

**Result**: Meta tags are in the HTML source (server-rendered)

### Client-Side Meta Tags (React Helmet)

**When to use**: Only for dynamic client-side updates

```typescript
'use client'
import SEO from '@/components/common/SEO'

export default function DynamicPage() {
  return (
    <>
      <SEO
        title="Dynamic Title"
        description="Dynamic description"
        canonical="https://asap-amatom.com/page"
      />
      {/* Page content */}
    </>
  )
}
```

## 🔍 Verification

### Check SSR is Working

1. **View Page Source** (Right-click → View Page Source)
2. Search for `<title>` - should be in HTML
3. Search for `<meta name="description">` - should be in HTML
4. Search for `<link rel="canonical">` - should be in HTML

### Check ISR is Working

1. Build the app: `npm run build`
2. Check build output for:
   - `○ /categories/[categorySlug] (ISR: 1 Hour)`
   - `○ /parts/[productname] (ISR: 24 Hours) (On-Demand)`

## 📚 Documentation

- **Full Guide**: See `SSR_SSG_GUIDE.md`
- **Migration Guide**: See `MIGRATION_GUIDE.md`
- **Status**: See `MIGRATION_STATUS.md`

## 🎯 Key Features

### For SEO
- ✅ Server-rendered meta tags
- ✅ Structured data (JSON-LD)
- ✅ Canonical URLs
- ✅ Open Graph tags
- ✅ Sitemap generation

### For Performance
- ✅ ISR (Incremental Static Regeneration)
- ✅ On-demand page generation
- ✅ Image optimization
- ✅ Code splitting

### For 500k+ Pages
- ✅ On-demand ISR for parts
- ✅ Pre-generated categories/subcategories
- ✅ Efficient caching strategy

## 🚢 Deployment

### Vercel (Recommended)

```bash
npm run build
npx vercel
```

### Netlify

```bash
npm install @netlify/plugin-nextjs
npm run build
```

Add to `netlify.toml`:
```toml
[[plugins]]
  package = "@netlify/plugin-nextjs"
```

## 📝 Notes

- **Next.js Metadata API** is the primary method (server-side)
- **React Helmet** is for client-side dynamic updates only
- All pages are server-rendered by default
- ISR provides the best of both worlds (SSG + SSR)

## ✅ Status

- ✅ SSR implemented
- ✅ SSG with ISR implemented
- ✅ Next.js Metadata API configured
- ✅ React Helmet Async added
- ✅ SEO components created
- ✅ Documentation complete

**Ready for production!** 🎉

