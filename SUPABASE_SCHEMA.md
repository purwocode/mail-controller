# Supabase Database Schema

This document outlines the database schema for Zero Sender. Copy and run these SQL queries in your Supabase SQL Editor.

## Setup Instructions

1. Go to your Supabase project
2. Click "SQL Editor" in the left sidebar
3. Click "New Query"
4. Copy and run each section below

## Schema

### 1. Enable Required Extensions

```sql
-- Enable UUID and other extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
```

### 2. Create Users Table

```sql
-- Users table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email VARCHAR(255) NOT NULL UNIQUE,
  full_name VARCHAR(255),
  company_name VARCHAR(255),
  avatar_url VARCHAR(500),
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create index on email
CREATE INDEX idx_users_email ON public.users(email);
```

### 3. SMTP Configurations Table

```sql
CREATE TABLE IF NOT EXISTS public.smtp_configs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  host VARCHAR(255) NOT NULL,
  port INTEGER NOT NULL DEFAULT 587,
  username VARCHAR(255) NOT NULL,
  password TEXT NOT NULL, -- Encrypted in production
  use_tls BOOLEAN DEFAULT TRUE,
  is_default BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes
CREATE INDEX idx_smtp_user ON public.smtp_configs(user_id);
CREATE INDEX idx_smtp_default ON public.smtp_configs(user_id, is_default);

-- Enforce a single default SMTP config per user
CREATE UNIQUE INDEX idx_smtp_single_default ON public.smtp_configs(user_id) WHERE is_default;
```

> **Note**: `password` is encrypted (AES-256-GCM, keyed from `APP_SECRET`) by the app before it's ever written here — see `src/lib/crypto.ts`. The API never returns this column to the client.

### 4. Email Templates Table

```sql
CREATE TABLE IF NOT EXISTS public.email_templates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  subject VARCHAR(500) NOT NULL,
  from_name VARCHAR(255) NOT NULL,
  from_email VARCHAR(255) NOT NULL,
  reply_to VARCHAR(255),
  html_content TEXT NOT NULL,
  plain_text_content TEXT,
  variables JSONB, -- Stores template variables like {name}, {email}, etc
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes
CREATE INDEX idx_templates_user ON public.email_templates(user_id);
CREATE INDEX idx_templates_active ON public.email_templates(user_id, is_active);
```

### 5. Email Lists Table

```sql
CREATE TABLE IF NOT EXISTS public.email_lists (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  email_count INTEGER DEFAULT 0,
  source VARCHAR(100), -- 'upload', 'api', 'manual'
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes
CREATE INDEX idx_lists_user ON public.email_lists(user_id);
CREATE INDEX idx_lists_active ON public.email_lists(user_id, is_active);
```

### 6. Email Addresses Table

```sql
CREATE TABLE IF NOT EXISTS public.email_addresses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  list_id UUID NOT NULL REFERENCES public.email_lists(id) ON DELETE CASCADE,
  email VARCHAR(255) NOT NULL,
  name VARCHAR(255),
  metadata JSONB, -- Custom fields like {company}, {position}, etc
  status VARCHAR(50) DEFAULT 'active', -- 'active', 'unsubscribed', 'bounced'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes
CREATE INDEX idx_emails_list ON public.email_addresses(list_id);
CREATE INDEX idx_emails_email ON public.email_addresses(email);
CREATE INDEX idx_emails_status ON public.email_addresses(status);

-- Add unique constraint per list
ALTER TABLE public.email_addresses 
ADD CONSTRAINT unique_email_per_list UNIQUE(list_id, email);
```

### 7. Campaigns Table

```sql
CREATE TABLE IF NOT EXISTS public.campaigns (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  template_id UUID NOT NULL REFERENCES public.email_templates(id),
  list_id UUID NOT NULL REFERENCES public.email_lists(id),
  smtp_config_id UUID NOT NULL REFERENCES public.smtp_configs(id),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  status VARCHAR(50) DEFAULT 'draft', -- 'draft', 'scheduled', 'running', 'completed', 'paused', 'failed'
  total_emails INTEGER DEFAULT 0,
  sent_emails INTEGER DEFAULT 0,
  failed_emails INTEGER DEFAULT 0,
  opened_emails INTEGER DEFAULT 0,
  clicked_emails INTEGER DEFAULT 0,
  scheduled_at TIMESTAMP WITH TIME ZONE,
  started_at TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,
  paused_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes
CREATE INDEX idx_campaigns_user ON public.campaigns(user_id);
CREATE INDEX idx_campaigns_status ON public.campaigns(user_id, status);
CREATE INDEX idx_campaigns_created ON public.campaigns(created_at DESC);
```

### 8. Campaign Logs Table

```sql
CREATE TABLE IF NOT EXISTS public.campaign_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  campaign_id UUID NOT NULL REFERENCES public.campaigns(id) ON DELETE CASCADE,
  email_address_id UUID NOT NULL REFERENCES public.email_addresses(id),
  recipient_email VARCHAR(255) NOT NULL,
  status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'sent', 'failed', 'opened', 'clicked', 'bounced'
  error_message TEXT,
  tracking_id VARCHAR(255),
  opened_at TIMESTAMP WITH TIME ZONE,
  clicked_at TIMESTAMP WITH TIME ZONE,
  sent_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes
CREATE INDEX idx_logs_campaign ON public.campaign_logs(campaign_id);
CREATE INDEX idx_logs_status ON public.campaign_logs(status);
CREATE INDEX idx_logs_email ON public.campaign_logs(recipient_email);
CREATE INDEX idx_logs_tracking ON public.campaign_logs(tracking_id);
```

