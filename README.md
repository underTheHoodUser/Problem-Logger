# 🤯 CHUDDI - The Ultimate Problem Logger

A Neobrutalist, Shonen Anime-inspired web application for anonymously sharing and rating your daily "Chuddis" (problems). Built with **Next.js 14 (App Router)**, **Supabase**, **Tailwind CSS**, and **Resend**.

![App Preview](https://via.placeholder.com/800x400/0a0a0a/ec4899?text=CHUDDI+APP+SCREENSHOT)

## 🌟 Features
- **Anonymous Submissions:** Users can post problems without accounts.
- **Admin Moderation Workflow:** Problems are hidden until approved by an admin.
- **IP Rate Limiting:** Prevents spam by restricting submissions to 1 per 10 minutes per IP.
- **Double Opt-In Email Subscriptions:** Users verify their emails via magic links.
- **Automated Email Blasts:** Verified subscribers receive stylish alerts the moment an admin approves a problem.
- **Infinite Scrolling:** Handles massive amounts of problems seamlessly on both the frontend and admin dashboard.
- **Global CMS (JSON):** 100% of the text on the app is configurable dynamically from the Admin Panel.
- **Neobrutalist UI:** Fierce dark mode aesthetics, hard shadows, thick borders, and custom toast alerts.

---

## 🛠️ Step-by-Step Setup Guide

Follow these exact steps to run this project locally or deploy it to production.

### 1. Supabase Setup (Database & Auth)
This project uses Supabase as the backend database and authentication provider.
1. Create a free account at [Supabase](https://supabase.com/).
2. Create a new Project.
3. Once your project is ready, go to the **SQL Editor** in the left sidebar.
4. Copy the entire contents of `complete-schema.sql` (found in the root of this repository) and paste it into the editor.
5. Click **Run**. This will generate all the required tables (`problems`, `subscribers`, `site_config`), apply Row Level Security (RLS) policies, and structure the data correctly.

### 2. Admin Authentication Setup
To access the `/admin` panel, you need a registered user in Supabase.
1. Go to **Authentication -> Users** in your Supabase dashboard.
2. Click **Add User** -> **Create New User**.
3. Enter your email and a secure password.
4. Uncheck "Auto Confirm User" if you haven't set up email SMTP, or simply go to the **SQL Editor** and run this to auto-confirm yourself:
   ```sql
   UPDATE auth.users SET email_confirmed_at = now() WHERE email = 'your-admin@email.com';
   ```
5. You can now log into `/admin` using these credentials.

### 3. Resend Setup (Email Automations)
We use Resend to dispatch verification links and subscription alerts.
1. Create a free account at [Resend](https://resend.com/).
2. Go to **API Keys** and generate a new key.
3. *(Optional but Recommended for Production)* Go to **Domains**, add your custom domain (e.g., `chuddi.store`), and add the provided DNS records to your hosting provider.
4. *Note: If you do not verify a domain, Resend limits you to sending testing emails ONLY to your own registered email address.*

### 4. Environment Variables
Create a file named `.env.local` in the root of this project and add the following keys. 
*(You can find your Supabase keys in Project Settings -> API)*

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Resend
RESEND_API_KEY=your-resend-api-key
```
> **⚠️ Security Warning:** Never commit `SUPABASE_SERVICE_ROLE_KEY` to public repositories or expose it on the frontend (`NEXT_PUBLIC_`). It has administrative privileges.

### 5. Running the App
Install dependencies and spin up the local development server:

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser.

---

## 🎨 Global CMS Configuration
Once the app is running:
1. Navigate to `http://localhost:3000/admin`.
2. Log in using your Supabase Auth credentials.
3. Click the **SITE CONFIG** tab.
4. You will see a giant JSON object. You can safely edit **any text, toast, or email template** used in the entire application from right here.
5. Click **SAVE SETTINGS**. The app will immediately reflect your changes across all connected clients.
6. If you accidentally break the JSON syntax, click **RESET DEFAULTS** to restore the factory settings.

## 🚀 Deployment
Deploy effortlessly on **Vercel**:
1. Push your code to a GitHub repository.
2. Go to the Vercel Dashboard and click **Import Project**.
3. Select your repository.
4. Expand the **Environment Variables** section and paste in your 4 keys from `.env.local`.
5. Click **Deploy**.

---

### Tech Stack
- [Next.js](https://nextjs.org) (App Router, Server API Routes)
- [Supabase](https://supabase.com) (PostgreSQL, Auth, RLS)
- [Resend](https://resend.com) (Email SDK)
- [Tailwind CSS](https://tailwindcss.com) (Styling)
- [React Hot Toast](https://react-hot-toast.com/) (Alerts)
