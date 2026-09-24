# Deployment Guide - Vercel

This guide walks you through deploying Zero Sender to Vercel.

## Prerequisites

- GitHub account with your repository pushed
- Supabase account with database configured
- Vercel account (free at https://vercel.com)

## Step-by-Step Deployment

### 1. Prepare Your Code

```bash
# Make sure all changes are committed
git add .
git commit -m "Ready for deployment"
git push origin main
```

### 2. Create Vercel Account

1. Go to [vercel.com](https://vercel.com)
2. Click "Sign up" and choose "Continue with GitHub"
3. Authorize Vercel to access your GitHub account

### 3. Import Project

1. Click "New Project" on Vercel dashboard
2. Select your `emailcoy-web` repository
3. Click "Import"

### 4. Configure Environment Variables

On the "Configure Project" screen, add environment variables:

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...
NEXT_PUBLIC_APP_URL=https://your-domain.vercel.app
APP_SECRET=your-super-secret-key
```

**Get these values from:**
- **NEXT_PUBLIC_SUPABASE_URL** & **NEXT_PUBLIC_SUPABASE_ANON_KEY**: Supabase > Settings > API
- **SUPABASE_SERVICE_ROLE_KEY**: Supabase > Settings > API > Service role
- **NEXT_PUBLIC_APP_URL**: Will be your Vercel domain (e.g., `https://emailcoy-web.vercel.app`)
- **APP_SECRET**: Generate a random secret: `openssl rand -hex 32`

### 5. Deploy

1. Click "Deploy"
2. Wait for deployment to complete (usually 2-5 minutes)
3. Click the preview link to visit your app

### 6. Verify Deployment

1. Visit your Vercel domain
2. In Supabase Dashboard > Authentication > Users, add your admin account if you haven't already (there is no public sign-up page)
3. In Supabase Dashboard > Authentication settings, disable "Allow new users to sign up"
4. Test login
5. Check that all pages load correctly
6. Verify environment variables are working

## Vercel Project Settings (Optional)

### Enable Preview Deployments

1. Go to Settings > Git
2. Under "Deployments", enable "Preview Deployments"
3. This creates a preview URL for each pull request

### Custom Domain

1. Go to Settings > Domains
2. Click "Add Domain"
3. Enter your domain (e.g., `emailsender.com`)
4. Follow DNS configuration instructions
5. Your app will be accessible at your custom domain

### Production Branch

Make sure `main` is set as production branch:
1. Settings > Git > Production Branch
2. Select `main`

## Monitoring & Logs

### View Logs
1. Click "Deployments" tab
2. Click the latest deployment
3. Click "Logs" to see build and runtime logs

### Monitor Errors
1. Go to "Analytics" tab
2. Check for any errors or performance issues
3. Review Web Vitals

## Continuous Deployment

Every time you push to your main branch:
1. Vercel automatically builds your project
2. Runs any build scripts in package.json
3. Deploys to production

To avoid auto-deploy for certain commits, include `[skip ci]` in commit message:
```bash
git commit -m "WIP: feature [skip ci]"
```

## Database Backup Before Deployment

Before your first deployment, backup your Supabase database:

1. Go to Supabase dashboard
2. Settings > Backups
3. Click "Request backup"

## Troubleshooting

### Build fails with "Module not found"

```bash
# Make sure all dependencies are listed in package.json
npm install
npm run build

# Then commit and push
git add package-lock.json
git commit -m "Update dependencies"
git push
```

### Environment variables not working

1. Delete deployment and redeploy
2. Go to Settings > Environment Variables
3. Make sure variables are correct
4. Trigger new deployment: Settings > Git > Manual Deploy > Deploy

### CORS errors in production

Check that `NEXT_PUBLIC_APP_URL` matches your Vercel domain:
1. Settings > Environment Variables
2. Update `NEXT_PUBLIC_APP_URL` if needed
3. Redeploy

### Database connection refused

1. Check Supabase is running
2. Verify `NEXT_PUBLIC_SUPABASE_URL` and keys are correct
3. In Supabase, check if your Vercel IP is whitelisted:
   - Settings > Database > SSL/TLS Configuration
   - Make sure it's not restricting IPs

### Authentication not working in production

1. Go to Supabase > Authentication > URL Configuration
2. Add your Vercel domain to allowed URLs:
   - `https://your-domain.vercel.app`
   - `https://your-custom-domain.com`

## Performance Tips

### Optimize Images

Already using Next.js Image component ✅

### Enable Caching

The Next.js app uses automatic caching for:
- Static assets (CSS, JS)
- API responses (configurable)

### Monitor Performance

1. Go to Analytics tab
2. Check Core Web Vitals
3. Look for slow pages
4. Optimize if needed

## Update Application

To update your deployed application:

```bash
# Make changes locally
# Test with npm run dev
# Commit and push
git add .
git commit -m "Update: description of changes"
git push origin main

# Vercel automatically deploys within seconds
```

## Rollback Deployment

If something goes wrong:

1. Go to Vercel dashboard
2. Click "Deployments"
3. Find the previous working deployment
4. Click "..." menu
5. Click "Promote to Production"

## Delete Deployment

To delete the entire Vercel project:

1. Go to Settings > Danger Zone
2. Click "Delete Project"
3. Confirm by typing project name
4. Your app will be deleted (database remains intact)

## Support & Resources

- **Vercel Docs**: https://vercel.com/docs
- **Next.js Docs**: https://nextjs.org/docs
- **Supabase Docs**: https://supabase.com/docs
- **Vercel Support**: https://vercel.com/support

## Post-Deployment Checklist

- [ ] Login works with the admin account
- [ ] Public sign-up is disabled in Supabase Auth settings
- [ ] SMTP configuration page loads and saving a config works
- [ ] Email Providers (Microsoft Graph / Gmail) page loads and saving a config works
- [ ] Template creation works
- [ ] Email list upload works
- [ ] Campaign creation works
- [ ] Environment variables are set correctly
- [ ] Database backups are configured
- [ ] Custom domain is configured (if needed)
- [ ] SSL certificate is valid
- [ ] Analytics are tracking events

Congratulations! Your Zero Sender application is now live on Vercel! 🎉
