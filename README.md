# Zero Sender - Web Version

Professional Email Marketing Platform built with Next.js, React, and Supabase.

## Features

- ✅ **User Authentication** - Secure login with Supabase Auth
- ✅ **SMTP Configuration** - Multiple SMTP server configurations
- ✅ **Email Templates** - Beautiful, responsive email templates
- ✅ **Email Lists** - Bulk upload and manage email lists
- ✅ **Campaigns** - Create and manage email campaigns
- ✅ **Analytics** - Track campaign performance
- ✅ **Dashboard** - Comprehensive dashboard with statistics
- ✅ **Vercel Ready** - One-click deployment to Vercel

## Tech Stack

- **Frontend**: Next.js 14, React, Tailwind CSS
- **Backend**: Next.js API Routes, Node.js
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **UI Components**: Lucide React, Custom components
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

1. **Sign Up** (`/auth/signup`) - Create a new account
2. **Login** (`/auth/login`) - Login with email and password
3. **Dashboard** (`/dashboard`) - View statistics and quick actions
4. **SMTP Config** (`/dashboard/smtp`) - Setup email sending servers
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
│   │   │   ├── login/page.tsx
│   │   │   └── signup/page.tsx
│   │   ├── dashboard/            # Dashboard pages
│   │   │   ├── page.tsx          # Main dashboard
│   │   │   ├── smtp/page.tsx     # SMTP configuration
│   │   │   ├── templates/page.tsx # Email templates
│   │   │   ├── lists/page.tsx    # Email lists
│   │   │   ├── campaigns/page.tsx # Campaigns
│   │   │   └── analytics/page.tsx # Analytics
│   │   ├── api/                  # API routes
│   │   │   ├── health/route.ts
│   │   │   ├── campaigns/send/route.ts
│   │   │   └── lists/import/route.ts
│   │   ├── layout.tsx            # Root layout
│   │   └── globals.css           # Global styles
│   ├── components/
│   │   ├── RootLayout.tsx        # Auth state management
│   │   └── DashboardSidebar.tsx  # Dashboard navigation
│   └── lib/
│       ├── supabase.ts           # Supabase client
│       ├── auth.ts               # Auth utilities
│       └── types.ts              # TypeScript types
├── .env.local.example            # Environment template
├── next.config.ts                # Next.js config
├── tsconfig.json                 # TypeScript config
└── package.json
```

## Environment Variables

Create `.env.local` file with these variables:

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
NEXT_PUBLIC_APP_URL=
APP_SECRET=
```

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

### Health Check
- `GET /api/health` - Health check endpoint

### Campaigns
- `POST /api/campaigns/send` - Send campaign emails

### Lists
- `POST /api/lists/import` - Import email list

## Security

- ✅ User authentication required for dashboard access
- ✅ Passwords hashed with bcrypt
- ✅ Service role key never exposed to client
- ✅ Row-level security on database tables
- ✅ CORS protection
- ✅ SQL injection prevention via Supabase

## Support

For issues and questions:
1. Check documentation in `DEPLOYMENT.md` and `SUPABASE_SCHEMA.md`
2. Open an issue on GitHub
3. Visit Supabase docs at https://supabase.com/docs

## License

MIT License - see LICENSE file for details
