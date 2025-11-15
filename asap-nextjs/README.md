# ASAP-Amatom.com - Next.js 14 (App Router)

> **Official Amatom Parts Catalog** - 500,000+ Aerospace & Industrial Parts

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn
- Supabase account

### Installation

```bash
# 1. Install dependencies
npm install

# 2. Setup environment variables
cp .env.local.example .env.local
# Edit .env.local with your Supabase credentials

# 3. Run development server
npm run dev

# 4. Open http://localhost:3000
```

## 📋 Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm start            # Start production server
npm run lint         # Run ESLint
npm run type-check   # Check TypeScript types
```

## 🏗️ Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Database:** Supabase (PostgreSQL)
- **Data Fetching:** React Query + Server Components
- **Forms:** React Hook Form + Zod
- **Icons:** Lucide React

## 🎯 Key Features

### SEO Optimized for 500,000+ Pages
- ✅ Server-Side Rendering (SSR)
- ✅ Static Site Generation (SSG)
- ✅ Incremental Static Regeneration (ISR)
- ✅ On-Demand ISR for 500k+ parts
- ✅ Automatic Sitemap Generation
- ✅ Robots.txt
- ✅ Open Graph & Twitter Cards
- ✅ JSON-LD Structured Data

### Performance
- ✅ Image Optimization (Next/Image)
- ✅ Font Optimization (Next/Font)
- ✅ Automatic Code Splitting
- ✅ React Query Caching
- ✅ Server Component Caching

### Developer Experience
- ✅ TypeScript
- ✅ ESLint
- ✅ Tailwind CSS
- ✅ File-based Routing
- ✅ Hot Module Replacement

## 📁 Project Structure

```
asap-nextjs/
├── src/
│   ├── app/                    # App Router (pages & layouts)
│   ├── components/             # React components
│   ├── lib/                    # Utilities & queries
│   ├── types/                  # TypeScript types
│   └── middleware.ts           # Next.js middleware
├── public/                     # Static assets
├── next.config.ts              # Next.js config
├── tailwind.config.ts          # Tailwind config
└── package.json
```

## 🔧 Configuration

### Environment Variables

Create `.env.local`:

```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_SITE_URL=https://asap-amatom.com
```

### Deployment

#### Vercel (Recommended)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

#### Build Locally
```bash
npm run build
npm start
```

## 📖 Documentation

- [Migration Guide](./MIGRATION_GUIDE.md) - Complete migration documentation
- [Next.js Docs](https://nextjs.org/docs)
- [Supabase Docs](https://supabase.io/docs)

## 🎨 Pages

| Route | Type | Revalidate | Description |
|-------|------|------------|-------------|
| `/` | ISR | 1 hour | Homepage with categories |
| `/categories/[slug]` | ISR | 1 hour | Category page with subcategories |
| `/categories/[slug]/[sub]` | ISR | 1 hour | Subcategory with parts list |
| `/parts/[name]` | ISR | 1 day | Individual part detail (500k+ pages) |
| `/search` | Client | - | Search parts dynamically |

## 🔍 SEO Strategy

### Homepage & Categories
- Pre-generated at build time
- ISR with 1-hour revalidation
- Full metadata + structured data

### Parts (500,000+ pages)
- **On-Demand ISR** - Generated on first visit
- Cached for 24 hours
- Stale-While-Revalidate pattern
- Full SEO metadata per part

### Sitemap
- Dynamically generated
- Includes categories & subcategories
- Parts added via ISR

## 🚀 Performance Targets

- **Lighthouse Score:** 95+
- **First Contentful Paint:** < 1.5s
- **Time to Interactive:** < 3s
- **Core Web Vitals:** All green

## 📝 Notes

### Why On-Demand ISR?
- Can't pre-generate 500k pages at build time (would take hours/days)
- Pages are generated when users visit them
- Once generated, cached for 24 hours
- Perfect for large-scale catalogs

### Server vs Client Components
- **Server:** Default, better performance, direct database access
- **Client:** Use for interactivity (forms, search, state)

### Supabase Integration
- Server Components: Use `@/lib/supabase/server`
- Client Components: Use `@/lib/supabase/client`
- Middleware: Use `@/lib/supabase/middleware`

## 🐛 Troubleshooting

### Build Errors
```bash
# Clear Next.js cache
rm -rf .next

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

### Type Errors
```bash
npm run type-check
```

### Supabase Connection
- Verify `.env.local` has correct credentials
- Check Supabase project status
- Verify RLS policies allow anonymous access

## 📄 License

Proprietary - ASAP-Amatom.com

## 🤝 Support

For support or questions:
- Email: dev@asap-amatom.com
- Documentation: See [MIGRATION_GUIDE.md](./MIGRATION_GUIDE.md)

---

**Built with ❤️ using Next.js 14**
