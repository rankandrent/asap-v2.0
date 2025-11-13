# Debug Categories Not Loading

## 🔍 Debugging Steps

### 1. Check Browser Console
Open browser console and look for:
- `🔄 getCategories: Starting for manufacturer: ...`
- `✅ getCategories: Completed in Xms, returning X categories`
- `🔄 getSubcategories: Starting for category: ..., manufacturer: ...`
- `✅ getSubcategories: Loaded X subcategories`

### 2. Check Manufacturer Context
- Open React DevTools
- Check `ManufacturerContext` provider
- Verify `selectedManufacturer` is set to "Amatom" (or correct manufacturer)
- Check if `manufacturers` array has data

### 3. Check Network Tab
- Open Network tab in browser
- Look for Supabase API calls
- Check if queries are being made
- Check response status codes
- Check response data

### 4. Common Issues

#### Issue 1: Manufacturer Not Set
**Symptom:** Categories return empty array
**Fix:** Check if `selectedManufacturer` is set in context

#### Issue 2: RPC Function Doesn't Exist
**Symptom:** Console shows "RPC function does not exist"
**Fix:** Run database migration in Supabase SQL Editor:
```sql
-- File: supabase/migrations/004_create_categories_view.sql
```

#### Issue 3: Database Connection Issue
**Symptom:** Queries fail with network errors
**Fix:** Check Supabase credentials in `.env` file:
```
VITE_SUPABASE_URL=your-url
VITE_SUPABASE_ANON_KEY=your-key
```

#### Issue 4: No Data in Database
**Symptom:** Queries succeed but return empty arrays
**Fix:** Verify data exists in `products_data` table for manufacturer "Amatom"

### 5. Quick Test

Run this in browser console:
```javascript
// Check manufacturer context
console.log('Manufacturer:', window.__REACT_DEVTOOLS_GLOBAL_HOOK__)

// Check Supabase connection
import { supabase } from './lib/supabase'
const { data, error } = await supabase
  .from('products_data')
  .select('manufacturer, category')
  .eq('manufacturer', 'Amatom')
  .limit(10)
console.log('Test query:', { data, error })
```

## 🔧 Solutions

### Solution 1: Run Database Migration
If RPC functions don't exist, run the migration:
```sql
-- Supabase SQL Editor
-- Copy and paste contents of: supabase/migrations/004_create_categories_view.sql
```

### Solution 2: Check Environment Variables
Verify `.env` file has correct Supabase credentials:
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

### Solution 3: Verify Database Data
Check if data exists:
```sql
SELECT COUNT(*) FROM products_data WHERE manufacturer = 'Amatom';
SELECT DISTINCT category FROM products_data WHERE manufacturer = 'Amatom' LIMIT 10;
```

### Solution 4: Check Browser Console
Look for error messages in console and fix them.

## 📝 Current Implementation

### Manufacturer Context
- Initializes with "Amatom" immediately
- Loads from localStorage if available
- Updates when manufacturers list loads

### Categories Query
- Tries RPC function first (fastest)
- Falls back to sampling 2000 parts
- Filters by manufacturer

### Subcategories Query
- Tries RPC function first (fastest)
- Falls back to sampling 10000 parts
- Filters by manufacturer and category

## ✅ Expected Behavior

1. **Homepage**: Shows manufacturer selector (if multiple manufacturers)
2. **Categories**: Shows all categories for selected manufacturer
3. **Category Page**: Shows all subcategories for selected category
4. **Subcategory Page**: Shows all parts for selected subcategory

## 🚨 If Still Not Working

1. Check browser console for errors
2. Check Network tab for failed requests
3. Verify Supabase credentials
4. Run database migration
5. Check if data exists in database

