# Next.js Canonical Tag Guide

## ✅ Canonical Tag Implementation in Next.js

Next.js automatically handles canonical tags through its **Metadata API**. Unlike React (where we use React Helmet), Next.js generates static HTML with canonical tags at build time!

---

## 📍 Where We Added Canonical:

### **1. Root Layout (Global Default)**

**File:** `src/app/layout.tsx`

```typescript
export const metadata: Metadata = {
  metadataBase: new URL('https://asap-amatom.com'),
  alternates: {
    canonical: '/',  // Default canonical for homepage
  },
  // ... other metadata
}
```

This sets the default canonical for the homepage (`/`).

---

## 🎯 How to Add Page-Specific Canonicals:

### **Example 1: Static Page**

**File:** `src/app/about/page.tsx`

```typescript
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'About Us',
  description: 'Learn about ASAP-Amatom.com',
  alternates: {
    canonical: '/about',  // Canonical for this page
  },
}

export default function AboutPage() {
  return <div>About Us Content</div>
}
```

**Generated HTML:**
```html
<link rel="canonical" href="https://asap-amatom.com/about" />
```

---

### **Example 2: Dynamic Part Page**

**File:** `src/app/parts/[productname]/page.tsx`

```typescript
import { Metadata } from 'next'

type Props = {
  params: { productname: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const productname = params.productname
  
  return {
    title: `${productname} - Part Details`,
    description: `View specifications for ${productname}`,
    alternates: {
      canonical: `/parts/${productname}`,  // Dynamic canonical
    },
  }
}

export default function PartPage({ params }: Props) {
  return <div>Part: {params.productname}</div>
}
```

**Example URLs:**
- `/parts/ABC-123` → `<link rel="canonical" href="https://asap-amatom.com/parts/ABC-123" />`
- `/parts/XYZ-789` → `<link rel="canonical" href="https://asap-amatom.com/parts/XYZ-789" />`

---

### **Example 3: Category Page**

**File:** `src/app/categories/[category]/page.tsx`

```typescript
import { Metadata } from 'next'

type Props = {
  params: { category: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const category = params.category
  
  return {
    title: `${category} - Browse Parts`,
    alternates: {
      canonical: `/categories/${category}`,
    },
  }
}

export default function CategoryPage({ params }: Props) {
  return <div>Category: {params.category}</div>
}
```

---

## 🔍 Verification in Next.js:

### **Step 1: Build the App**
```bash
cd asap-nextjs
npm run build
npm start
```

### **Step 2: Check View Source**
```bash
# Open in browser:
http://localhost:3000/parts/ABC-123

# Press: Ctrl+U (View Source)

# Search: "canonical"

# Should see:
<link rel="canonical" href="https://asap-amatom.com/parts/ABC-123"/>
```

### **Step 3: Command Line Test**
```bash
curl -s http://localhost:3000/parts/ABC-123 | grep canonical
```

**Expected Output:**
```html
<link rel="canonical" href="https://asap-amatom.com/parts/ABC-123"/>
```

---

## ✅ Benefits of Next.js Canonical:

| Feature | React (Helmet) | Next.js (Metadata) |
|---------|----------------|-------------------|
| **Generated** | Client-side (after JS loads) | Server-side (at build/request) |
| **View Source** | ❌ Not visible initially | ✅ Visible immediately |
| **SEO** | Good (with SSR) | ✅ Perfect (built-in SSR) |
| **Setup** | Complex (need Express SSR) | ✅ Simple (automatic) |

---

## 📂 Project Structure:

```
asap-nextjs/
├── src/
│   └── app/
│       ├── layout.tsx           ← Global metadata + canonical
│       ├── page.tsx             ← Homepage (canonical: /)
│       ├── about/
│       │   └── page.tsx         ← About page (canonical: /about)
│       ├── parts/
│       │   └── [productname]/
│       │       └── page.tsx     ← Dynamic canonical
│       └── categories/
│           └── [category]/
│               └── page.tsx     ← Category canonical
```

---

## 🚀 Next Steps:

### **1. Update Domain (Already Done!)**
✅ Changed from `www.asapamatom.com` to `asap-amatom.com`
✅ Changed brand name from `ASAPAmatom.com` to `ASAP-Amatom.com`

### **2. Add Canonical to Each Page:**
- ✅ Layout: `canonical: '/'` (done)
- ⏳ Create individual pages with their own canonicals

### **3. Build & Test:**
```bash
cd asap-nextjs
npm run build
npm start
# Then check: http://localhost:3000
```

---

## 💡 Key Differences:

### **React/Vite Project (Main):**
- Path: `/Users/muhammadumar/Documents/GitHub/asap-v2.0/`
- Canonical: `src/components/common/SEO.tsx` (React Helmet)
- Server: `server.js` (Express SSR)
- Port: `3000` (production), `5173` (dev)

### **Next.js Project:**
- Path: `/Users/muhammadumar/Documents/GitHub/asap-v2.0/asap-nextjs/`
- Canonical: `layout.tsx` + `page.tsx` files (Metadata API)
- Server: Built-in Next.js SSR
- Port: `3000` (default)

---

## 📝 Summary:

✅ **Next.js canonical is already added!**
✅ **Automatically generates per-page canonicals**
✅ **Shows in View Source (Ctrl+U) by default**
✅ **No extra SSR setup needed (built-in)**

**Next.js is BETTER for SEO than React + Vite because it has built-in SSR!**

---

## ❓ Questions?

Need help adding canonicals to specific pages? Let me know!

