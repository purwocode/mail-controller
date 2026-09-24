# QUICK START GUIDE

Get Zero Sender up and running in 5 minutes!

## 1. Clone Project

```bash
cd d:\emailcoy-web
```

## 2. Install Dependencies

```bash
npm install
```

## 3. Setup Supabase

### Option A: Free Cloud Setup (Recommended)

1. Go to https://supabase.com and sign up for free
2. Create a new project
3. Go to Settings > API
4. Copy `Project URL` and `anon public key`

### Option B: Local Supabase (Docker)

```bash
npm install -g supabase
supabase start
```

## 4. Create .env.local

Copy `.env.local.example` and fill in values:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY=YOUR_SERVICE_ROLE_KEY
NEXT_PUBLIC_APP_URL=http://localhost:3000
APP_SECRET=dev-secret-key
```

## 5. Setup Database

1. Go to Supabase SQL Editor
2. Run all queries from `SUPABASE_SCHEMA.md`
3. Wait for completion (should take ~1 minute)

## 6. Start Development Server

```bash
npm run dev
```

Open http://localhost:3000 - You should see the login page!

## 7. Create Account & Test

1. Click "Sign up here"
2. Create account with:
   - Email: `test@example.com`
   - Password: `password123` (or any password ≥ 6 chars)
3. Login with your credentials
4. Explore the dashboard!

## Test The Features

### Dashboard
- [x] View stats (will show 0 initially)
- [x] See quick action buttons

### SMTP Configuration
- [x] Click "Add New SMTP Config"
- [x] Fill in details (use Gmail SMTP as example):
  - Name: `Gmail Test`
  - Host: `smtp.gmail.com`
  - Port: `587`
  - Username: `your-email@gmail.com`
  - Password: `your-app-password`
- [x] Click Save

### Templates
- [x] Click "Create New Template"
- [x] (Page is ready for implementation)

### Email Lists
- [x] Click "Upload New List"
- [x] (Page is ready for file upload implementation)

### Campaigns
- [x] Click "Create New Campaign"
- [x] (Page is ready for campaign setup)

## Troubleshooting

### "Cannot find module '@supabase/supabase-js'"
```bash
npm install
npm run dev
```

### "Connection refused to Supabase"
- Check `.env.local` has correct Supabase URL and keys
- Verify Supabase project is active

### "Page shows loading forever"
- Open browser DevTools (F12)
- Check Console for errors
- Make sure Supabase Auth is enabled

### "Login always fails"
- Verify email/password match what you signed up with
- Check Supabase > Authentication > Users to see registered users
- Try creating a new account

## Next Steps

1. **Setup SMTP accounts** - Add your email sending servers
2. **Create templates** - Design your email templates
3. **Import lists** - Upload recipient email lists
4. **Launch campaigns** - Send your first email campaign

## Deploy to Production

When ready to go live:

```bash
# 1. Make sure everything works locally
npm run build

# 2. Push to GitHub
git add .
git commit -m "Initial commit"
git push origin main

# 3. Deploy to Vercel (see DEPLOYMENT.md)
```

## Database Backup

Before using in production:

```sql
-- Go to Supabase > Settings > Backups
-- Request backup
```

## Get Help

- 📖 Read `SUPABASE_SCHEMA.md` for database info
- 🚀 Read `DEPLOYMENT.md` for production setup
- 📞 Check Supabase docs: https://supabase.com/docs
- 💬 Ask in Vercel Community: https://vercel.community

## Tips

- Use `npm run dev` during development
- Use `npm run build` to check for build errors
- Use Supabase SQL Editor to view/edit data directly
- Use browser DevTools to debug API calls
- Check `/api/health` endpoint to verify backend is working

Enjoy! 🚀
