# Deployment Guide - Ellie Edwards Marketing

This guide will help you deploy your lead generation website to Vercel with Supabase and Resend integration.

## Prerequisites

- GitHub repository (already created)
- Vercel account
- Supabase account
- Resend account

## Step 1: Set up Supabase

1. **Create a Supabase project:**
   - Go to [supabase.com](https://supabase.com)
   - Click "Start your project"
   - Create a new organization or select existing
   - Create a new project
   - Choose a region close to your users

2. **Set up the database:**
   - Go to the SQL Editor in your Supabase dashboard
   - Run this SQL to create the leads table:

```sql
-- Create leads table
CREATE TABLE leads (
  id BIGSERIAL PRIMARY KEY,
  name TEXT,
  email TEXT NOT NULL,
  message TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create unique index on email
CREATE UNIQUE INDEX leads_email_idx ON leads(email);

-- Enable Row Level Security (RLS)
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

-- Create policy to allow inserts from the application
CREATE POLICY "Allow public inserts" ON leads
  FOR INSERT
  TO public
  WITH CHECK (true);

-- Create policy to allow reads from the application (for admin purposes)
CREATE POLICY "Allow service role reads" ON leads
  FOR SELECT
  TO service_role;
```

3. **Get your Supabase credentials:**
   - Go to Settings > API
   - Copy the "Project URL" 
   - Copy the "anon public" key

## Step 2: Set up Resend

1. **Create a Resend account:**
   - Go to [resend.com](https://resend.com)
   - Sign up for a free account

2. **Get your API key:**
   - Go to API Keys in your dashboard
   - Create a new API key
   - Copy the API key (starts with `re_`)

3. **Set up domain (optional but recommended):**
   - Add your domain in the Domains section
   - Verify DNS records
   - This allows you to send emails from your domain

## Step 3: Deploy to Vercel

1. **Connect your GitHub repository:**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository

2. **Configure environment variables:**
   In the Vercel deployment settings, add these environment variables:

   ```
   NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
   RESEND_API_KEY=re_your-resend-api-key
   NOTIFICATION_EMAIL=ellieedwardsmarketing@gmail.com
   NEXT_PUBLIC_SITE_URL=https://your-domain.vercel.app
   NEXT_PUBLIC_SITE_NAME=Ellie Edwards Marketing
   ```

3. **Deploy:**
   - Click "Deploy"
   - Wait for the build to complete
   - Your site will be live at `https://your-project-name.vercel.app`

## Step 4: Test Everything

1. **Test the lead form:**
   - Visit your deployed site
   - Fill out the contact form
   - Check if the lead appears in your Supabase dashboard
   - Check if you receive an email notification

2. **Test the newsletter signup:**
   - Try subscribing to the newsletter
   - Verify the data is stored in Supabase

## Step 5: Custom Domain (Optional)

1. **Add your domain in Vercel:**
   - Go to your project settings in Vercel
   - Navigate to "Domains"
   - Add your custom domain
   - Follow the DNS configuration instructions

2. **Update environment variables:**
   - Update `NEXT_PUBLIC_SITE_URL` to your custom domain

## Monitoring and Analytics

1. **Supabase Dashboard:**
   - Monitor your leads in the Table Editor
   - Check API usage in the Dashboard

2. **Vercel Analytics:**
   - Enable Vercel Analytics for traffic insights
   - Monitor function invocations and errors

3. **Resend Dashboard:**
   - Monitor email delivery rates
   - Check for bounces or spam reports

## Troubleshooting

### Common Issues:

1. **Environment Variables:**
   - Make sure all required environment variables are set in Vercel
   - Check for typos in variable names

2. **Supabase Connection:**
   - Verify your project URL and API key
   - Check if RLS policies are correctly configured

3. **Email Delivery:**
   - Verify your Resend API key
   - Check if the notification email is correct
   - Consider setting up a custom domain for better deliverability

4. **Build Errors:**
   - Check the Vercel build logs
   - Ensure all dependencies are in package.json

## Security Considerations

1. **Environment Variables:**
   - Never commit real API keys to GitHub
   - Use Vercel's environment variables securely

2. **Database Security:**
   - RLS is enabled for security
   - Only necessary data is public-facing

3. **Email Security:**
   - Emails are sent server-side only
   - No sensitive data in client-side code

## Maintenance

1. **Regular Updates:**
   - Keep dependencies updated
   - Monitor for security updates

2. **Database Cleanup:**
   - Consider archiving old leads
   - Monitor database usage

3. **Email Monitoring:**
   - Check delivery rates regularly
   - Monitor for spam complaints

## Support

If you need help with deployment:
- Check Vercel documentation
- Visit Supabase documentation
- Check Resend documentation
- GitHub Issues for this project
