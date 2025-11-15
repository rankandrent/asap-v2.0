# Next.js 14 Migration Guide - ASAP-Amatom.com

## Overview

This guide documents the migration from **Vite + React Router** to **Next.js 14 App Router** for the ASAP-Amatom.com project, optimized for **500,000+ dynamic pages** with advanced SEO.

---

## Why Next.js 14?

### Key Benefits:
1. **Server-Side Rendering (SSR)** - Better SEO and faster initial page loads
2. **Static Site Generation (SSG)** - Pre-render pages at build time
3. **Incremental Static Regeneration (ISR)** - Update static content without rebuilding
4. **Automatic Code Splitting** - Better performance
5. **Built-in SEO** - Metadata API, sitemap, robots.txt
6. **Image Optimization** - Next.js Image component
7. **On-Demand ISR** - Generate 500k+ pages as they're requested

---

## Tech Stack Comparison

| Feature | Old (Vite) | New (Next.js 14) |
|---------|------------|------------------|
| Framework | React 18 + Vite | Next.js 14 (App Router) |
| Routing | React Router DOM | Next.js App Router |
| SEO | React Helmet | Next.js Metadata API |
| SSR | Manual (Netlify Functions) | Built-in |
| ISR | Not available | Built-in |
| Image Optimization | Manual | `next/image` |
| API Routes | Netlify Functions | Next.js API Routes |

---

## Folder Structure

```
asap-nextjs/
├── src/
│   ├── app/                        # App Router (routes)
│   │   ├── layout.tsx              # Root layout (Header + Footer)
│   │   ├── page.tsx                # Homepage (ISR: 1 hour)
│   │   ├── providers.tsx           # React Query provider
│   │   ├── globals.css             # Global styles
│   │   ├── sitemap.ts              # Dynamic sitemap generation
│   │   ├── robots.ts               # Robots.txt generation
│   │   ├── categories/
│   │   │   └── [categorySlug]/
│   │   │       ├── page.tsx        # Category page (ISR: 1 hour)
│   │   │       └── [subcategorySlug]/
│   │   │           └── page.tsx    # Subcategory page with pagination (ISR: 1 hour)
│   │   ├── parts/
│   │   │   └── [productname]/
│   │   │       └── page.tsx        # Part detail page (ISR: 1 day, on-demand)
│   │   └── search/
│   │       └── page.tsx            # Search page (client-side)
│   │
│   ├── components/                 # React components
│   │   ├── layout/                 # Header, Footer
│   │   └── common/                 # SearchBar, etc.
│   │
│   ├── lib/                        # Utility functions
│   │   ├── supabase/               # Supabase clients
│   │   │   ├── client.ts           # Browser client
│   │   │   ├── server.ts           # Server client
│   │   │   └── middleware.ts       # Middleware client
│   │   ├── queries-server.ts       # Server-side queries (SSR/SSG/ISR)
│   │   ├── queries-client.ts       # Client-side queries (React Query)
│   │   └── utils.ts                # Helper functions
│   │
│   ├── types/                      # TypeScript types
│   │   ├── part.ts
│   │   ├── order.ts
│   │   ├── rfq.ts
│   │   └── manufacturer.ts
│   │
│   └── middleware.ts               # Next.js middleware (auth, etc.)
│
├── public/                         # Static assets
│   ├── logo.png
│   ├── image/
│   └── ...
│
├── next.config.ts                  # Next.js configuration
├── tailwind.config.ts              # Tailwind CSS config
├── tsconfig.json                   # TypeScript config
└── package.json                    # Dependencies
```

---

## Key Changes

### 1. Routing Migration

| Old (React Router) | New (Next.js App Router) |
|--------------------|--------------------------|
| `<Route path="/" element={<HomePage />} />` | `app/page.tsx` |
| `<Route path="/categories/:slug" />` | `app/categories/[slug]/page.tsx` |
| `<Route path="/parts/:id" />` | `app/parts/[id]/page.tsx` |
| `<Link to="/about">` | `<Link href="/about">` |
| `useNavigate()` | `useRouter()` from `next/navigation` |
| `useParams()` | `params` prop in page component |
| `useSearchParams()` | `searchParams` prop in page component |

### 2. SEO Migration

**Old (React Helmet):**
```tsx
<Helmet>
  <title>My Title</title>
  <meta name="description" content="..." />
</Helmet>
```

**New (Next.js Metadata API):**
```tsx
export const metadata: Metadata = {
  title: 'My Title',
  description: '...',
  openGraph: { ... },
}
```

### 3. Data Fetching Migration

**Old (React Query with useQuery):**
```tsx
const { data } = useQuery(['parts'], fetchParts)
```

**New (Server Components + React Query):**
```tsx
// Server Component (SSR/SSG/ISR)
const parts = await getParts() // Direct database call

// Client Component (dynamic data)
'use client'
const { data } = useQuery(['parts'], fetchParts)
```

### 4. Supabase Integration

**Old:**
```tsx
import { supabase } from '@/lib/supabase'
```

**New:**
```tsx
// Server Components
import { createClient } from '@/lib/supabase/server'
const supabase = await createClient()

// Client Components
import { createClient } from '@/lib/supabase/client'
const supabase = createClient()
```

---

## SSR/SSG/ISR Strategy for 500,000+ Pages

### Homepage
- **Strategy:** ISR (Incremental Static Regeneration)
- **Revalidate:** 1 hour (3600 seconds)
- **Why:** High traffic, changes infrequently

```tsx
export const revalidate = 3600 // ISR: revalidate every hour
```

