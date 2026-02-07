# 🚀 Supabase Authentication Setup Guide

This guide will walk you through setting up authentication for your PulseGuard application.

## 📋 Prerequisites

- A Supabase account (sign up at https://supabase.com)
- Your PulseGuard web application

---

## Step 1: Get Your Supabase Credentials

1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Select your project (or create a new one)
3. Navigate to **Settings** → **API**
4. Copy the following:
   - **Project URL** (looks like `https://xxxxxxxxxxxxx.supabase.co`)
   - **anon/public key** (starts with `eyJ...`)

---

## Step 2: Configure Environment Variables

1. Open the `.env.local` file in your `web` directory
2. Replace the placeholder values with your actual credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

> [!IMPORTANT]
> Never commit `.env.local` to version control! It's already in `.gitignore`.

---

## Step 3: Create Database Schema

1. In your Supabase Dashboard, go to **SQL Editor**
2. Click **New Query**
3. Open the file `supabase-setup.sql` in your web directory
4. Copy the entire SQL script
5. Paste it into the SQL Editor
6. Click **Run** (or press Ctrl/Cmd + Enter)

You should see a success message. The script creates:
- ✅ `users` table to store user profiles and roles
- ✅ Row Level Security (RLS) policies for data protection
- ✅ Indexes for better performance
- ✅ Triggers for automatic timestamp updates

---

## Step 4: Verify Database Setup

1. Go to **Table Editor** in Supabase Dashboard
2. You should see a new table called `users`
3. Click on it to view the structure:
   - `id` (UUID, Primary Key)
   - `email` (TEXT)
   - `full_name` (TEXT)
   - `role` (TEXT)
   - `created_at` (TIMESTAMPTZ)
   - `updated_at` (TIMESTAMPTZ)

---

## Step 5: Configure Email Authentication (Optional)

By default, Supabase requires email confirmation. You can adjust this:

### Option A: Disable Email Confirmation (For Testing)
1. Go to **Authentication** → **Providers** → **Email**
2. Toggle **Confirm email** to OFF
3. Click **Save**

### Option B: Keep Email Confirmation (Recommended for Production)
1. Customize email templates in **Authentication** → **Email Templates**
2. Users will receive a confirmation email after signup
3. They must click the link before they can log in

---

## Step 6: Test the Authentication Flow

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Open http://localhost:3000

3. Test the signup flow:
   - Click on **Doctor**, **Nurse**, or **Patient** signup
   - Fill in the form with test credentials
   - Submit the form

4. Check your Supabase Dashboard:
   - Go to **Authentication** → **Users**
   - You should see the new user listed
   - Go to **Table Editor** → **users**
   - Verify the user profile was created with the correct role

5. Test the login flow:
   - Try logging in with the credentials you just created
   - You should be redirected to the home page

---

## 🎯 What the Code Does

### Authentication Flow

**Signup Process:**
1. User enters email, password, and full name
2. `signUpUser()` creates an auth user in Supabase
3. A user profile record is created in the `users` table with the role
4. User is redirected to login (or dashboard if email confirmation is disabled)

**Login Process:**
1. User enters email and password
2. `signInUser()` authenticates with Supabase
3. Session is established and stored in cookies
4. User is redirected to the home page
5. Middleware protects routes based on authentication status

### File Structure

```
web/
├── .env.local                    # Supabase credentials (you need to fill this in)
├── supabase-setup.sql           # Database schema to run in Supabase
├── middleware.ts                # Route protection
├── lib/
│   ├── supabase.ts             # Supabase client
│   └── auth.ts                 # Authentication helper functions
└── components/
    └── auth/
        └── auth-form.tsx       # Login/Signup form with Supabase integration
```

---

## 🔒 Security Features

- ✅ **Row Level Security (RLS)**: Users can only access their own data
- ✅ **Password Hashing**: Supabase automatically hashes passwords
- ✅ **Session Management**: Secure JWT-based sessions
- ✅ **Email Verification**: Optional email confirmation
- ✅ **Role-Based Access**: Different user types (doctor, nurse, patient)

---

## 🐛 Troubleshooting

### Error: "Failed to create account"
- Check that your Supabase credentials in `.env.local` are correct
- Verify the `users` table was created in Supabase
- Check browser console for detailed error messages

### Error: "Invalid login credentials"
- Ensure the user exists in Supabase Authentication
- If email confirmation is enabled, check that the user confirmed their email
- Verify password is correct

### Database Connection Issues
- Confirm your `NEXT_PUBLIC_SUPABASE_URL` is correct
- Ensure your `NEXT_PUBLIC_SUPABASE_ANON_KEY` is the **anon** key, not the **service_role** key
- Restart your dev server after changing `.env.local`

### RLS Policy Errors
- Go to **Table Editor** → **users** → Click the shield icon
- Verify all three policies are enabled and correct
- Re-run the SQL script if needed

---

## 📝 Next Steps

After authentication is working:

1. **Create role-specific dashboards** for doctors, nurses, and patients
2. **Add protected routes** in middleware for role-based access
3. **Implement user profile pages**
4. **Add password reset functionality**
5. **Set up email templates** for better user experience

---

## 🎉 You're All Set!

Your authentication system is now ready to use. Users can sign up with different roles and log in to access your application.

For more information, check out:
- [Supabase Auth Documentation](https://supabase.com/docs/guides/auth)
- [Next.js Middleware Documentation](https://nextjs.org/docs/app/building-your-application/routing/middleware)
