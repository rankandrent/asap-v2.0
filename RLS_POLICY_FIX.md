# RLS Policy Fix - RFQ Table

## Problem
Error: `new row violates row-level security policy for table "rfqs"`

## Solution Applied ✅

RLS policies update kar di hain. Ab **public** aur **anon** dono roles se insert allowed hai.

### Policies Created:
1. ✅ **"Allow public to insert RFQs"** - Public role ke liye
2. ✅ **"Allow anon to insert RFQs"** - Anonymous users ke liye  
3. ✅ **"Allow authenticated to insert RFQs"** - Logged in users ke liye

---

## Verification

Policies ab active hain. Test karein:

1. **Form fill karein** - RFQ submit karein
2. **Error check karein** - Ab error nahi aana chahiye
3. **Database check karein** - RFQ save hona chahiye

---

## If Still Getting Error

### Check 1: Supabase Client Configuration
Ensure you're using the **anon key** (not service role key):

```typescript
// ✅ Correct - Using anon key
const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY  // Anon key, not service role
)
```

### Check 2: Environment Variables
Verify `.env` file has correct keys:
```bash
VITE_SUPABASE_URL=https://ncsxlqpwiaixnsvjtlgc.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Check 3: Supabase Dashboard
1. Go to Supabase Dashboard → Authentication → Policies
2. Check `rfqs` table policies
3. Ensure "Allow public to insert RFQs" is enabled

---

## Migration Applied

Migration file created: `supabase/migrations/005_fix_rfqs_rls_policy.sql`

This ensures the fix is permanent and will be applied to all environments.

---

## Test Now

1. **Refresh page** (Ctrl+R / Cmd+R)
2. **Form fill karein** - RFQ submit karein
3. **Check** - Ab error nahi aana chahiye! ✅

---

**Fix Applied!** Ab form submit karke test karein. 🎉

