# Testing Guide

Complete testing checklist for Zero Sender.

## Pre-Testing Setup

```bash
# 1. Start the development server
npm run dev

# 2. Open http://localhost:3000 in your browser
```

## 1. Authentication Testing

### Sign Up Flow
- [ ] Visit `/auth/signup`
- [ ] Enter valid email
- [ ] Enter password (≥ 6 characters)
- [ ] Confirm password
- [ ] Click "Create Account"
- [ ] Should redirect to `/auth/login` after success
- [ ] Verify account created in Supabase > Authentication > Users

### Invalid Inputs
- [ ] Try password < 6 characters - Should show error
- [ ] Try non-matching passwords - Should show error
- [ ] Try invalid email format - Should show error
- [ ] Try existing email - Should show error

### Login Flow
- [ ] Visit `/auth/login`
- [ ] Enter correct email and password
- [ ] Click "Sign In"
- [ ] Should redirect to `/dashboard`
- [ ] Session should be stored in browser cookies

### Login Validation
- [ ] Try wrong password - Should show error
- [ ] Try non-existent email - Should show error
- [ ] Try empty fields - Should require input

### Logout
- [ ] Click "Logout" in sidebar
- [ ] Should redirect to `/auth/login`
- [ ] Cookies should be cleared
- [ ] Trying to visit `/dashboard` should redirect to login

## 2. Dashboard Testing

### Page Load
- [ ] Dashboard page loads
- [ ] User name appears in greeting
- [ ] Stats show (even if 0)
- [ ] Sidebar displays correctly
- [ ] Responsive on mobile devices

### Navigation
- [ ] All sidebar menu items are clickable
- [ ] Each link navigates to correct page
- [ ] Active page is highlighted

### Quick Actions
- [ ] "Create Campaign" button leads to campaigns page
- [ ] "New Template" button leads to templates page
- [ ] "Upload List" button leads to lists page

### Stats Display
- [ ] Total Campaigns shows 0 initially
- [ ] Total Emails shows 0 initially
- [ ] Sent Emails shows 0 initially
- [ ] Templates shows 0 initially

## 3. SMTP Configuration Testing

### Add SMTP Config
- [ ] Click "Add New SMTP Config" button
- [ ] Form appears with empty fields
- [ ] Fill in test SMTP details:
  - [ ] Config Name: "Test SMTP"
  - [ ] Host: "smtp.gmail.com"
  - [ ] Port: "587"
  - [ ] Username: "test@gmail.com"
  - [ ] Password: "test-password"
- [ ] Checkbox "Set as default" works
- [ ] Click "Save Config"

### Form Validation
- [ ] Submitting empty form shows errors
- [ ] Port field only accepts numbers
- [ ] Password field is hidden (shows bullets)
- [ ] Eye icon toggles password visibility

### View Configs
- [ ] Added config appears in table
- [ ] Config details display correctly:
  - [ ] Name shows as "Test SMTP"
  - [ ] Host shows "smtp.gmail.com"
  - [ ] Port shows "587"
  - [ ] "Default" badge appears if set as default

### Edit Config
- [ ] Click edit icon (pencil)
- [ ] Form populates with existing data
- [ ] Modify a field (e.g., Port to 465)
- [ ] Click "Update Config"
- [ ] Changes are saved and reflected in table

### Delete Config
- [ ] Click delete icon (trash)
- [ ] Confirm dialog appears
- [ ] Click confirm
- [ ] Config is removed from table

### Cancel/Hide Form
- [ ] Click "Add New SMTP Config"
- [ ] Form appears
- [ ] Click "Cancel" button
- [ ] Form disappears

## 4. Templates Page Testing

### Page Load
- [ ] Templates page loads
- [ ] Shows empty state message initially
- [ ] "Create New Template" button visible

### Navigation
- [ ] Clicking "Create New Template" navigates correctly
- [ ] Back button works (via sidebar)

## 5. Email Lists Page Testing

### Page Load
- [ ] Email Lists page loads
- [ ] Shows empty state message
- [ ] Shows supported formats (CSV, TXT, XLSX)

### Navigation
- [ ] Clicking "Upload New List" navigates correctly

## 6. Campaigns Page Testing

### Page Load
- [ ] Campaigns page loads
- [ ] Shows empty state message
- [ ] "Create New Campaign" button visible

