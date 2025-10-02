# 🌟 Website Template - Professional Business Website



> ✅ **Status**: Template ready for customization  > ✅ **Status**: Fully functional and ready for production deployment  

> 🚀 **Development**: Works immediately - no setup required  > � **Development**: Works immediately - no setup required  

> 📱 **Design**: Mobile-first responsive design  > 📱 **Design**: Mobile-first responsive with pink/black/white theme  

> 🎯 **Features**: Lead capture, email notifications, blog, case studies> � **Features**: Lead capture, email notifications, newsletter signup



This is a **professional website template** built for service-based businesses. Perfect for consultants, agencies, freelancers, and small businesses looking for a modern, conversion-focused website.



## 🔧 Template FeaturesBuilt using:



- ✅ **Modern, responsive design** – Mobile-first approach- 🚀 [Next.js](https://nextjs.org/) – SEO-friendly React framework

- ✅ **Complete content management** – TinaCMS integration- 🌐 [Vercel](https://vercel.com/) – Fast, serverless hosting with CI/CD

- ✅ **SEO optimized** – Meta tags, structured data, sitemaps- 🗃️ [Supabase](https://supabase.com/) – Serverless PostgreSQL database (free tier)

- ✅ **Lead capture forms** – Contact forms with email notifications- 📧 [Resend](https://resend.com/) – Professional email delivery service

- ✅ **Blog system** – Built-in blogging with categories and tags- 🧠 Tailwind CSS – Utility-first styling

- ✅ **Case studies** – Showcase your work and results- 📲 LinkedIn share integration – Professional networking focus

- ✅ **Service pages** – Detailed service descriptions and features- � Mailchimp/Zapier-ready – Marketing automation friendly

- ✅ **Case Studies** – Showcase client results and success stories

- ✅ **Performance optimized** – Fast loading and Core Web Vitals ready---



## 🚀 Built With## 🔧 Features



- **Next.js 14** – React framework with App Router- ✅ **Mobile-first responsive design** – Optimized for all devices, mobile to desktop

- **TypeScript** – Type-safe development- ✅ SEO-optimized landing pages with meta tags

- **Tailwind CSS** – Utility-first CSS framework- ✅ Contact form that captures name + email to Supabase

- **TinaCMS** – Git-based content management- ✅ API route to handle submissions securely

- **Supabase** – Database and authentication- ✅ Instant email notifications via Resend

- **Resend** – Email delivery service- ✅ LinkedIn share integration for professional networking

- **Vercel** – Hosting and deployment- ✅ One-click Vercel deployment

- ✅ Future-proof: integrates with Mailchimp, Zapier, CRMs

## 📋 Getting Started

---

### 1. Replace Template Content

## 📦 Stack Overview

**IMPORTANT**: All content is currently placeholder text that needs to be replaced with your actual business information.

| Tool/Library     | Purpose                                |

Look for these markers throughout the codebase:|------------------|----------------------------------------|

- `REPLACE:` - Content that needs to be customized| Next.js          | Framework for frontend + backend routes |

- `[Your Business Name]` - Replace with your business name| Tailwind CSS     | **Mobile-first responsive design system** |

- `[Your Location]` - Replace with your location| Supabase         | Serverless PostgreSQL database          |

- `Lorem ipsum...` - Replace with real content| Resend           | Professional email delivery             |

| Vercel           | Hosting + auto-deployments              |

### 2. Key Files to Update

---

**Content Files** (in `/content/`):

- `home.md` - Homepage content and hero section## 🚀 Getting Started (Local Dev)

- `about.md` - About page content and team info

- `services.md` - Main services page### Quick Development Setup ⚡

- `contact.md` - Contact page and form settings

- `services/*.md` - Individual service pages**No external services required for development!**

- `blog/*.md` - Blog posts (replace with your content)

- `case-studies/*.md` - Client case studies```bash

- `settings/business.json` - Business information and contact details

cd ellie-edwards-marketing

**Configuration Files**:npm install

- `package.json` - Update project name and descriptionnpm run dev

- `next.config.js` - Domain and SEO settings```

- `tina/config.ts` - CMS configuration

Visit `http://localhost:3000` - the site works immediately with:

### 3. Environment Setup- ✅ **Form submissions logged** to console (not saved to database)

- ✅ **Email notifications logged** to console (not sent)

1. Clone this repository- ✅ **All features testable** without setting up Supabase or Resend

2. Install dependencies: `npm install`

3. Set up environment variables (copy `.env.example` to `.env.local`)### Production Setup 🚀

4. Update the following variables:

   ```For production deployment with real database and email, see `DEPLOYMENT.md`

   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url

   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_key### 1. Clone the Repository

   RESEND_API_KEY=your_resend_api_key

   ``````bash

git clone https://github.com/yourusername/ellie-edwards-marketing.git

### 4. Content Customization Checklistcd ellie-edwards-marketing

```

- [ ] Update business name and branding in `settings/business.json`

- [ ] Replace homepage hero content in `content/home.md`### 2. Install Dependencies

- [ ] Update about page with your story in `content/about.md````bash

- [ ] Customize services in `content/services/`npm install

- [ ] Add your blog posts in `content/blog/````

- [ ] Create case studies in `content/case-studies/`

- [ ] Update contact information in `content/contact.md`### 3. Development Mode (Recommended)

- [ ] Replace FAQ content in `content/faq.md`

- [ ] Update meta titles and descriptions for SEOStart developing immediately:

- [ ] Add your own images to `/public/images/````bash

- [ ] Configure email settings and contact formsnpm run dev

```

### 5. Run Development Server

- Form submissions work and are logged to console

```bash- Email notifications are simulated and logged

npm run dev- No database setup required

```- Perfect for testing and development



Visit `http://localhost:3000` to see your site.### 4. Production Setup (When Ready to Deploy)



## 📁 Project StructureSee `DEPLOYMENT.md` for complete setup with:

- Supabase database configuration

```- Resend email service setup  

├── content/                 # All content files (Markdown)- Vercel deployment

│   ├── home.md             # Homepage content- Environment variables

│   ├── about.md            # About page

│   ├── services.md         # Services overview## 🧪 Local Development

│   ├── blog/               # Blog posts```bash

│   ├── case-studies/       # Client case studiesnpm run dev

│   ├── services/           # Individual service pages```

│   └── settings/           # Site configuration

├── src/Visit: http://localhost:3000

│   ├── app/                # Next.js App Router pages

│   ├── components/         # React components## 📱 Mobile-First Design with Tailwind CSS

│   └── lib/                # Utility functions

├── public/                 # Static assetsThis project uses **Tailwind CSS** with a mobile-first approach, making responsive design incredibly easy:

│   └── images/            # Images and media

└── tina/                  # TinaCMS configuration```tsx

```// Mobile-first: styles apply to mobile by default, then scale up

<div className="p-4 md:p-8 lg:p-12">

## 🎨 Customization Guide  <h1 className="text-2xl md:text-4xl lg:text-6xl font-bold">

    Mobile First Heading

### Colors and Branding  </h1>

Edit the Tailwind config in `tailwind.config.js` to change:</div>

- Primary colors

- Fonts// Responsive grid: 1 column on mobile, 2 on tablet, 3 on desktop

- Spacing<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">

- Breakpoints  {/* Content */}

</div>

### Components```

All UI components are in `src/components/` and can be customized:

- Header and navigation### Tailwind Breakpoints:

- Hero sections- **Default (mobile)**: `0px+` - Styles apply to all screen sizes

- Service cards- **sm**: `640px+` - Small tablets and large phones

- Contact forms- **md**: `768px+` - Tablets

- Blog layouts- **lg**: `1024px+` - Laptops and small desktops

- **xl**: `1280px+` - Large desktops

### SEO Configuration- **2xl**: `1536px+` - Extra large screens

Update SEO settings in:

- Individual content files (frontmatter)### Why Mobile-First?

- `next.config.js` for site-wide settings- 📈 **Better Performance**: Loads faster on mobile devices

- `src/app/layout.tsx` for global metadata- 🎯 **Improved UX**: Ensures great experience on smallest screens first

- 🚀 **Easier Development**: Add complexity gradually for larger screens

## 📧 Email Setup- 📊 **SEO Benefits**: Google prioritizes mobile-first indexing



The template includes contact form functionality:## 📬 Form Flow

1. User fills out lead form (name + email)

1. Sign up for [Resend](https://resend.com)2. Sends POST to `/api/submit`

2. Add your API key to environment variables3. Data is validated and stored in Supabase PostgreSQL

3. Update the sender email in contact form components4. Email notification sent instantly via Resend to REPLACE-your-email@domain.com

4. Customize email templates in `src/app/api/contact/`5. Future-ready for:

   - ✅ Mailchimp API sync

## 🗄️ Database Setup   - ✅ Zapier workflows

   - ✅ Slack/Telegram notifications

Using Supabase for contact form submissions:

## 📱 Social Media Integration

1. Create a [Supabase](https://supabase.com) project

2. Add your credentials to environment variables### LinkedIn Share Button

3. Run the database migrations in `/database-setup.sql````tsx

import { LinkedinShareButton } from 'react-share';

## 🚀 Deployment

<LinkedinShareButton url="https://www.linkedin.com/in/ellie-edwards-marketing">

### Deploy to Vercel (Recommended)  Share on LinkedIn

</LinkedinShareButton>

1. Push your customized code to GitHub```

2. Connect your repository to [Vercel](https://vercel.com)

3. Add environment variables in Vercel dashboard## 📤 Deployment with Vercel

4. Deploy!

1. Push your repo to GitHub

### Other Platforms2. Go to [vercel.com](https://vercel.com)

This template works on any platform that supports Next.js:3. Import the GitHub project

- Netlify4. Set environment variables in Vercel dashboard:

- Railway   ```ini

- DigitalOcean   NEXT_PUBLIC_SUPABASE_URL="your-supabase-url"

- Self-hosted   NEXT_PUBLIC_SUPABASE_ANON_KEY="your-supabase-anon-key" 

   RESEND_API_KEY="your-resend-api-key"

## 📊 Performance   NOTIFICATION_EMAIL="REPLACE-your-email@domain.com"

   NEXT_PUBLIC_SITE_URL="https://your-vercel-domain.vercel.app"

This template is optimized for:   NEXT_PUBLIC_SITE_NAME="Ellie Edwards Marketing"

- ⚡ Fast loading times   ```

- 📱 Mobile performance5. Vercel auto-deploys on every push

- 🔍 SEO rankings

- ♿ Accessibility## 🛠 Future Enhancements

- 🎯 Core Web Vitals

- [ ] Add GDPR consent checkbox

## 🤝 Support- [ ] Connect to Mailchimp (newsletter sync)

- [ ] Trigger Slack/Telegram alerts on new leads

Need help customizing this template?- [ ] A/B testing for landing pages

- [ ] Add blog via MDX or CMS (Sanity, Contentful)

1. Check the documentation in `/docs/` (if available)- [ ] Upgrade to Supabase Pro tier for increased limits (if needed)

2. Review the component files for examples- [ ] Implement full structured data coverage (Service, Article, FAQ)

3. Look for `REPLACE:` comments throughout the code- [ ] Migrate all metadata to canonical helper in `lib/seo.ts`

4. Use the TinaCMS admin panel for content editing- [ ] Audit using `ON-SITE-SEO-PLAN.md` / `TECHNICAL-SEO-PLAN.md` / `OFF-SITE-SEO-PLAN.md`



## 📄 License## 🔐 Environment Variables



This template is open source and available under the MIT License.Set the following for full functionality:



---Required for TinaCMS (editing):

- NEXT_PUBLIC_TINA_CLIENT_ID

**Remember**: This is a template with placeholder content. Make sure to replace all sample content, images, and contact information with your actual business details before going live!- TINA_TOKEN

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
