# Email Notification Setup Guide

## Problem
Form fill karne par email `creative.om3r@gmail.com` par receive nahi ho rahi.

## Solution
Email notification system setup kiya gaya hai. Ab aapko email service configure karni hogi.

---

## Option 1: Resend (Recommended - FREE)

### Step 1: Resend Account Banayein
1. Visit: https://resend.com
2. Sign up (FREE tier available - 3,000 emails/month)
3. Verify your email

### Step 2: API Key Generate Karein
1. Dashboard → API Keys
2. "Create API Key" click karein
3. API key copy karein

### Step 3: Netlify Environment Variables
1. Netlify Dashboard → Site Settings → Environment Variables
2. Add new variable:
   - **Key:** `RESEND_API_KEY`
   - **Value:** Your Resend API key
3. Save

### Step 4: Domain Verify (Optional but Recommended)
- Resend dashboard se apna domain add karein
- DNS records add karein
- Domain verify hone ke baad `FROM_EMAIL` update karein

---

## Option 2: SendGrid (Alternative)

### Step 1: SendGrid Account
1. Visit: https://sendgrid.com
2. Sign up (FREE tier - 100 emails/day)
3. Verify email

### Step 2: API Key
1. Settings → API Keys
2. Create API Key
3. Copy key

### Step 3: Netlify Environment Variables
- **Key:** `SENDGRID_API_KEY`
- **Value:** Your SendGrid API key

---

## Option 3: Supabase Edge Function (No External Service)

Agar aap Supabase use kar rahe hain, to Supabase Edge Function bhi use kar sakte hain:

1. Supabase Dashboard → Edge Functions
2. New function create karein
3. Email sending logic add karein

---

## Testing

### Local Testing
```bash
# Test email function locally
curl -X POST http://localhost:8888/.netlify/functions/send-email \
  -H "Content-Type: application/json" \
  -d '{
    "type": "rfq",
    "rfqData": {
      "name": "Test User",
      "email": "test@example.com",
      "part_number": "TEST-123",
      "quantity": 10
    }
  }'
```

### Production Testing
1. Form fill karein
2. Check `creative.om3r@gmail.com` inbox
3. Spam folder bhi check karein

---

## Current Configuration

### Email Recipient
- **To:** `creative.om3r@gmail.com` (hardcoded in function)

### Email Sender
- **From:** `noreply@asap-amatom.com` (update karein apne domain ke saath)

### Files Updated
- ✅ `netlify/functions/send-email.ts` - Email sending function
- ✅ `src/lib/rfqQueries.ts` - RFQ submission ke baad email call

---

## Quick Setup (Resend - 5 Minutes)

1. **Resend Sign Up:** https://resend.com/signup
2. **API Key Copy:** Dashboard → API Keys
3. **Netlify Add Variable:**
   ```
   RESEND_API_KEY = your-api-key-here
   ```
4. **Redeploy:** Netlify automatically redeploy karega
5. **Test:** Form fill karein aur email check karein

---

## Troubleshooting

### Email nahi aa rahi?
1. ✅ Check Netlify environment variables
2. ✅ Check Resend/SendGrid dashboard for logs
3. ✅ Check spam folder
4. ✅ Check Netlify function logs
5. ✅ Verify API key correct hai

### Function Error?
- Netlify Dashboard → Functions → Logs check karein
- Console mein error messages dekh sakte hain

---

## Email Template

Email mein yeh information hogi:
- ✅ Contact Information (Name, Email, Phone, Company)
- ✅ Part Information (Part Number, Description, Quantity)
- ✅ Urgency Level (Critical/Urgent/Standard)
- ✅ Customer Message
- ✅ Tracking Information (Source Page, URL, Location)

---

## Next Steps

1. **Resend account banayein** (recommended)
2. **API key Netlify mein add karein**
3. **Redeploy karein**
4. **Test karein** - Form fill karein
5. **Email check karein** - `creative.om3r@gmail.com`

---

**Setup Complete!** Ab har RFQ submission par email automatically `creative.om3r@gmail.com` par jayegi! 🎉

