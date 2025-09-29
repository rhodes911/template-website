# 🌟 Ellie Edwards Marketing – Lead Generation Website

> ✅ **Status**: Fully functional and ready for production deployment  
> � **Development**: Works immediately - no setup required  
> 📱 **Design**: Mobile-first responsive with pink/black/white theme  
> � **Features**: Lead capture, email notifications, newsletter signup

This is the official lead generation website for **Ellie Edwards Marketing**, a modern digital marketing brand focused on client acquisition, personal branding, and conversion-focused campaigns.

Built using:

- 🚀 [Next.js](https://nextjs.org/) – SEO-friendly React framework
- 🌐 [Vercel](https://vercel.com/) – Fast, serverless hosting with CI/CD
- 🗃️ [Supabase](https://supabase.com/) – Serverless PostgreSQL database (free tier)
- 📧 [Resend](https://resend.com/) – Professional email delivery service
- 🧠 Tailwind CSS – Utility-first styling
- 📲 LinkedIn share integration – Professional networking focus
- � Mailchimp/Zapier-ready – Marketing automation friendly

---

## 🔧 Features

- ✅ **Mobile-first responsive design** – Optimized for all devices, mobile to desktop
- ✅ SEO-optimized landing pages with meta tags
- ✅ Contact form that captures name + email to Supabase
- ✅ API route to handle submissions securely
- ✅ Instant email notifications via Resend
- ✅ LinkedIn share integration for professional networking
- ✅ One-click Vercel deployment
- ✅ Future-proof: integrates with Mailchimp, Zapier, CRMs

---

## 📦 Stack Overview

| Tool/Library     | Purpose                                |
|------------------|----------------------------------------|
| Next.js          | Framework for frontend + backend routes |
| Tailwind CSS     | **Mobile-first responsive design system** |
| Supabase         | Serverless PostgreSQL database          |
| Resend           | Professional email delivery             |
| Vercel           | Hosting + auto-deployments              |

---

## 🚀 Getting Started (Local Dev)

### Quick Development Setup ⚡

**No external services required for development!**

```bash
git clone https://github.com/yourusername/ellie-edwards-marketing.git
cd ellie-edwards-marketing
npm install
npm run dev
```

Visit `http://localhost:3000` - the site works immediately with:
- ✅ **Form submissions logged** to console (not saved to database)
- ✅ **Email notifications logged** to console (not sent)
- ✅ **All features testable** without setting up Supabase or Resend

### Production Setup 🚀

For production deployment with real database and email, see `DEPLOYMENT.md`

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/ellie-edwards-marketing.git
cd ellie-edwards-marketing
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Development Mode (Recommended)

Start developing immediately:
```bash
npm run dev
```

- Form submissions work and are logged to console
- Email notifications are simulated and logged
- No database setup required
- Perfect for testing and development

### 4. Production Setup (When Ready to Deploy)

See `DEPLOYMENT.md` for complete setup with:
- Supabase database configuration
- Resend email service setup  
- Vercel deployment
- Environment variables

## 🧪 Local Development
```bash
npm run dev
```

Visit: http://localhost:3000

## 📱 Mobile-First Design with Tailwind CSS

This project uses **Tailwind CSS** with a mobile-first approach, making responsive design incredibly easy:

```tsx
// Mobile-first: styles apply to mobile by default, then scale up
<div className="p-4 md:p-8 lg:p-12">
  <h1 className="text-2xl md:text-4xl lg:text-6xl font-bold">
    Mobile First Heading
  </h1>
</div>

// Responsive grid: 1 column on mobile, 2 on tablet, 3 on desktop
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  {/* Content */}
</div>
```

### Tailwind Breakpoints:
- **Default (mobile)**: `0px+` - Styles apply to all screen sizes
- **sm**: `640px+` - Small tablets and large phones
- **md**: `768px+` - Tablets
- **lg**: `1024px+` - Laptops and small desktops
- **xl**: `1280px+` - Large desktops
- **2xl**: `1536px+` - Extra large screens

### Why Mobile-First?
- 📈 **Better Performance**: Loads faster on mobile devices
- 🎯 **Improved UX**: Ensures great experience on smallest screens first
- 🚀 **Easier Development**: Add complexity gradually for larger screens
- 📊 **SEO Benefits**: Google prioritizes mobile-first indexing

## 📬 Form Flow
1. User fills out lead form (name + email)
2. Sends POST to `/api/submit`
3. Data is validated and stored in Supabase PostgreSQL
4. Email notification sent instantly via Resend to ellieedwardsmarketing@gmail.com
5. Future-ready for:
   - ✅ Mailchimp API sync
   - ✅ Zapier workflows
   - ✅ Slack/Telegram notifications

## 📱 Social Media Integration

### LinkedIn Share Button
```tsx
import { LinkedinShareButton } from 'react-share';

<LinkedinShareButton url="https://www.linkedin.com/in/ellie-edwards-marketing">
  Share on LinkedIn
</LinkedinShareButton>
```

## 📤 Deployment with Vercel

1. Push your repo to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Import the GitHub project
4. Set environment variables in Vercel dashboard:
   ```ini
   NEXT_PUBLIC_SUPABASE_URL="your-supabase-url"
   NEXT_PUBLIC_SUPABASE_ANON_KEY="your-supabase-anon-key" 
   RESEND_API_KEY="your-resend-api-key"
   NOTIFICATION_EMAIL="ellieedwardsmarketing@gmail.com"
   NEXT_PUBLIC_SITE_URL="https://your-vercel-domain.vercel.app"
   NEXT_PUBLIC_SITE_NAME="Ellie Edwards Marketing"
   ```
5. Vercel auto-deploys on every push

## 🛠 Future Enhancements

- [ ] Add GDPR consent checkbox
- [ ] Connect to Mailchimp (newsletter sync)
- [ ] Trigger Slack/Telegram alerts on new leads
- [ ] A/B testing for landing pages
- [ ] Add blog via MDX or CMS (Sanity, Contentful)
- [ ] Upgrade to Supabase Pro tier for increased limits (if needed)
- [ ] Implement full structured data coverage (Service, Article, FAQ)
- [ ] Migrate all metadata to canonical helper in `lib/seo.ts`
- [ ] Audit using `ON-SITE-SEO-PLAN.md` / `TECHNICAL-SEO-PLAN.md` / `OFF-SITE-SEO-PLAN.md`

## 🔐 Environment Variables

Set the following for full functionality:

Required for TinaCMS (editing):
- NEXT_PUBLIC_TINA_CLIENT_ID
- TINA_TOKEN

Required for AI Assistant:
- OPENAI_API_KEY
- OPENAI_MODEL (optional, defaults to gpt-4o-mini)
- NEXT_PUBLIC_SITE_URL (optional)

## 🤝 Contributing
This is a personal project, but feel free to fork or extend it. PRs are welcome!

## 📄 License
MIT License – free for personal and commercial use.

## 👤 About Ellie Edwards Marketing
Ellie Edwards is a creative marketing strategist helping entrepreneurs and personal brands grow through smart campaigns, bold design, and a people-first approach to digital marketing.

## ✨ Developed by
**Jamie Rhodes**  
[LinkedIn](https://www.linkedin.com/in/jamie-rhodes-444860234)  
AI + Software Engineer | Research Automation | Product Builder

---