### Navigation
- [ ] Clicking "Create New Campaign" navigates correctly

## 7. Analytics Page Testing

### Page Load
- [ ] Analytics page loads
- [ ] Shows "Coming Soon" message
- [ ] Shows placeholder chart areas

## 8. Responsive Design Testing

### Desktop (1920px)
- [ ] All elements display correctly
- [ ] Sidebar shows full menu
- [ ] Tables are readable

### Tablet (768px)
- [ ] Sidebar collapses to mobile menu
- [ ] Content adapts to smaller screen
- [ ] Touch targets are appropriately sized

### Mobile (375px)
- [ ] Hamburger menu button appears
- [ ] Menu opens/closes correctly
- [ ] Content is single column
- [ ] Forms are usable on small screens

## 9. API Testing

### Health Check
```bash
curl http://localhost:3000/api/health
```
- [ ] Should return 200 status
- [ ] Should include timestamp

## 10. Database Testing

### Verify Tables Exist
In Supabase SQL Editor:
```sql
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;
```
- [ ] All tables created successfully
- [ ] Tables listed: users, smtp_configs, email_templates, etc.

### Verify RLS Policies
```sql
SELECT tablename, rowsecurity FROM pg_tables 
WHERE schemaname = 'public';
```
- [ ] RLS is enabled on all tables

### Verify User Creation
- [ ] After signup, user appears in `public.users` table
- [ ] User ID matches auth.users table

## 11. Browser Compatibility

### Chrome
- [ ] All pages load
- [ ] All features work
- [ ] No console errors

### Firefox
- [ ] All pages load
- [ ] All features work
- [ ] No console errors

### Safari
- [ ] All pages load
- [ ] All features work
- [ ] No console errors

### Edge
- [ ] All pages load
- [ ] All features work
- [ ] No console errors

## 12. Performance Testing

### Load Time
- [ ] Home page loads in < 2 seconds
- [ ] Dashboard loads in < 1 second
- [ ] No layout shift (CLS)

### Bundle Size
```bash
npm run build
```
- [ ] Build completes without errors
- [ ] Next.js reports reasonable bundle size

## 13. Security Testing

### XSS Protection
- [ ] Try injecting `<script>alert('xss')</script>` in form fields
- [ ] Should not execute (escaped or sanitized)

### CSRF Protection
- [ ] Form submissions include CSRF token
- [ ] API endpoints validate origin

### Sensitive Data
- [ ] Password fields don't appear in logs
- [ ] Service role key not exposed in client code
- [ ] Environment variables not logged

## 14. Accessibility Testing

### Keyboard Navigation
- [ ] Tab through all interactive elements
- [ ] All elements are reachable via keyboard
- [ ] Tab order is logical

### Screen Reader
- [ ] Test with browser screen reader
- [ ] Form labels are announced
- [ ] Buttons have proper text

### Color Contrast
- [ ] Text has sufficient contrast
- [ ] Use browser accessibility checker

## Build Testing

### Test Build
```bash
npm run build
npm run start
```
- [ ] Build completes successfully
- [ ] No warnings or errors
- [ ] App runs on localhost:3000
- [ ] All pages load correctly

## Deployment Testing

### Test Vercel Deployment
- [ ] Push to GitHub
- [ ] Go to Vercel dashboard
- [ ] New deployment should start automatically
- [ ] Deployment completes without errors
- [ ] App works at `https://your-domain.vercel.app`
- [ ] All environment variables are set

## Test Report Template

```markdown
# Zero Sender Test Report

Date: 2024-01-15
Tester: [Your Name]
Build: [Version]

## Summary
- Total Tests: XX
- Passed: XX
- Failed: XX
- Skipped: XX

## Issues Found
1. Issue title
   - Severity: Critical/High/Medium/Low
   - Steps to reproduce
   - Expected result
   - Actual result

## Notes
- Any additional observations
- Performance notes
- Recommendations

## Sign-off
- [ ] Ready for production
- [ ] Ready for staging
- [ ] Needs more fixes
```

## Continuous Testing

Run these commands regularly:

```bash
# Type checking
npm run build

# Linting
npm run lint

# Manual testing
npm run dev
```

## Issue Reporting

If you find issues:
1. Write detailed reproduction steps
2. Include browser/device info
3. Screenshot or recording if helpful
4. Check if issue already exists
5. Open GitHub issue with template above
