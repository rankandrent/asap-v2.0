# Netlify SSR Deployment Guide

## ✅ Netlify Edge Function for Dynamic Meta Tags

Netlify Edge Function banai gayi hai jo production mein dynamic meta tags inject karti hai.

## 📁 File Structure

```
netlify/
└── edge-functions/
    └── ssr.ts          # Edge Function for SSR (handles all routes)
```

## 🚀 Deployment Steps

### 1. Environment Variables Setup

Netlify Dashboard mein ye environment variables add karein:

```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

**Steps:**
1. Netlify Dashboard kholo
2. Your site → Site settings → Environment variables
3. Add variables:
   - `VITE_SUPABASE_URL` = Your Supabase project URL
   - `VITE_SUPABASE_ANON_KEY` = Your Supabase anonymous key

### 2. Build & Deploy

```bash
# Build the project
npm run build

# Deploy to Netlify (via Netlify CLI or Git)
netlify deploy --prod
```

Ya phir Git push karne se automatic deploy ho jayega (agar connected hai).

### 3. Verify Edge Function

Deploy ke baad check karein:

1. Netlify Dashboard → Functions
2. `ssr` Edge Function dikhni chahiye
3. Logs check karein agar error ho

## 🔍 Testing

### Local Testing (Optional)

```bash
# Install Netlify CLI if not installed
npm install -g netlify-cli

# Run local dev server with Edge Functions
netlify dev
```

### Production Testing

1. Site ka live URL kholo: `https://asap-amatom.com/parts/17300-B-0256-28`
2. View Source (Ctrl+U / Cmd+Option+U)
3. Check karein:
   - `<title>` → Part-specific title dikhega
   - `<meta name="description">` → Part-specific description dikhega
   - `<link rel="canonical">` → Part-specific URL dikhega
   - `<meta property="og:type">` → "product" dikhega (part pages ke liye)
   - `<script type="application/ld+json">` → Product schema dikhega

## 🛠️ How It Works

1. **Request comes in** → `/parts/17300-B-0256-28`
2. **Edge Function catches it** → `ssr.ts` runs
3. **Fetches part data** → Supabase se actual part data fetch hota hai
4. **Generates SEO tags** → Dynamic meta tags generate hote hain
5. **Injects into HTML** → `index.html` mein meta tags inject hote hain
6. **Returns HTML** → Modified HTML return hota hai with unique meta tags

## ⚠️ Troubleshooting

### Issue: Meta tags nahi show ho rahe

**Solution:**
1. Netlify Dashboard → Functions → Check `ssr` function logs
2. Environment variables check karein:
   - `VITE_SUPABASE_URL` set hai?
   - `VITE_SUPABASE_ANON_KEY` set hai?
3. Edge Function properly deployed hai?
   - `netlify.toml` mein `[[edge_functions]]` configured hai?

### Issue: Edge Function error

**Solution:**
1. Netlify Dashboard → Functions → Logs check karein
2. Error message dekho aur fix karo
3. Common issues:
   - Supabase connection issue → Check environment variables
   - HTML fetch error → Check if `index.html` accessible hai

### Issue: Still showing same meta tags

**Solution:**
1. Browser cache clear karein (Ctrl+Shift+R / Cmd+Shift+R)
2. Hard reload karein
3. Check View Source (not Inspect Element)
4. Netlify Edge Function logs check karein

## 📊 Verification Checklist

✅ Edge Function deployed hai (`netlify/functions/ssr.ts`)
✅ `netlify.toml` configured hai (`[[edge_functions]]`)
✅ Environment variables set hain
✅ Build successful hai
✅ Deploy successful hai
✅ Live site par meta tags dynamic hain (View Source check karo)

## 🎯 Expected Result

Har part page ka unique meta tags hona chahiye:

- **Homepage**: `ASAP-Amatom.com - Official Amatom Parts Catalog`
- **Part Page**: `17300-B-0256-28 - Stndf Hngd Rnd Ff 0256 3/16 X 3/4 | Amatom Parts`
- **Category Page**: `Standoffs - Amatom Parts | ASAP-Amatom.com`
- **Subcategory Page**: `Brass Standoffs - Standoffs | Amatom Parts | ASAP-Amatom.com`

Har page ka:
- Unique `<title>`
- Unique `<meta name="description">`
- Unique `<link rel="canonical">`
- Unique OG tags
- Unique Schema markup

## 📝 Notes

- Edge Functions Deno runtime pe chalte hain
- Fast response time (edge pe run hote hain)
- Automatic scaling
- No server management needed

## 🔗 Resources

- [Netlify Edge Functions Docs](https://docs.netlify.com/edge-functions/overview/)
- [Deno Runtime](https://deno.land/)