### 9. Email Provider Configs Table (Microsoft Graph & Gmail API)

Stores the credentials that used to live in `.env` (`GRAPH_*`, `GMAIL_*`) so they can be added/edited per-user from the dashboard instead of requiring a redeploy.

```sql
CREATE TABLE IF NOT EXISTS public.email_provider_configs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  provider VARCHAR(20) NOT NULL CHECK (provider IN ('graph', 'gmail')),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  -- Microsoft Graph OAuth2
  graph_tenant_id VARCHAR(255),
  graph_client_id VARCHAR(255),
  graph_client_secret TEXT, -- Encrypted (AES-256-GCM) by the app before insert
  -- Gmail API (service account)
  gmail_sender_email VARCHAR(255),
  gmail_service_account_json TEXT, -- Encrypted (AES-256-GCM) by the app before insert
  is_default BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes
CREATE INDEX idx_email_providers_user ON public.email_provider_configs(user_id);

-- Only one default config per provider type (graph/gmail), per user
CREATE UNIQUE INDEX idx_email_providers_single_default
  ON public.email_provider_configs(user_id, provider) WHERE is_default;

-- RLS (self-contained so it can be run on its own against an existing database)
ALTER TABLE public.email_provider_configs ENABLE ROW LEVEL SECURITY;

CREATE POLICY email_provider_configs_policy ON public.email_provider_configs
  FOR ALL USING (auth.uid() = user_id);
```

## Row-Level Security (RLS)

Enable RLS to ensure users can only see their own data:

```sql
-- Enable RLS on all tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.smtp_configs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.email_provider_configs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.email_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.email_lists ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.email_addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.campaign_logs ENABLE ROW LEVEL SECURITY;

-- Users can only see their own record
CREATE POLICY users_policy ON public.users
  FOR ALL USING (auth.uid() = id);

-- Users can only see their own SMTP configs
CREATE POLICY smtp_configs_policy ON public.smtp_configs
  FOR ALL USING (auth.uid() = user_id);

-- Users can only see their own Microsoft Graph / Gmail provider configs
CREATE POLICY email_provider_configs_policy ON public.email_provider_configs
  FOR ALL USING (auth.uid() = user_id);

-- Users can only see their own templates
CREATE POLICY templates_policy ON public.email_templates
  FOR ALL USING (auth.uid() = user_id);

-- Users can only see their own lists
CREATE POLICY lists_policy ON public.email_lists
  FOR ALL USING (auth.uid() = user_id);

-- Users can only see emails in their own lists
CREATE POLICY email_addresses_policy ON public.email_addresses
  FOR ALL USING (
    list_id IN (
      SELECT id FROM public.email_lists 
      WHERE user_id = auth.uid()
    )
  );

-- Users can only see their own campaigns
CREATE POLICY campaigns_policy ON public.campaigns
  FOR ALL USING (auth.uid() = user_id);

-- Users can only see logs from their campaigns
CREATE POLICY campaign_logs_policy ON public.campaign_logs
  FOR ALL USING (
    campaign_id IN (
      SELECT id FROM public.campaigns 
      WHERE user_id = auth.uid()
    )
  );
```

## Create User Trigger

Automatically create user record when a new user signs up:

```sql
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email)
  VALUES (new.id, new.email);
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

## Sample Data (Optional)

```sql
-- You can add sample data after setting up the schema
-- This is useful for testing

-- Note: Replace 'your-user-id' with an actual user ID from auth.users table

-- Insert sample SMTP config
-- INSERT INTO public.smtp_configs (user_id, name, host, port, username, password, is_default)
-- VALUES ('your-user-id', 'Gmail SMTP', 'smtp.gmail.com', 587, 'your-email@gmail.com', 'your-app-password', true);
```

## Verify Setup

After running all queries, verify the schema:

```sql
-- Check tables exist
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;

-- Check row level security is enabled
SELECT tablename, rowsecurity FROM pg_tables 
WHERE schemaname = 'public';
```

## Next Steps

1. ✅ Run all SQL queries above
2. ✅ Verify schema in Supabase dashboard
3. ✅ Update `.env.local` with your Supabase credentials
4. ✅ Start development server: `npm run dev`
5. ✅ Create an account and test the application

## Backup

To backup your database:

```sql
-- Supabase automatically backs up your data
-- You can also export data manually from the Supabase dashboard
-- Settings > Backups > Request backup
```

## Troubleshooting

**Issue**: "Permission denied" when running queries
- **Solution**: Make sure you're logged in as project owner in Supabase

**Issue**: RLS blocking queries
- **Solution**: This is expected during development. Make sure you're authenticated.

**Issue**: Tables not appearing
- **Solution**: Refresh the Supabase dashboard, check the schema dropdown is set to "public"
