# ASAPAmatom.com - Parts Catalog Website

A complete e-commerce/database website for **ASAPAmatom.com** - a specialized parts catalog website for **Amatom** manufacturer products. The site displays **500,000+ parts** organized in a hierarchical structure: Categories → Subcategories → Parts List → Individual Part Pages.

## 🚀 Tech Stack

- **Frontend Framework:** React 18+ with TypeScript
- **Build Tool:** Vite
- **Routing:** React Router v6
- **Styling:** Tailwind CSS
- **UI Components:** shadcn/ui component library
- **Database:** Supabase (PostgreSQL)
- **Data Fetching:** TanStack Query (React Query)
- **SEO:** React Helmet Async
- **Forms:** React Hook Form with Zod validation

## 📋 Prerequisites

- Node.js 18+ and npm
- Supabase account and project

## 🛠️ Setup Instructions

### 1. Clone and Install

```bash
npm install
```

### 2. Configure Environment Variables

Create a `.env` file in the root directory:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_SITE_URL=https://www.asapamatom.com
```

### 3. Set Up Supabase Database

Run the following SQL in your Supabase SQL Editor:

```sql
CREATE TABLE parts (
  id BIGSERIAL PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  manufacturer TEXT NOT NULL DEFAULT 'Amatom',
  productname TEXT UNIQUE NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL,
  sub_category TEXT NOT NULL,
  specifications JSONB,
  images TEXT[],
  price DECIMAL,
  availability_status TEXT,
  quantity INTEGER,
  lead_time TEXT,
  certifications TEXT[],
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_parts_category ON parts(category);
CREATE INDEX idx_parts_sub_category ON parts(sub_category);
CREATE INDEX idx_parts_productname ON parts(productname);
CREATE INDEX idx_parts_manufacturer ON parts(manufacturer);
CREATE INDEX idx_parts_search ON parts USING gin(to_tsvector('english', productname || ' ' || description));

-- Enable Row Level Security
ALTER TABLE parts ENABLE ROW LEVEL SECURITY;

-- Policy: Allow public read access
CREATE POLICY "Public read access" ON parts
  FOR SELECT USING (true);
```

### 4. Run Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## 📁 Project Structure

```
src/
├── components/
│   ├── ui/                 # shadcn/ui components
│   ├── layout/             # Header, Footer, Breadcrumb
│   ├── parts/              # Part-related components
│   ├── categories/         # Category-related components
│   └── common/             # Shared components
├── pages/                  # Page components
├── hooks/                  # Custom React hooks
├── lib/                    # Utilities and configurations
├── types/                  # TypeScript type definitions
└── App.tsx                 # Main app with routing
```

## 🎯 Features

### Phase 1 (Implemented)
- ✅ Homepage with category grid
- ✅ Category page with subcategories
- ✅ Subcategory page with parts list and pagination
- ✅ Part detail page with all components
- ✅ Basic search functionality
- ✅ Responsive design
- ✅ SEO optimization

### Phase 2 (Future Enhancements)
- Advanced search with filters
- Part comparison tool
- Download datasheets
- RFQ (Request for Quote) functionality
- Related parts suggestions
- Recently viewed parts

## 🔗 URL Structure

- Homepage: `/`
- Category: `/categories/{category-slug}`
- Subcategory: `/categories/{category-slug}/{subcategory-slug}`
- Part: `/parts/{productname}`
- Search: `/search?q={query}`

## 🏗️ Build for Production

```bash
npm run build
```

The build output will be in the `dist` directory.

## 📦 Deployment

### Recommended Platforms

- **Vercel:** Connect your GitHub repo and deploy
- **Netlify:** Drag and drop the `dist` folder or connect via Git

### Environment Variables

Make sure to set the environment variables in your deployment platform:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`
- `VITE_SITE_URL`

## 🧪 Testing Checklist

- [ ] Homepage loads and displays categories
- [ ] Category page shows subcategories
- [ ] Subcategory page shows parts with pagination
- [ ] Part detail page displays all information
- [ ] Search functionality works
- [ ] All links and navigation work
- [ ] Mobile responsive design
- [ ] SEO meta tags are correct
- [ ] Images load properly
- [ ] Error handling works
- [ ] Loading states display
- [ ] Pagination works correctly

## 📝 Notes

- **Manufacturer is fixed:** Always "Amatom" - no need for manufacturer selection
- **URL slugs:** Category/subcategory names are converted to URL-friendly slugs
- **Product names:** Used as-is in URLs (may contain special characters)
- **Error handling:** Graceful error messages, 404 pages
- **Loading states:** Skeleton loaders, spinners
- **Accessibility:** ARIA labels, keyboard navigation

## 📄 License

This project is proprietary and confidential.

## 👥 Support

For issues or questions, please contact the development team.
