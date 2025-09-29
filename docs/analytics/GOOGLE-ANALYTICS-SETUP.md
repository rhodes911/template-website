# Google Analytics 4 Setup Guide

## Overview
This guide covers setting up Google Analytics 4 (GA4) tracking for the lead generation website, including event tracking for leads, service interests, and user interactions.

## 🚀 Quick Setup

### Step 1: Create Google Analytics Property
1. Go to [Google Analytics](https://analytics.google.com/)
2. Click "Start measuring" or "Create Account"
3. Enter your business information
4. Create a **GA4 Property** (not Universal Analytics)
5. Set up your data stream for "Web"
6. Enter your website URL (e.g., `https://ellieedwardsmarketing.com`)
7. Copy your **Measurement ID** (format: `G-XXXXXXXXXX`)

### Step 2: Add to Environment Variables
Add your Measurement ID to your environment variables:

```bash
# In .env.local
NEXT_PUBLIC_GA_MEASUREMENT_ID="G-XXXXXXXXXX"
```

### Step 3: Deploy and Test
1. Deploy your changes to Vercel
2. Visit your website
3. Check Google Analytics Real-Time reports (may take a few minutes)

## 📊 Event Tracking Setup

### Automatic Events Tracked
Our implementation automatically tracks:

1. **Lead Submissions**
   - Event: `lead_submission`
   - Triggers when contact form is submitted successfully
   - Parameters: form type, services count, source

2. **Service Interest**
   - Event: `service_interest`
   - Triggers when user selects a service checkbox
   - Parameters: service name

3. **Email Clicks**
   - Event: `email_click`
   - Triggers when user clicks email links
   - Parameters: engagement category

4. **Page Views**
   - Automatic tracking for all page visits
   - Includes referrer and session information

### Custom Events (Coming Soon)
- Phone number clicks
- Service page visits
- Form abandonment
- Scroll depth tracking
- Download tracking

## 🎯 Goals & Conversions Setup

### 1. Set up Conversion Events
In Google Analytics:
1. Go to **Admin** > **Events**
2. Click **Create Event**
3. Create these conversion events:
   - `lead_submission` (mark as conversion)
   - `email_click` (optional conversion)
   - `service_interest` (optional conversion)

### 2. Enhanced Ecommerce (Optional)
For advanced tracking:
- Lead value tracking
- Service interest scoring
- Attribution modeling

## 📈 Key Metrics to Monitor

### Lead Generation Metrics
- **Lead Conversion Rate**: `lead_submission` / total sessions
- **Service Interest Rate**: `service_interest` / total sessions
- **Email Engagement**: `email_click` / total sessions

### Traffic Metrics
- **Organic Traffic**: Sessions from search engines
- **Direct Traffic**: Users typing URL directly
- **Referral Traffic**: Traffic from other websites
- **Page Load Speed**: Core Web Vitals

### User Behavior
- **Session Duration**: Time spent on site
- **Bounce Rate**: Single-page sessions
- **Pages per Session**: Engagement depth
- **Return Visitors**: User retention

## 🔧 Advanced Configuration

### Custom Dimensions (Optional)
Set up custom dimensions for:
1. **Lead Source**: Where the lead came from
2. **Services Selected**: Which services user is interested in
3. **Form Completion Time**: How long it took to fill form

### Audience Creation
Create audiences for:
1. **High-Intent Users**: Selected multiple services
2. **Email Engaged**: Clicked email links
3. **Return Visitors**: Visited multiple times

## 📱 Mobile & Performance Tracking

### Core Web Vitals
Monitor these performance metrics:
- **LCP (Largest Contentful Paint)**: < 2.5s
- **FID (First Input Delay)**: < 100ms
- **CLS (Cumulative Layout Shift)**: < 0.1

### Mobile Experience
Track mobile-specific metrics:
- Mobile conversion rates
- Device type performance
- Touch interaction events

## 🚨 Privacy & Compliance

### GDPR Compliance
- Cookie consent implemented (required for EU users)
- Data retention settings configured (26 months default)
- User deletion requests supported

### Best Practices
- Only track necessary events
- Respect user privacy preferences
- Regular data auditing and cleanup

## 📋 Testing Checklist

### Before Go-Live
- [ ] Measurement ID added to environment variables
- [ ] Real-time events showing in GA4
- [ ] Lead form submissions tracked
- [ ] Email clicks tracked
- [ ] Service selections tracked
- [ ] No console errors in browser
- [ ] Mobile tracking working

### After Go-Live
- [ ] Conversion events set up
- [ ] Goals configured
- [ ] Regular reporting schedule established
- [ ] Team access granted to GA4 property

## 🔍 Troubleshooting

### Common Issues
1. **Events not showing**: Check measurement ID and environment variables
2. **Delayed data**: GA4 can take 24-48 hours to show all data
3. **Missing events**: Verify tracking code in browser developer tools
4. **Console errors**: Check for conflicts with other scripts

### Debug Mode
Enable debug mode for testing:
```javascript
gtag('config', 'GA_MEASUREMENT_ID', {
  debug_mode: true
});
```

## 📞 Support
For technical issues with implementation:
- Check browser console for errors
- Verify environment variables are set
- Test in incognito/private browsing mode
- Contact development team for custom tracking needs

---
*Last updated: August 10, 2025*
