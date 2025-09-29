// Service data for all service pages
export interface ServiceData {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  keywords: string[];
  icon: string;
  heroTitle: string;
  heroSubtitle: string;
  heroDescription: string;
  whatYouGet: string[];
  features: Array<{
    title: string;
    description: string;
    icon: string;
  }>;
  process: Array<{
    step: string;
    title: string;
    description: string;
    duration: string;
  }>;
  results: string[];
  faqs: Array<{
    question: string;
    answer: string;
  }>;
  ctaTitle: string;
  ctaDescription: string;
  emailSubject: string;
  emailBody: string;
}

export const servicesData: Record<string, ServiceData> = {
  'brand-strategy': {
    id: 'brand-strategy',
    title: 'Brand Strategy',
    subtitle: 'Brand Strategy Service',
    description: 'Build a compelling brand identity that resonates with your target audience and sets you apart from competitors.',
    keywords: ['brand strategy', 'brand identity', 'brand positioning', 'visual identity', 'brand messaging', 'brand guidelines'],
    icon: 'Target',
    heroTitle: 'Build a Brand That',
    heroSubtitle: 'Stands Out',
    heroDescription: 'Create a compelling brand identity that resonates with your target audience, differentiates you from competitors, and builds lasting customer loyalty.',
    whatYouGet: [
      'Comprehensive brand strategy',
      'Visual identity guidelines',
      'Messaging framework',
      'Competitive analysis',
      'Implementation roadmap'
    ],
    features: [
      {
        title: 'Brand Positioning Strategy',
        description: 'Define your unique position in the market and differentiate from competitors.',
        icon: 'Target'
      },
      {
        title: 'Visual Identity Development',
        description: 'Create cohesive visual elements that reflect your brand personality.',
        icon: 'Award'
      },
      {
        title: 'Brand Messaging Framework',
        description: 'Develop clear, consistent messaging that resonates with your audience.',
        icon: 'MessageSquare'
      },
      {
        title: 'Competitive Analysis',
        description: 'Understand your competition and identify opportunities for differentiation.',
        icon: 'TrendingUp'
      },
      {
        title: 'Brand Guidelines Creation',
        description: 'Comprehensive guidelines to ensure consistent brand application.',
        icon: 'Users'
      },
      {
        title: 'Brand Voice & Tone Definition',
        description: 'Establish how your brand communicates across all touchpoints.',
        icon: 'MessageSquare'
      }
    ],
    process: [
      {
        step: '01',
        title: 'Discovery & Research',
        description: 'Deep dive into your business, audience, and competitive landscape to understand your unique positioning opportunities.',
        duration: '1-2 weeks'
      },
      {
        step: '02',
        title: 'Strategy Development',
        description: 'Create your brand positioning, messaging framework, and visual identity direction based on research insights.',
        duration: '2-3 weeks'
      },
      {
        step: '03',
        title: 'Brand Guidelines Creation',
        description: 'Develop comprehensive brand guidelines including visual standards, voice guidelines, and application examples.',
        duration: '1-2 weeks'
      },
      {
        step: '04',
        title: 'Implementation Support',
        description: 'Help you apply your new brand across all touchpoints with ongoing guidance and support.',
        duration: 'Ongoing'
      }
    ],
    results: [
      '300% increase in brand recognition',
      'Stronger market differentiation',
      'Consistent brand experience',
      'Higher customer loyalty',
      'Improved brand perception',
      'Increased premium pricing power'
    ],
    faqs: [
      {
        question: 'How long does the brand strategy process take?',
        answer: 'Typically 4-8 weeks depending on the scope and complexity of your business. We work efficiently while ensuring thoroughness in our research and strategy development.'
      },
      {
        question: 'What deliverables will I receive?',
        answer: 'You\'ll receive a comprehensive brand strategy document, visual identity guidelines, messaging framework, competitor analysis, and implementation roadmap.'
      },
      {
        question: 'Do you work with businesses of all sizes?',
        answer: 'Yes, I work with startups, small businesses, and established companies. The strategy is tailored to your specific stage and goals.'
      },
      {
        question: 'How is this different from just logo design?',
        answer: 'Brand strategy goes much deeper than visual design. It defines who you are, what you stand for, and how you communicate - creating a foundation for all your marketing efforts.'
      },
      {
        question: 'Can you help implement the strategy after it\'s created?',
        answer: 'Absolutely! I provide implementation support and can help apply your new brand across websites, marketing materials, and other touchpoints.'
      }
    ],
    ctaTitle: 'Ready to Build Your Brand?',
    ctaDescription: 'Let\'s create a brand strategy that sets you apart from the competition and builds lasting customer loyalty.',
    emailSubject: 'Brand Strategy Consultation',
    emailBody: 'Hi Ellie,\n\nI\'m interested in learning more about your brand strategy services. Could we schedule a consultation to discuss my business needs?\n\nThank you!'
  },

  'lead-generation': {
    id: 'lead-generation',
    title: 'Lead Generation',
    subtitle: 'Lead Generation Service',
    description: 'Generate high-quality leads that convert into paying customers through strategic campaigns and optimization.',
    keywords: ['lead generation', 'lead magnets', 'landing pages', 'conversion optimization', 'sales funnel', 'qualified leads'],
    icon: 'TrendingUp',
    heroTitle: 'Generate More',
    heroSubtitle: 'Qualified Leads',
    heroDescription: 'Attract, capture, and nurture high-quality leads that convert into paying customers through strategic lead generation campaigns and optimization.',
    whatYouGet: [
      'Lead magnets & content offers',
      'Optimized landing pages',
      'Email capture systems',
      'Lead nurturing sequences',
      'Performance tracking'
    ],
    features: [
      {
        title: 'Lead Magnet Creation',
        description: 'Develop valuable content offers that attract and capture high-quality leads.',
        icon: 'Magnet'
      },
      {
        title: 'Landing Page Optimization',
        description: 'Create and optimize landing pages for maximum conversion rates.',
        icon: 'Target'
      },
      {
        title: 'Email Capture Strategies',
        description: 'Implement effective email capture forms and pop-ups that convert.',
        icon: 'Users'
      },
      {
        title: 'Lead Nurturing Sequences',
        description: 'Automated email sequences that guide leads toward purchase decisions.',
        icon: 'Zap'
      },
      {
        title: 'Conversion Rate Optimization',
        description: 'Continuously test and improve your lead generation processes.',
        icon: 'TrendingUp'
      },
      {
        title: 'Lead Scoring & Qualification',
        description: 'Identify and prioritize your most valuable prospects.',
        icon: 'Star'
      }
    ],
    process: [
      {
        step: '01',
        title: 'Audience Research',
        description: 'Identify your ideal customer profile and understand their pain points, interests, and buying behavior.',
        duration: '1 week'
      },
      {
        step: '02',
        title: 'Lead Magnet Development',
        description: 'Create compelling content offers that provide genuine value and encourage email sign-ups.',
        duration: '1-2 weeks'
      },
      {
        step: '03',
        title: 'Landing Page Creation',
        description: 'Build high-converting landing pages optimized for lead capture and user experience.',
        duration: '1-2 weeks'
      },
      {
        step: '04',
        title: 'Automation Setup',
        description: 'Implement lead nurturing sequences and automated follow-up systems to maximize conversions.',
        duration: '1 week'
      }
    ],
    results: [
      '250% increase in qualified leads',
      'Higher conversion rates',
      'Improved sales pipeline',
      'Better lead quality',
      'Automated lead nurturing',
      'Measurable ROI growth'
    ],
    faqs: [
      {
        question: 'What types of lead magnets work best?',
        answer: 'The best lead magnets provide immediate value and solve a specific problem for your audience. Popular options include ebooks, checklists, templates, webinars, and free trials. We\'ll determine what works best for your specific audience and industry.'
      },
      {
        question: 'How quickly will I see results?',
        answer: 'You can typically start capturing leads within the first week of implementation. However, optimization and improved conversion rates develop over 2-3 months as we test and refine the strategy.'
      },
      {
        question: 'Do you work with existing email lists?',
        answer: 'Absolutely! We can help optimize your current lead generation processes and create nurturing sequences for both new leads and existing subscribers.'
      },
      {
        question: 'What platforms do you use for lead generation?',
        answer: 'We work with popular platforms like Mailchimp, ConvertKit, HubSpot, and others. We\'ll recommend the best solution based on your needs and budget.'
      },
      {
        question: 'How do you ensure lead quality?',
        answer: 'We implement lead scoring and qualification processes to identify the most valuable prospects. This includes targeting strategies and progressive profiling to gather relevant information about leads.'
      }
    ],
    ctaTitle: 'Ready to Generate More Leads?',
    ctaDescription: 'Let\'s build a lead generation system that consistently delivers high-quality prospects for your business.',
    emailSubject: 'Lead Generation Consultation',
    emailBody: 'Hi Ellie,\n\nI\'m interested in learning more about your lead generation services. Could we schedule a consultation to discuss my business needs?\n\nThank you!'
  },

  'seo': {
    id: 'seo',
    title: 'SEO',
    subtitle: 'SEO Service',
    description: 'Improve your search engine rankings and organic visibility to drive more qualified traffic to your website.',
    keywords: ['SEO', 'search engine optimization', 'keyword research', 'on-page SEO', 'technical SEO', 'link building'],
    icon: 'Search',
    heroTitle: 'Rank Higher on',
    heroSubtitle: 'Google',
    heroDescription: 'Improve your search engine rankings and organic visibility to drive more qualified traffic to your website and generate more leads and sales.',
    whatYouGet: [
      'Comprehensive SEO audit',
      'Keyword research & strategy',
      'On-page optimization',
      'Technical SEO fixes',
      'Monthly progress reports'
    ],
    features: [
      {
        title: 'Keyword Research & Strategy',
        description: 'Comprehensive keyword analysis to target the terms your customers are searching for.',
        icon: 'Search'
      },
      {
        title: 'On-Page Optimization',
        description: 'Optimize your website content, structure, and meta data for better search rankings.',
        icon: 'FileText'
      },
      {
        title: 'Technical SEO Audits',
        description: 'Identify and fix technical issues that prevent search engines from ranking your site.',
        icon: 'BarChart3'
      },
      {
        title: 'Content Optimization',
        description: 'Create and optimize content that ranks well and provides value to your audience.',
        icon: 'Target'
      },
      {
        title: 'Link Building Strategies',
        description: 'Build high-quality backlinks to increase your site\'s authority and rankings.',
        icon: 'Globe'
      },
      {
        title: 'Performance Monitoring',
        description: 'Track rankings, traffic, and conversions to measure SEO success and ROI.',
        icon: 'TrendingUp'
      }
    ],
    process: [
      {
        step: '01',
        title: 'SEO Audit & Analysis',
        description: 'Comprehensive analysis of your current SEO performance, technical issues, and opportunities.',
        duration: '1 week'
      },
      {
        step: '02',
        title: 'Strategy Development',
        description: 'Create a custom SEO strategy based on your goals, competition, and keyword opportunities.',
        duration: '1 week'
      },
      {
        step: '03',
        title: 'Implementation',
        description: 'Execute on-page optimizations, technical fixes, and content improvements.',
        duration: '2-4 weeks'
      },
      {
        step: '04',
        title: 'Monitoring & Optimization',
        description: 'Continuous monitoring, reporting, and optimization to improve rankings and traffic.',
        duration: 'Ongoing'
      }
    ],
    results: [
      '200% organic traffic growth',
      'First page search rankings',
      'Increased online visibility',
      'Higher quality website traffic',
      'Improved conversion rates',
      'Better user experience'
    ],
    faqs: [
      {
        question: 'How long does it take to see SEO results?',
        answer: 'SEO is a long-term strategy. You may see some improvements in 2-3 months, but significant results typically take 4-6 months. The timeline depends on competition, current site status, and the scope of optimization needed.'
      },
      {
        question: 'What\'s included in an SEO audit?',
        answer: 'Our comprehensive SEO audit includes technical analysis, keyword research, competitor analysis, content review, backlink profile assessment, and a detailed action plan with prioritized recommendations.'
      },
      {
        question: 'Do you guarantee first page rankings?',
        answer: 'While we can\'t guarantee specific rankings (no ethical SEO provider can), we focus on proven strategies that improve visibility, traffic, and conversions. We set realistic expectations based on your industry and competition.'
      },
      {
        question: 'How do you measure SEO success?',
        answer: 'We track multiple metrics including organic traffic growth, keyword rankings, click-through rates, conversion rates, and overall business impact. Monthly reports keep you informed of progress and results.'
      },
      {
        question: 'Do you work with local businesses?',
        answer: 'Absolutely! We provide both local SEO (for location-based businesses) and national SEO services. Local SEO includes Google My Business optimization, local citations, and location-specific strategies.'
      }
    ],
    ctaTitle: 'Ready to Improve Your Rankings?',
    ctaDescription: 'Let\'s optimize your website for search engines and drive more qualified organic traffic to your business.',
    emailSubject: 'SEO Consultation',
    emailBody: 'Hi Ellie,\n\nI\'m interested in learning more about your SEO services. Could we schedule a consultation to discuss my business needs?\n\nThank you!'
  },

  // Add other services here...
  'digital-campaigns': {
    id: 'digital-campaigns',
    title: 'Digital Campaigns',
    subtitle: 'Digital Campaigns Service',
    description: 'Create and execute data-driven digital marketing campaigns that deliver measurable results across all channels.',
    keywords: ['digital campaigns', 'digital marketing', 'multi-channel marketing', 'campaign management', 'marketing automation', 'performance marketing'],
    icon: 'Megaphone',
    heroTitle: 'Data-Driven',
    heroSubtitle: 'Digital Campaigns',
    heroDescription: 'Create and execute powerful digital marketing campaigns that deliver measurable results across all channels and drive sustainable business growth.',
    whatYouGet: [
      'Multi-channel campaign strategy',
      'Creative development & testing',
      'Advanced audience targeting',
      'Performance tracking & analytics',
      'Ongoing optimization'
    ],
    features: [
      {
        title: 'Multi-Channel Strategy',
        description: 'Coordinated campaigns across all digital channels for maximum impact and reach.',
        icon: 'Megaphone'
      },
      {
        title: 'Creative Development',
        description: 'Compelling ad creatives and content that capture attention and drive action.',
        icon: 'Target'
      },
      {
        title: 'Audience Targeting',
        description: 'Precision targeting to reach your ideal customers at the right moment.',
        icon: 'Users'
      },
      {
        title: 'Performance Tracking',
        description: 'Comprehensive analytics and reporting to measure campaign effectiveness.',
        icon: 'BarChart3'
      },
      {
        title: 'Campaign Optimization',
        description: 'Continuous testing and refinement to improve results and ROI.',
        icon: 'TrendingUp'
      },
      {
        title: 'A/B Testing',
        description: 'Data-driven testing to identify the most effective campaign elements.',
        icon: 'Zap'
      }
    ],
    process: [
      {
        step: '01',
        title: 'Strategy & Planning',
        description: 'Develop comprehensive campaign strategy based on your goals, audience, and market analysis.',
        duration: '1 week'
      },
      {
        step: '02',
        title: 'Creative Development',
        description: 'Create compelling ad creatives, copy, and campaign assets that resonate with your audience.',
        duration: '1-2 weeks'
      },
      {
        step: '03',
        title: 'Campaign Launch',
        description: 'Set up and launch campaigns across selected channels with proper tracking and monitoring.',
        duration: '1 week'
      },
      {
        step: '04',
        title: 'Optimization & Scaling',
        description: 'Monitor performance, optimize campaigns, and scale successful elements for maximum ROI.',
        duration: 'Ongoing'
      }
    ],
    results: [
      '400% campaign ROI increase',
      'Better audience engagement',
      'Measurable growth metrics',
      'Improved brand awareness',
      'Higher conversion rates',
      'Reduced acquisition costs'
    ],
    faqs: [
      {
        question: 'Which digital channels do you use for campaigns?',
        answer: 'We work across all major digital channels including Google Ads, Facebook/Instagram, LinkedIn, YouTube, email marketing, and display advertising. The channel mix depends on your audience and goals.'
      },
      {
        question: 'How do you measure campaign success?',
        answer: 'We track key metrics like ROAS, conversion rates, cost per acquisition, click-through rates, and engagement metrics. All campaigns include comprehensive reporting and analytics.'
      },
      {
        question: 'What\'s the minimum budget for digital campaigns?',
        answer: 'Campaign budgets vary based on goals and channels. We work with businesses of all sizes and can create effective strategies for various budget levels. Let\'s discuss what works for your situation.'
      },
      {
        question: 'How quickly can I expect to see results?',
        answer: 'Some metrics like traffic and impressions are immediate, while conversion optimization typically takes 2-4 weeks. We provide regular updates and optimize continuously for best performance.'
      },
      {
        question: 'Do you handle campaign management ongoing?',
        answer: 'Yes, we offer full campaign management including daily monitoring, optimization, reporting, and strategic adjustments to ensure consistent performance and growth.'
      }
    ],
    ctaTitle: 'Ready to Launch Your Campaign?',
    ctaDescription: 'Let\'s create digital campaigns that drive real results and accelerate your business growth across all channels.',
    emailSubject: 'Digital Campaigns Consultation',
    emailBody: 'Hi Ellie,\n\nI\'m interested in learning more about your digital campaigns services. Could we schedule a consultation to discuss my business needs?\n\nThank you!'
  },

  'ppc': {
    id: 'ppc',
    title: 'PPC Advertising',
    subtitle: 'PPC Advertising Service',
    description: 'Maximize your advertising ROI with expertly managed pay-per-click campaigns across Google, Facebook, and more.',
    keywords: ['PPC advertising', 'Google Ads', 'Facebook Ads', 'pay-per-click', 'paid advertising', 'ad management'],
    icon: 'MousePointer',
    heroTitle: 'Maximize Your',
    heroSubtitle: 'Ad ROI',
    heroDescription: 'Get immediate results with expertly managed pay-per-click campaigns across Google, Facebook, and other platforms that drive qualified traffic and conversions.',
    whatYouGet: [
      'Google & Facebook Ads setup',
      'Ad copy & creative development',
      'Bid strategy optimization',
      'Landing page recommendations',
      'Detailed performance reports'
    ],
    features: [
      {
        title: 'Google Ads Management',
        description: 'Expert management of Google Search, Display, and Shopping campaigns for maximum ROI.',
        icon: 'MousePointer'
      },
      {
        title: 'Facebook & Instagram Ads',
        description: 'Strategic social media advertising that reaches your ideal customers where they spend time.',
        icon: 'Target'
      },
      {
        title: 'Ad Copy & Creative Development',
        description: 'Compelling ad creatives and copy that capture attention and drive conversions.',
        icon: 'Zap'
      },
      {
        title: 'Bid Strategy Optimization',
        description: 'Advanced bidding strategies to maximize your ad spend efficiency and results.',
        icon: 'DollarSign'
      },
      {
        title: 'Landing Page Optimization',
        description: 'Optimize landing pages to improve ad relevance and conversion rates.',
        icon: 'TrendingUp'
      },
      {
        title: 'Performance Tracking',
        description: 'Detailed reporting and analysis to measure campaign performance and ROI.',
        icon: 'BarChart3'
      }
    ],
    process: [
      {
        step: '01',
        title: 'Account Setup & Strategy',
        description: 'Set up your advertising accounts and develop a comprehensive PPC strategy.',
        duration: '1 week'
      },
      {
        step: '02',
        title: 'Campaign Creation',
        description: 'Create optimized campaigns with targeted ad groups, keywords, and compelling ad copy.',
        duration: '1 week'
      },
      {
        step: '03',
        title: 'Launch & Monitor',
        description: 'Launch campaigns and closely monitor performance for immediate optimizations.',
        duration: '1 week'
      },
      {
        step: '04',
        title: 'Optimize & Scale',
        description: 'Continuously optimize and scale successful campaigns for maximum ROI.',
        duration: 'Ongoing'
      }
    ],
    results: [
      '300% ad spend efficiency',
      'Lower cost per acquisition',
      'Higher quality scores',
      'Improved conversion rates',
      'Better targeting precision',
      'Increased ROAS'
    ],
    faqs: [
      {
        question: 'What platforms do you manage PPC campaigns on?',
        answer: 'We manage campaigns across Google Ads, Facebook/Instagram, LinkedIn, YouTube, and other major advertising platforms. The platform mix depends on your audience and goals.'
      },
      {
        question: 'How quickly can I see results from PPC?',
        answer: 'PPC campaigns can start driving traffic immediately after launch. However, optimization for best performance typically takes 2-4 weeks as we gather data and refine targeting.'
      },
      {
        question: 'What\'s the minimum ad spend budget?',
        answer: 'We work with various budget levels. The minimum effective budget depends on your industry and competition, but we can create strategies for most budget ranges. Let\'s discuss what works for you.'
      },
      {
        question: 'How do you optimize campaigns?',
        answer: 'We continuously test ad copy, adjust bids, refine targeting, optimize landing pages, and analyze performance data to improve click-through rates, conversion rates, and overall ROI.'
      },
      {
        question: 'Do you provide transparent reporting?',
        answer: 'Yes, you\'ll receive detailed monthly reports showing all key metrics including impressions, clicks, conversions, cost per click, and return on ad spend. You\'ll also have access to the advertising accounts.'
      }
    ],
    ctaTitle: 'Ready to Launch Your PPC Campaigns?',
    ctaDescription: 'Let\'s create high-performing PPC campaigns that deliver immediate results and maximize your advertising investment.',
    emailSubject: 'PPC Advertising Consultation',
    emailBody: 'Hi Ellie,\n\nI\'m interested in learning more about your PPC advertising services. Could we schedule a consultation to discuss my business needs?\n\nThank you!'
  },

  'content-marketing': {
    id: 'content-marketing',
    title: 'Content Marketing',
    subtitle: 'Content Marketing Service',
    description: 'Engage your audience with valuable, relevant content that builds trust and drives conversions.',
    keywords: ['content marketing', 'blog writing', 'content strategy', 'copywriting', 'social content', 'content creation'],
    icon: 'PenTool',
    heroTitle: 'Engage Your Audience with',
    heroSubtitle: 'Valuable Content',
    heroDescription: 'Build trust, establish authority, and drive conversions with strategic content that educates, engages, and converts your ideal customers.',
    whatYouGet: [
      'Content strategy development',
      'Blog writing & optimization',
      'Social media content',
      'Email newsletter creation',
      'Content calendar management'
    ],
    features: [
      {
        title: 'Content Strategy Development',
        description: 'Create a comprehensive content strategy aligned with your business goals and audience needs.',
        icon: 'Target'
      },
      {
        title: 'Blog Writing & SEO',
        description: 'High-quality blog posts optimized for search engines and designed to engage readers.',
        icon: 'PenTool'
      },
      {
        title: 'Social Media Content',
        description: 'Engaging social media content that builds community and drives engagement.',
        icon: 'Share2'
      },
      {
        title: 'Email Newsletters',
        description: 'Compelling email content that nurtures leads and maintains customer relationships.',
        icon: 'Mail'
      },
      {
        title: 'Content Calendar Management',
        description: 'Organized content planning and scheduling for consistent publishing.',
        icon: 'Calendar'
      },
      {
        title: 'Performance Analytics',
        description: 'Track content performance and optimize based on engagement and conversion data.',
        icon: 'BarChart3'
      }
    ],
    process: [
      {
        step: '01',
        title: 'Content Audit & Strategy',
        description: 'Analyze existing content and develop a comprehensive content strategy based on your goals.',
        duration: '1 week'
      },
      {
        step: '02',
        title: 'Content Calendar Creation',
        description: 'Plan and schedule content across all channels with organized editorial calendar.',
        duration: '1 week'
      },
      {
        step: '03',
        title: 'Content Creation',
        description: 'Produce high-quality, engaging content optimized for your audience and search engines.',
        duration: 'Ongoing'
      },
      {
        step: '04',
        title: 'Performance Optimization',
        description: 'Monitor performance and optimize content strategy based on engagement and conversion data.',
        duration: 'Ongoing'
      }
    ],
    results: [
      '500% content engagement increase',
      'Thought leadership positioning',
      'Improved audience growth',
      'Higher search rankings',
      'Increased lead generation',
      'Better customer retention'
    ],
    faqs: [
      {
        question: 'What types of content do you create?',
        answer: 'We create blog posts, social media content, email newsletters, ebooks, whitepapers, case studies, infographics, and video scripts. The content mix depends on your audience preferences and goals.'
      },
      {
        question: 'How often should content be published?',
        answer: 'Publishing frequency depends on your resources and goals. We typically recommend 1-2 blog posts per week and daily social media content for optimal engagement and SEO benefits.'
      },
      {
        question: 'Do you handle content distribution?',
        answer: 'Yes, we can manage content distribution across your blog, social media channels, email newsletters, and other platforms to maximize reach and engagement.'
      },
      {
        question: 'How do you ensure content aligns with my brand?',
        answer: 'We start with a thorough brand analysis and develop content guidelines that reflect your brand voice, tone, and values. All content is reviewed to ensure brand consistency.'
      },
      {
        question: 'Can you repurpose existing content?',
        answer: 'Absolutely! We can audit your existing content and repurpose high-performing pieces into different formats to extend their reach and value across multiple channels.'
      }
    ],
    ctaTitle: 'Ready to Create Engaging Content?',
    ctaDescription: 'Let\'s develop a content strategy that builds trust, engages your audience, and drives meaningful business results.',
    emailSubject: 'Content Marketing Consultation',
    emailBody: 'Hi Ellie,\n\nI\'m interested in learning more about your content marketing services. Could we schedule a consultation to discuss my business needs?\n\nThank you!'
  },

  'website-design': {
    id: 'website-design',
    title: 'Website Design',
    subtitle: 'Website Design Service',
    description: 'Create stunning, conversion-focused websites that provide exceptional user experiences and drive results.',
    keywords: ['website design', 'web development', 'responsive design', 'UX/UI design', 'landing pages', 'website optimization'],
    icon: 'Globe',
    heroTitle: 'Beautiful Websites That',
    heroSubtitle: 'Convert',
    heroDescription: 'Create stunning, conversion-focused websites that provide exceptional user experiences and turn visitors into customers.',
    whatYouGet: [
      'Responsive web design',
      'UX/UI optimization',
      'Conversion optimization',
      'Speed and performance',
      'SEO-friendly development'
    ],
    features: [
      {
        title: 'Responsive Design',
        description: 'Mobile-first design that looks and works perfectly on all devices and screen sizes.',
        icon: 'Smartphone'
      },
      {
        title: 'UX/UI Optimization',
        description: 'User experience design focused on intuitive navigation and conversion optimization.',
        icon: 'Users'
      },
      {
        title: 'Performance Optimization',
        description: 'Fast-loading websites optimized for speed, performance, and search engine rankings.',
        icon: 'Zap'
      },
      {
        title: 'Conversion Focused',
        description: 'Strategic design elements and calls-to-action that guide visitors toward conversion.',
        icon: 'Target'
      },
      {
        title: 'SEO-Friendly Development',
        description: 'Built with search engine optimization best practices for better organic visibility.',
        icon: 'Search'
      },
      {
        title: 'Content Management',
        description: 'Easy-to-use content management systems for simple updates and maintenance.',
        icon: 'Edit3'
      }
    ],
    process: [
      {
        step: '01',
        title: 'Discovery & Planning',
        description: 'Understand your goals, audience, and requirements to create a comprehensive project plan.',
        duration: '1 week'
      },
      {
        step: '02',
        title: 'Design & Prototyping',
        description: 'Create wireframes and design mockups to visualize the final website structure and aesthetics.',
        duration: '2-3 weeks'
      },
      {
        step: '03',
        title: 'Development & Testing',
        description: 'Build the website with responsive design, optimization, and thorough testing across devices.',
        duration: '2-4 weeks'
      },
      {
        step: '04',
        title: 'Launch & Support',
        description: 'Launch your website and provide ongoing support, training, and maintenance.',
        duration: '1 week + ongoing'
      }
    ],
    results: [
      '250% conversion rate increase',
      'Improved user experience',
      'Mobile optimization',
      'Faster loading speeds',
      'Better search rankings',
      'Professional brand image'
    ],
    faqs: [
      {
        question: 'How long does website design take?',
        answer: 'Website design typically takes 4-8 weeks depending on complexity and scope. Simple websites may be completed faster, while complex e-commerce or custom functionality takes longer.'
      },
      {
        question: 'Will my website be mobile-friendly?',
        answer: 'Yes, all websites are designed with a mobile-first approach and are fully responsive, ensuring they look and function perfectly on all devices and screen sizes.'
      },
      {
        question: 'Can I update the website myself?',
        answer: 'Absolutely! We build websites with user-friendly content management systems and provide training so you can easily update content, add pages, and manage your site.'
      },
      {
        question: 'Do you provide website hosting?',
        answer: 'We can recommend reliable hosting providers and help with setup, or work with your existing hosting provider. We focus on design and development rather than hosting services.'
      },
      {
        question: 'What about ongoing maintenance?',
        answer: 'We offer ongoing maintenance packages including security updates, backups, performance monitoring, and content updates. This ensures your website stays secure and current.'
      }
    ],
    ctaTitle: 'Ready for a New Website?',
    ctaDescription: 'Let\'s create a website that showcases your brand beautifully and converts visitors into customers.',
    emailSubject: 'Website Design Consultation',
    emailBody: 'Hi Ellie,\n\nI\'m interested in learning more about your website design services. Could we schedule a consultation to discuss my business needs?\n\nThank you!'
  },

  'social-media': {
    id: 'social-media',
    title: 'Social Media Management',
    subtitle: 'Social Media Management Service',
    description: 'Build and engage your community across social platforms with strategic content and community management.',
    keywords: ['social media management', 'social media marketing', 'community management', 'social content', 'social media strategy', 'engagement'],
    icon: 'Share2',
    heroTitle: 'Build Your',
    heroSubtitle: 'Community',
    heroDescription: 'Grow and engage your audience across social platforms with strategic content and community management that builds lasting relationships.',
    whatYouGet: [
      'Social media strategy',
      'Content creation & scheduling',
      'Community management',
      'Influencer partnerships',
      'Social media advertising'
    ],
    features: [
      {
        title: 'Social Media Strategy',
        description: 'Comprehensive strategy tailored to your brand and audience across all relevant platforms.',
        icon: 'Target'
      },
      {
        title: 'Content Creation',
        description: 'Engaging posts, graphics, and videos designed to build community and drive engagement.',
        icon: 'Camera'
      },
      {
        title: 'Community Management',
        description: 'Active engagement with your audience through comments, messages, and community building.',
        icon: 'Users'
      },
      {
        title: 'Social Advertising',
        description: 'Targeted social media advertising campaigns to expand reach and drive conversions.',
        icon: 'Target'
      },
      {
        title: 'Influencer Partnerships',
        description: 'Strategic partnerships with influencers to expand your reach and credibility.',
        icon: 'UserPlus'
      },
      {
        title: 'Analytics & Reporting',
        description: 'Detailed performance tracking and reporting to measure engagement and ROI.',
        icon: 'BarChart3'
      }
    ],
    process: [
      {
        step: '01',
        title: 'Strategy Development',
        description: 'Analyze your audience and competitors to develop a comprehensive social media strategy.',
        duration: '1 week'
      },
      {
        step: '02',
        title: 'Content Planning',
        description: 'Create content calendars and develop engaging posts aligned with your brand and goals.',
        duration: '1 week'
      },
      {
        step: '03',
        title: 'Community Building',
        description: 'Implement posting schedule and engage actively with your community across platforms.',
        duration: 'Ongoing'
      },
      {
        step: '04',
        title: 'Growth & Optimization',
        description: 'Monitor performance, optimize content, and scale successful strategies for maximum growth.',
        duration: 'Ongoing'
      }
    ],
    results: [
      '400% follower growth',
      'Higher engagement rates',
      'Brand community building',
      'Increased website traffic',
      'Improved brand awareness',
      'Better customer relationships'
    ],
    faqs: [
      {
        question: 'Which social media platforms do you manage?',
        answer: 'We manage all major platforms including Facebook, Instagram, LinkedIn, Twitter, TikTok, and YouTube. Platform selection depends on where your target audience is most active.'
      },
      {
        question: 'How often do you post content?',
        answer: 'Posting frequency varies by platform and strategy. Typically, we recommend daily posting for most platforms, with multiple posts per day for highly active platforms like Twitter.'
      },
      {
        question: 'Do you respond to comments and messages?',
        answer: 'Yes, community management includes responding to comments, messages, and engaging with your audience to build relationships and maintain a positive brand presence.'
      },
      {
        question: 'Can you help with social media advertising?',
        answer: 'Absolutely! We create and manage social media advertising campaigns to expand your reach, target specific audiences, and drive conversions beyond organic content.'
      },
      {
        question: 'How do you measure social media success?',
        answer: 'We track engagement rates, follower growth, reach, website traffic from social media, and conversions. Monthly reports show progress and ROI from social media efforts.'
      }
    ],
    ctaTitle: 'Ready to Grow Your Social Presence?',
    ctaDescription: 'Let\'s build an engaged community around your brand that drives real business results through social media.',
    emailSubject: 'Social Media Management Consultation',
    emailBody: 'Hi Ellie,\n\nI\'m interested in learning more about your social media management services. Could we schedule a consultation to discuss my business needs?\n\nThank you!'
  }
};
