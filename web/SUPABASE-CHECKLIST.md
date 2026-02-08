# ⚡ Quick Start: What to Do in Supabase

This is a condensed checklist of the essential steps you need to complete in your Supabase dashboard.

## 📌 Step-by-Step Checklist

### ☐ 1. Get Your Credentials (2 minutes)

1. Go to https://app.supabase.com
2. Select your project
3. Click **Settings** (gear icon) → **API**
4. Copy these two values:
   - **Project URL**
   - **anon public key**
5. Paste them into `web/.env.local` file

---

### ☐ 2. Create the Database Table (1 minute)

1. In Supabase dashboard, go to **SQL Editor** (in the left sidebar)
2. Click **New query** button
3. Open the file `web/supabase-setup.sql` on your computer
4. Copy ALL the SQL code from that file
5. Paste it into the SQL Editor
6. Click **RUN** (or press Ctrl+Enter)
7. You should see "Success. No rows returned"

---

### ☐ 3. Verify Table Was Created (30 seconds)

1. Click **Table Editor** (in the left sidebar)
2. You should see a table called **users**
3. Click on it - you should see these columns:
   - id
   - email
   - full_name
   - role
   - created_at
   - updated_at

---

### ☐ 4. Configure Email Settings (1 minute)

**For Testing (Easier):**
1. Go to **Authentication** → **Providers**
2. Click on **Email**
3. Toggle **Confirm email** to **OFF**
4. Click **Save**

**For Production (More Secure):**
- Leave **Confirm email** enabled
- Users will need to verify their email before logging in

---

### ☐ 5. Test It Works

1. In your terminal, run: `npm run dev`
2. Go to http://localhost:3000
3. Try signing up as a doctor, nurse, or patient
4. Check **Authentication** → **Users** in Supabase dashboard
5. You should see your new user appear!

---

## ✅ That's It!

Once you complete these 5 steps, your authentication system will be fully functional.

## 🐛 Quick Troubleshooting

| Problem | Solution |
|---------|----------|
| Can't connect to Supabase | Double-check credentials in `.env.local` |
| SQL script fails | Make sure you're in the SQL Editor, not Table Editor |
| User not appearing | Check browser console for errors |
| Email not working | Disable email confirmation for testing |

## 📖 Need More Details?

See the full [SETUP-GUIDE.md](file:///c:/Users/Guest1234/Desktop/Team-Shadow-Commanders/web/SETUP-GUIDE.md) for detailed instructions and troubleshooting.
