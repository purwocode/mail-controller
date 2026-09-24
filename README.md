# Zero Sender - Web Version

Professional Email Marketing Platform built with Next.js, React, and Supabase.

## Features

- ✅ **Admin-only Authentication** - Single admin login via Supabase Auth, no public sign-up
- ✅ **SMTP Configuration** - Multiple SMTP server configs, stored encrypted in Supabase
- ✅ **Email Providers** - Microsoft Graph (OAuth2) and Gmail API credentials, stored encrypted in Supabase
- ✅ **Email Templates** - Beautiful, responsive email templates (UI ready, editor pending)
- ✅ **Email Lists** - Bulk upload and manage email lists (UI ready, upload pending)
- ✅ **Campaigns** - Create and manage email campaigns (UI ready, sending pending)
- ✅ **Analytics** - Track campaign performance (placeholder)
- ✅ **Dashboard** - Comprehensive dashboard with statistics
- ✅ **Hardened API** - Input validation, no leaked error details, server-side auth on every route
- ✅ **Vercel Ready** - One-click deployment to Vercel

## Tech Stack

- **Frontend**: Next.js 16 (App Router, Turbopack), React 19, Tailwind CSS v4
- **Backend**: Next.js Route Handlers, Node.js
- **Database**: Supabase (PostgreSQL) with Row Level Security
- **Authentication**: Supabase Auth - admin login only, no public sign-up
- **UI Components**: Lucide React, custom components
- **Deployment**: Vercel

## Prerequisites

- Node.js 18+ 
- npm or yarn
- Supabase account (free at https://supabase.com)
- Vercel account (free at https://vercel.com)

## Setup

### 1. Clone and Install

```bash
# Clone the repository
cd emailcoy-web

# Install dependencies
npm install
```

### 2. Setup Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to Project Settings > API
3. Copy your Project URL and Anon Key
4. Create `.env.local` file (copy from `.env.local.example`):

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# App Settings
NEXT_PUBLIC_APP_URL=http://localhost:3000
APP_SECRET=your-super-secret-key
```

### 3. Setup Database

Run the SQL schema in Supabase SQL Editor (see [SUPABASE_SCHEMA.md](./SUPABASE_SCHEMA.md)):

```sql
-- Run all queries from SUPABASE_SCHEMA.md in Supabase SQL Editor
```

### 4. Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## User Flow

1. **Login** (`/auth/login`) - Admin logs in with email and password (account created directly in Supabase, no public sign-up)
2. **Dashboard** (`/dashboard`) - View statistics and quick actions
3. **SMTP Config** (`/dashboard/smtp`) - Setup SMTP sending servers
4. **Email Providers** (`/dashboard/providers`) - Setup Microsoft Graph / Gmail API credentials
5. **Templates** (`/dashboard/templates`) - Create email templates
6. **Email Lists** (`/dashboard/lists`) - Upload recipient lists
7. **Campaigns** (`/dashboard/campaigns`) - Create and send campaigns
8. **Analytics** (`/dashboard/analytics`) - View campaign performance

## Project Structure

```
emailcoy-web/
├── src/
│   ├── app/
│   │   ├── auth/                 # Authentication pages
│   │   │   └── login/page.tsx    # Login (no sign-up page)
│   │   ├── dashboard/            # Dashboard pages
│   │   │   ├── page.tsx          # Main dashboard
│   │   │   ├── smtp/page.tsx     # SMTP configuration
│   │   │   ├── providers/page.tsx # Microsoft Graph / Gmail API configuration
│   │   │   ├── templates/page.tsx # Email templates
│   │   │   ├── lists/page.tsx    # Email lists
│   │   │   ├── campaigns/page.tsx # Campaigns
│   │   │   └── analytics/page.tsx # Analytics
│   │   ├── api/                  # API routes (all but /health require a Bearer token)
│   │   │   ├── health/route.ts
│   │   │   ├── smtp/route.ts + [id]/route.ts
│   │   │   ├── email-providers/route.ts + [id]/route.ts
│   │   │   ├── campaigns/send/route.ts
│   │   │   └── lists/import/route.ts
│   │   ├── layout.tsx            # Root layout
│   │   ├── icon.svg              # App icon/favicon
│   │   └── globals.css           # Global styles
│   ├── components/
│   │   ├── RootLayout.tsx        # Auth state management
│   │   └── DashboardSidebar.tsx  # Dashboard navigation
│   ├── lib/
│   │   ├── supabase.ts           # Supabase client + server-side auth helper
│   │   ├── auth.ts               # Auth utilities
│   │   ├── crypto.ts             # AES-256-GCM encryption for stored secrets
│   │   ├── api.ts                # Client-side authenticated fetch helper
│   │   ├── route-helpers.ts      # API input validation + safe error responses
│   │   └── types.ts              # TypeScript types
│   └── proxy.ts                  # Server-side gate for /dashboard
├── .env.local.example            # Environment template
├── next.config.ts                # Next.js config
├── tsconfig.json                 # TypeScript config
└── package.json
```

## Environment Variables

Create `.env.local` file with these variables (see `.env.local.example`):

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
NEXT_PUBLIC_APP_URL=
APP_SECRET=
```

SMTP / Microsoft Graph / Gmail credentials are **not** env vars - they're managed per-account from `/dashboard/smtp` and `/dashboard/providers`, stored encrypted in Supabase.

## Deployment

### Deploy to Vercel

1. Push code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Click "Import Project"
4. Select your GitHub repository
5. Add environment variables from `.env.local`
6. Click "Deploy"

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed instructions.

## API Routes

All routes except `/api/health` require an `Authorization: Bearer <supabase-access-token>` header; see [API.md](./API.md) for full details.

### Health Check
- `GET /api/health` - Health check endpoint

### SMTP Configs
- `GET/POST /api/smtp`, `PATCH/DELETE /api/smtp/:id` - Manage SMTP server credentials

### Email Providers
- `GET/POST /api/email-providers`, `PATCH/DELETE /api/email-providers/:id` - Manage Microsoft Graph / Gmail API credentials

### Campaigns
- `POST /api/campaigns/send` - Send campaign emails (sending logic not yet implemented)

### Lists
- `POST /api/lists/import` - Import email list (parsing logic not yet implemented)

## Security

- ✅ Admin-only login, no public sign-up (also disable "Allow new users to sign up" in Supabase Auth settings)
- ✅ Server-side gate on `/dashboard/*` (`src/proxy.ts`) plus Bearer-token + RLS auth on every `/api/*` route
- ✅ SMTP passwords, Microsoft Graph client secret, and Gmail service account JSON encrypted (AES-256-GCM) before storage, and never returned by the API
- ✅ Input validation on all write endpoints; error responses never leak internal details
- ✅ Passwords hashed by Supabase Auth
- ✅ Service role key never exposed to client
- ✅ Row-level security on database tables
- ✅ SQL injection prevention via Supabase's parameterized queries
- ✅ XSS prevention via React's default output escaping

## Support

For issues and questions:
1. Check documentation in `DEPLOYMENT.md` and `SUPABASE_SCHEMA.md`
2. Open an issue on GitHub
3. Visit Supabase docs at https://supabase.com/docs

## License

MIT License - see LICENSE file for details
