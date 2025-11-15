# Prerender.io Setup Guide

## ✅ Prerender.io Integration - Free SSR Solution

Prerender.io ek free service hai jo dynamic meta tags ko server-side render karti hai.

## 🚀 Features

- ✅ **Free Tier**: 250 pages/month (crawler requests)
- ✅ **Automatic**: Crawlers ko automatically prerendered HTML milta hai
- ✅ **Easy Setup**: Netlify redirects se setup
- ✅ **Dynamic Routes**: `/parts/*` aur `/categories/*` routes ke liye automatically handle karta hai

## 📝 Setup Steps

### 1. Prerender.io Account Banao (Optional - Free tier available)

1. Visit: https://prerender.io
2. Sign up (free tier available)
3. Copy your token (optional - free tier mein token nahi chahiye)

### 2. Environment Variable (Optional)

Agar paid plan use karte hain to token add karein:

**Netlify Dashboard → Site Settings → Environment Variables:**

```
PRERENDER_TOKEN = your_prerender_token
```

### 3. Deploy

```bash
npm run build
netlify deploy --prod
```

## 🔍 How It Works

1. **User visits page** → `/parts/17300-B-0256-28`
2. **Netlify checks User-Agent** → Agar crawler hai (Googlebot, Facebook, etc.)
3. **Redirect to Prerender.io** → Prerender.io ko page URL bhejte hain
4. **Prerender.io renders** → Prerender.io page ko load karke render karta hai
5. **Returns HTML with meta tags** → Fully rendered HTML with dynamic meta tags return hota hai

## 🎯 User-Agents Supported

- Googlebot (Google Search)
- facebookexternalhit (Facebook)
- twitterbot (Twitter)
- linkedinbot (LinkedIn)
- Pinterest
- WhatsApp
- Applebot (Apple)
- TelegramBot
- Aur bhi 20+ crawlers

## ⚠️ Important Notes

### Free Tier Limitations:
- **250 pages/month** - Crawler requests ke liye
- Normal users ko regular SPA dikhega (meta tags client-side)

### For Unlimited:
- Paid plan: $25/month (unlimited pages)

## 🧪 Testing

### Test Prerender.io Directly:

```bash
# Test with User-Agent
curl -A "Googlebot" https://asap-amatom.com/parts/17300-B-0256-28
```

Agar prerendered HTML milta hai to meta tags dikhenge!

### Check Meta Tags:

1. Facebook Debugger: https://developers.facebook.com/tools/debug/
2. Twitter Card Validator: https://cards-dev.twitter.com/validator
3. Google Rich Results Test: https://search.google.com/test/rich-results

In tools mein URL paste karo - prerendered HTML dikhega with meta tags!

## 📊 Alternative Solutions

### Option 1: Prerender.io (Current) ✅
- Free tier available
- Easy setup
- Works with Netlify

### Option 2: React Snap (Already Configured)
- Completely free
- Static pages only (need to list all routes)
- Good for homepage, about, etc.

### Option 3: Netlify Edge Functions
- Free
- More control
- Requires coding

## 🔧 Troubleshooting

### Issue: Meta tags nahi show ho rahe

**Solution:**
1. Check User-Agent - normal browser se test nahi hoga
2. Use Facebook Debugger ya Twitter Card Validator
3. Check Prerender.io dashboard - requests dikhenge

### Issue: Too many requests

**Solution:**
1. Free tier: 250/month limit
2. Upgrade to paid plan for unlimited
3. Ya cache properly setup karo

## ✅ Verification Checklist

✅ Prerender.io redirects configured (`netlify.toml`)
✅ Build successful
✅ Deploy successful
✅ Facebook Debugger mein test karo
✅ Meta tags show ho rahe hain crawler requests mein

## 📝 Current Configuration

```
Parts pages: /parts/* → Prerender.io
Category pages: /categories/* → Prerender.io
Static assets: Direct serve
All other routes: SPA fallback
```

## 🎯 Expected Result

- **Crawlers** (Googlebot, Facebook, etc.) → Prerendered HTML with meta tags ✅
- **Normal users** → Regular SPA (meta tags client-side via React Helmet) ✅

---

**Note**: Prerender.io free tier mein 250 pages/month limit hai. Agar zyada traffic hai to paid plan consider karo ($25/month).

