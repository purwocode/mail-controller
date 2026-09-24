# Setup Checklist - Zero Sender Web

Follow these steps in order to get your Zero Sender Web application running.

## ✅ Step 1: Project Already Created

- [x] Next.js 16 project initialized
- [x] Dependencies installed (npm packages ready)
- [x] TypeScript configured
- [x] Tailwind CSS configured
- [x] File structure created

**Location**: `d:\emailcoy-web`

## ✅ Step 2: Create Supabase Project

- [ ] Go to https://supabase.com
- [ ] Click "Sign up" (free tier available)
- [ ] Create new project
- [ ] Name it `emailcoy-web`
- [ ] Wait for project to initialize (5-10 minutes)

**Save these credentials:**
```
Project URL: ________________________
Anon Key: __________________________
Service Role Key: __________________
```

## ✅ Step 3: Setup Database Schema

- [ ] Go to your Supabase project
- [ ] Click "SQL Editor" in left sidebar
- [ ] Click "New Query"
- [ ] Copy SQL from `SUPABASE_SCHEMA.md`
- [ ] Paste into SQL Editor
- [ ] Click "Run" button
- [ ] Wait for all queries to complete successfully

**Expected**: No errors, all tables created

## ✅ Step 4: Configure Environment

- [ ] Copy `.env.local.example` to `.env.local`
- [ ] Fill in Supabase credentials:
  ```
  NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
  NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIs...
  SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIs...
  NEXT_PUBLIC_APP_URL=http://localhost:3000
  APP_SECRET=your-random-secret-key
  ```
- [ ] Save `.env.local`
- [ ] Do NOT commit `.env.local` to Git (already in .gitignore)

**Location**: `d:\emailcoy-web\.env.local`

## ✅ Step 5: Start Development Server

```bash
cd d:\emailcoy-web
npm run dev
```

**Expected Output:**
```
  ▲ Next.js 16.x
  - Local:        http://localhost:3000
```

- [ ] No errors appear
- [ ] Server starts successfully

## ✅ Step 6: Test Application

### Test Authentication
- [ ] Open http://localhost:3000 in browser
- [ ] You should see **Login Page**
- [ ] Create the admin account directly in Supabase (Authentication > Users > Add user) - no public sign-up
- [ ] Login with credentials
- [ ] Should see **Dashboard**

### Test Dashboard
- [ ] Welcome message shows your email
- [ ] Stats cards visible (showing 0)
- [ ] Sidebar shows menu items
- [ ] Quick action buttons visible

### Test Navigation
- [ ] Click "SMTP Config" - Page loads
- [ ] Click "Email Providers" - Page loads
- [ ] Click "Templates" - Page loads
- [ ] Click "Email Lists" - Page loads
- [ ] Click "Campaigns" - Page loads
- [ ] Click "Analytics" - Page loads

### Test SMTP Form
- [ ] Click "Add New SMTP Config"
- [ ] Form appears
- [ ] Fill in test data:
  - Name: `Test SMTP`
  - Host: `smtp.gmail.com`
  - Port: `587`
  - Username: `test@gmail.com`
  - Password: `test-password`
- [ ] Click "Save Config"
- [ ] Config appears in table below

### Test Logout
- [ ] Click "Logout" button (bottom of sidebar)
- [ ] Should redirect to login page
- [ ] Trying to visit /dashboard should redirect to login

## ✅ Step 7: Verify Database

- [ ] Go to Supabase dashboard
- [ ] Click "SQL Editor"
- [ ] Run this query:
  ```sql
  SELECT * FROM public.users;
  ```
- [ ] Should see your test user account

## ✅ Step 8: Prepare for Production

- [ ] Read `README.md` for full documentation
- [ ] Read `DEPLOYMENT.md` for Vercel setup
- [ ] Read `TESTING.md` for complete testing
- [ ] Read `API.md` for API documentation

## 🚀 Step 9: Deploy to Vercel (Optional)

**When ready to deploy:**

1. Push to GitHub
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. Go to https://vercel.com
3. Import project
4. Add environment variables from `.env.local`
5. Deploy

See `DEPLOYMENT.md` for detailed instructions.

## 📁 Important Files Reference

| File | Purpose |
|------|---------|
| `.env.local` | Environment variables (DO NOT COMMIT) |
| `src/app/auth/login/page.tsx` | Login page |
| `src/app/dashboard/page.tsx` | Main dashboard |
| `src/app/dashboard/smtp/page.tsx` | SMTP configuration |
| `src/lib/supabase.ts` | Supabase client |
| `SUPABASE_SCHEMA.md` | Database schema SQL |
| `README.md` | Full documentation |
| `DEPLOYMENT.md` | Vercel deployment guide |

## 🐛 Troubleshooting

### "Cannot find module '@supabase/supabase-js'"
```bash
npm install
npm run dev
```

### "Connection refused to Supabase"
- Check `.env.local` has correct Supabase URL
- Verify Supabase project is active
- Check internet connection

### "Page shows forever loading"
- Open DevTools (F12)
- Check Console tab for errors
- Check if Supabase credentials are correct

### "Login always fails"
- Verify email/password are correct
- Check Supabase > Auth > Users to confirm the admin account exists
- Reset the password from Supabase > Authentication > Users if needed

### "SMTP config not saving"
- Database might not be set up yet
- Check Supabase tables exist
- Check browser console for errors

## ✅ Quick Reference Commands

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Run production build locally
npm run start

# Run linting
npm run lint

# Check TypeScript errors
npm run build  # This compiles TypeScript
```

## 📊 Project Status

- **Frontend**: ✅ Complete
- **Authentication**: ✅ Complete
- **Dashboard UI**: ✅ Complete
- **Database Schema**: ✅ Complete
- **API Routes**: ✅ Scaffolded
- **Email Sending**: ⏳ Ready for implementation
- **Analytics**: ⏳ Ready for implementation

## 🎯 Next Development Steps

1. Implement email template editor (rich HTML)
2. Implement campaign builder
3. Implement email list uploader
4. Implement email sending logic (SMTP/Graph/Gmail)
5. Implement analytics charts
6. Implement email tracking
7. Deploy to Vercel

## 📞 Support

- 📖 See `README.md` for detailed help
- 🚀 See `DEPLOYMENT.md` for production
- 🧪 See `TESTING.md` for testing
- 📡 See `API.md` for API info
- 💾 See `SUPABASE_SCHEMA.md` for database

## 🎉 You're Ready!

Your Zero Sender Web application is ready to use. Follow the steps above to get started!

### What's Next?

1. **Local Development**: Use `npm run dev` to work locally
2. **Test Features**: Follow Step 6 to test everything
3. **Implement Backend**: Add email sending logic to API routes
4. **Deploy**: Use `DEPLOYMENT.md` to go live on Vercel

**Happy coding!** 🚀