### Category Pages (~6 pages)
- **Strategy:** SSG at build time + ISR
- **Revalidate:** 1 hour
- **Implementation:** `generateStaticParams()` pre-generates all 6 categories

```tsx
export async function generateStaticParams() {
  const categories = await getCategories()
  return categories.map((c) => ({ categorySlug: c.slug }))
}
```

### Subcategory Pages (~20 pages)
- **Strategy:** SSG at build time + ISR
- **Revalidate:** 1 hour
- **Implementation:** `generateStaticParams()` pre-generates all subcategories

### Part Detail Pages (500,000+ pages)
- **Strategy:** **On-Demand ISR**
- **Revalidate:** 1 day (86400 seconds)
- **Why:** Can't pre-generate 500k pages at build time
- **How it works:**
  1. First user visits `/parts/ABC123` → Next.js generates the page
  2. Page is cached for 24 hours
  3. After 24 hours, next request regenerates the page
  4. Stale page is served while regenerating (Stale-While-Revalidate)

```tsx
export const revalidate = 86400 // 1 day
export const dynamicParams = true // Enable on-demand ISR
```

---

## Environment Variables

Create `.env.local`:

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# Site URL
NEXT_PUBLIC_SITE_URL=https://asap-amatom.com
```

---

## Installation & Development

### 1. Install Dependencies
```bash
cd asap-nextjs
npm install
```

### 2. Setup Environment Variables
```bash
cp .env.local.example .env.local
# Edit .env.local with your Supabase credentials
```

### 3. Run Development Server
```bash
npm run dev
```
Visit: `http://localhost:3000`

### 4. Build for Production
```bash
npm run build
```

### 5. Start Production Server
```bash
npm start
```

---

## Deployment

### Vercel (Recommended)
1. Push code to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy!

**Vercel automatically:**
- Handles ISR and on-demand generation
- Optimizes images
- Provides CDN
- Supports 500k+ pages

### Netlify
1. Update `netlify.toml`:
```toml
[build]
  command = "npm run build"
  publish = ".next"

[[plugins]]
  package = "@netlify/plugin-nextjs"
```

2. Deploy to Netlify

---

## Performance Optimizations

### 1. Image Optimization
```tsx
import Image from 'next/image'

<Image
  src="/hero.jpg"
  alt="Hero"
  width={1200}
  height={600}
  priority // For above-the-fold images
/>
```

### 2. Font Optimization
```tsx
import { Inter } from 'next/font/google'
const inter = Inter({ subsets: ['latin'] })
```

### 3. React `cache()` for Deduplication
```tsx
import { cache } from 'react'

export const getCategories = cache(async () => {
  // This deduplicates requests during rendering
  return await supabase.from('categories').select()
})
```

### 4. Streaming with Suspense
```tsx
import { Suspense } from 'react'

<Suspense fallback={<Loading />}>
  <SlowComponent />
</Suspense>
```

---

## SEO Features

### 1. Dynamic Sitemap
- Auto-generated at `/sitemap.xml`
- Includes all categories, subcategories
- For 500k parts, use sitemap index

### 2. Robots.txt
- Auto-generated at `/robots.txt`
- Blocks AI crawlers (GPTBot, ChatGPT-User)

### 3. Metadata API
- Per-page SEO with `generateMetadata()`
- OpenGraph, Twitter Cards
- Canonical URLs

### 4. JSON-LD Structured Data
```tsx
<script type="application/ld+json">
  {JSON.stringify(schema)}
</script>
```

---

## What's Different

### Components
- All components work the same
- Use `'use client'` for client-side interactivity
- Server components by default (better performance)

### Styling
- Tailwind CSS works the same
- All CSS is preserved

### Forms
- React Hook Form + Zod work the same
- No changes needed

### React Query
- Works in client components only
- Use `'use client'` directive

---

## Testing Checklist

- [ ] Homepage loads and displays categories
- [ ] Category pages show subcategories
- [ ] Subcategory pages show parts with pagination
- [ ] Part detail pages display all information
- [ ] Search functionality works
- [ ] SEO metadata is correct (view source)
- [ ] Sitemap.xml is generated
- [ ] Robots.txt is correct
- [ ] Images load and are optimized
- [ ] Mobile responsive design
- [ ] Performance (Lighthouse score)

---

## Common Issues

### 1. "use client" Required
If you get errors about hooks or state:
```tsx
'use client' // Add this at the top
```

### 2. Supabase Client Issues
Use correct client for context:
- Server Components: `@/lib/supabase/server`
- Client Components: `@/lib/supabase/client`
- Middleware: `@/lib/supabase/middleware`

### 3. Dynamic Routes
Make sure folder names match:
- `[slug]` for single parameter
- `[...slug]` for catch-all routes

---

## Future Enhancements

1. **Authentication:** Add auth pages with Next.js middleware
2. **Dashboard:** User and admin dashboards with SSR
3. **API Routes:** Create API endpoints in `app/api/`
4. **Advanced Caching:** Redis for faster lookups
5. **Analytics:** Vercel Analytics or Google Analytics 4

---

## Support

For issues or questions:
- Email: dev@asap-amatom.com
- Docs: https://nextjs.org/docs

---

**Migration Completed:** ✅
**Pages Migrated:** Homepage, Category, Subcategory, Part Detail, Search
**SEO Optimized:** ✅ Metadata API, Sitemap, Robots.txt, Structured Data
**Performance:** ✅ ISR, On-Demand Generation, Image Optimization
**Scalability:** ✅ 500,000+ pages supported

