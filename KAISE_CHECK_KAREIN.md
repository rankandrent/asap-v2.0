# 🔍 Canonical Tag Kaise Check Karein - Aasan Tareeqa

## ⚠️ Pehle Ye Samjhein

**React apps mein canonical tag "View Page Source" mein NAHI dikhta!**

Ye **NORMAL** hai! ❌ Yahan mat dekhein!

Canonical tag sirf **Browser DevTools** mein dikhta hai! ✅ Yahan dekhein!

---

## 🎯 3 Simple Steps

### Step 1: Dev Server Start Karein

Terminal mein:
```bash
cd /Users/muhammadumar/Documents/GitHub/asap-v2.0
npm run dev
```

Wait karein jab tak ye na dikhe:
```
Local:   http://localhost:5173/
```

---

### Step 2: Browser Mein Page Open Karein

Example:
```
http://localhost:5173/parts/11569-A-0632-10
```

---

### Step 3: Console Mein Check Karein

1. **F12 key** press karein
2. **Console** tab par click karein
3. Ye command type karein:

```javascript
document.querySelector('link[rel="canonical"]')?.href
```

4. **Enter** press karein

**Expected Output:**
```
"https://asap-amatom.com/parts/11569-A-0632-10"
```

---

## ✅ Agar Ye Dikha = WORKING!

Console mein ye output aya:
```
"https://asap-amatom.com/parts/11569-A-0632-10"
```

**Matlab:**
- ✅ Canonical tag sahi se kaam kar raha hai
- ✅ Har page apna khud ka canonical dikha raha hai
- ✅ SEO perfect hai!

---

## ❌ Agar "null" Ya "undefined" Dikha

Console mein output:
```
null
```
Ya
```
undefined
```

**Matlab:** Canonical tag nahi hai (problem!)

### Solutions:

#### 1. 3 Seconds Wait Karein
React load hone mein time lagta hai. 3 seconds wait karke dobara check karein.

#### 2. Hard Refresh Karein
```
Ctrl + Shift + R
```

#### 3. Cache Clear Karein
```
Ctrl + Shift + Delete
→ "Cached images and files" select karein
→ Clear data
```

#### 4. Console Mein Error Check Karein
Console tab mein koi **red text** (error) to nahi?

---

## 🔍 Visual Method (Aur Bhi Aasan)

### Method 1: Inspect Element

1. Page par **right-click** karein
2. **"Inspect"** select karein
3. **Elements** tab open hoga
4. `<head>` section expand karein
5. Search karein: **Ctrl+F** → type "canonical"
6. Ye dikhna chahiye:
```html
<link rel="canonical" href="https://asap-amatom.com/parts/11569-A-0632-10">
```

### Method 2: Debug Console Message

Console tab mein ye message dikhna chahiye:
```
🔍 SEO Component: {
  pathname: "/parts/11569-A-0632-10",
  canonicalUrl: "https://asap-amatom.com/parts/11569-A-0632-10"
}
```

Agar ye message nahi dikha = SEO component load nahi hua

---

## 📋 Multiple Pages Test Karein

### Test 1: Homepage
```
URL: http://localhost:5173/
Command: document.querySelector('link[rel="canonical"]')?.href
Expected: "https://asap-amatom.com/"
```

### Test 2: Part Page
```
URL: http://localhost:5173/parts/11569-A-0632-10
Command: document.querySelector('link[rel="canonical"]')?.href
Expected: "https://asap-amatom.com/parts/11569-A-0632-10"
```

### Test 3: Category Page
```
URL: http://localhost:5173/categories/standoffs
Command: document.querySelector('link[rel="canonical"]')?.href
Expected: "https://asap-amatom.com/categories/standoffs"
```

**Har page ka canonical DIFFERENT hona chahiye!** ✅

---

## 🎬 Video-Style Instructions

```
┌─────────────────────────────┐
│ 1. npm run dev              │
│    (Terminal mein)          │
└─────────────────────────────┘
            ↓
┌─────────────────────────────┐
│ 2. Open browser             │
│    localhost:5173/parts/... │
└─────────────────────────────┘
            ↓
┌─────────────────────────────┐
│ 3. Press F12                │
│    (Console open hoga)      │
└─────────────────────────────┘
            ↓
┌─────────────────────────────┐
│ 4. Type command:            │
│    document.querySelector(  │
│    'link[rel="canonical"]') │
│    ?.href                   │
└─────────────────────────────┘
            ↓
┌─────────────────────────────┐
│ 5. Press Enter              │
│    (Output dekho)           │
└─────────────────────────────┘
            ↓
┌─────────────────────────────┐
│ ✅ URL dikha? = WORKING!    │
│ ❌ null dikha? = NOT WORKING│
└─────────────────────────────┘
```

---

## 💡 Quick Command (Copy-Paste Karein)

Ye command console mein paste karein - complete check karega:

```javascript
const c = document.querySelector('link[rel="canonical"]');
console.log('━━━━━━━━━━━━━━━━━━━━━━━');
console.log('🔍 CANONICAL CHECK');
console.log('━━━━━━━━━━━━━━━━━━━━━━━');
console.log('Page:', window.location.href);
console.log('Canonical:', c ? c.href : '❌ NOT FOUND');
console.log('Status:', c ? '✅ FOUND' : '❌ MISSING');
console.log('━━━━━━━━━━━━━━━━━━━━━━━');
```

---

## 🆘 Abhi Bhi Nahi Dikha?

Agar upar ke saare steps try kar liye aur phir bhi canonical nahi dikha:

**Share karein:**
1. Screenshot of Console tab (F12)
2. Is command ka output:
   ```javascript
   document.querySelector('link[rel="canonical"]')
   ```
3. Konsa page test kar rahe ho (URL)
4. Console mein koi error (red text) hai?

---

## ✅ Summary

### Sahi Tareeqa:
1. ✅ `npm run dev` run karein
2. ✅ Browser mein page open karein
3. ✅ **F12** press karein (Console)
4. ✅ Command run karein: `document.querySelector('link[rel="canonical"]')?.href`
5. ✅ Output check karein

### Galat Tareeqa:
1. ❌ "View Page Source" (Ctrl+U) - YAHAN MAT DEKHO!
2. ❌ Static HTML file dekhna - GALAT HAI!

---

## 🎯 Important Points

1. **React apps** mein canonical JavaScript se add hota hai
2. **"View Source"** mein nahi dikhega (normal hai!)
3. **Console/DevTools** mein dikhega (correct place!)
4. Har page ka **different canonical** hoga
5. **Wait 2-3 seconds** page load ke baad

---

**Ab test karein aur batayein kya dikha!** 🚀

**Simple command:**
```javascript
document.querySelector('link[rel="canonical"]')?.href
```

**Ye command F12 → Console mein run karein!**

