/* eslint-disable @typescript-eslint/no-explicit-any */
import { defineConfig } from "tinacms";
import AiSuggestHeroDescription from "./fields/AiSuggestHeroDescription";
import AiSuggestApproachBody from "./fields/AiSuggestApproachBody";
import ImageFocusControl from "./fields/ImageFocusControl";
import ColorWithHistory from "./fields/ColorWithHistory";
import SerpPreview from "./fields/SerpPreview";
import CaseStudyMultiSelect from "./fields/CaseStudyMultiSelect";
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const ColorWithHistoryField = ColorWithHistory as any;

// Reusable SEO fields with helpful descriptions
const seoFields = [
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  { type: "string", name: "_serp", label: "", ui: { component: SerpPreview as any } },
  { 
    type: "string", 
    name: "metaTitle", 
    label: "Meta Title",
    description: "The page title that appears in search results and browser tabs. Keep under 60 characters for best results."
  },
  { 
    type: "string", 
    name: "metaDescription", 
    label: "Meta Description", 
    ui: { component: "textarea" },
    description: "Description shown in search results under the title. Should be compelling and 150-160 characters to avoid truncation."
  },
  { 
    type: "string", 
    name: "canonicalUrl", 
    label: "Canonical URL",
    description: "The preferred URL for this page content. Helps prevent duplicate content issues. Usually the main URL of this page."
  },
  { 
    type: "boolean", 
    name: "noIndex", 
    label: "No Index",
    description: "Prevents search engines from indexing this page. Turn ON to hide from search results (e.g., for private/draft content)."
  },
  { 
    type: "string", 
    name: "keywords", 
    label: "Keywords", 
    list: true,
    description: "Main keywords this page should rank for. Include your primary target keyword plus 2-5 related terms."
  },
  { 
    type: "string", 
    name: "winningKeywords", 
    label: "Winning Keywords (from Search)", 
    list: true,
    description: "Keywords identified as easy wins from SERP analysis. Auto-populated when you save analysis results from Streamlit."
  },
  {
    type: "object",
    name: "serpAnalysisHistory",
    label: "SERP Analysis History",
    description: "Historical SERP analysis reports generated from the Streamlit SEO tool. Track keyword difficulty and opportunities over time.",
    list: true,
    ui: {
      itemProps: (item: any) => {
        return { 
          label: `${item?.reportName || "Unnamed Report"} - ${item?.analysisDate?.slice(0, 10) || "No Date"}`
        };
      }
    },
    fields: [
      { 
        type: "string", 
        name: "reportId", 
        label: "Report ID",
        description: "Unique identifier for this SERP analysis report. Auto-generated when saved from Streamlit."
      },
      { 
        type: "datetime", 
        name: "analysisDate", 
        label: "Analysis Date",
        description: "When this SERP analysis was performed. Shows the exact date/time the report was generated."
      },
      { 
        type: "string", 
        name: "reportName", 
        label: "Report Name",
        description: "Custom name for this analysis report (e.g., 'Q4 2025 Brand Strategy Analysis'). Helps identify different analysis runs."
      },
      { 
        type: "number", 
        name: "avgDifficulty", 
        label: "Average Difficulty",
        description: "Average SEO difficulty score across all analyzed keywords (0-100). Lower scores = easier to rank. 0-49: Easy, 50-69: Moderate, 70+: Hard."
      },
      { 
        type: "number", 
        name: "easyCount", 
        label: "Easy Keywords Count (<50)",
        description: "Number of keywords with low competition (difficulty score under 50). These are your quickest wins for ranking."
      },
      { 
        type: "string", 
        name: "easyKeywords", 
        label: "Easy Keywords (<50)", 
        list: true,
        description: "List of low-competition keywords you can target for quick SEO wins. Prioritize these in your content strategy."
      },
      { 
        type: "number", 
        name: "moderateCount", 
        label: "Moderate Keywords Count (50-69)",
        description: "Number of keywords with medium competition (difficulty 50-69). Good targets once you've captured the easy wins."
      },
      { 
        type: "string", 
        name: "moderateKeywords", 
        label: "Moderate Keywords (50-69)", 
        list: true,
        description: "Medium-competition keywords that require more effort but are still achievable. Target these after easy keywords."
      },
      { 
        type: "number", 
        name: "hardCount", 
        label: "Hard Keywords Count (70+)",
        description: "Number of highly competitive keywords (difficulty 70+). These require significant SEO investment and time."
      },
      { 
        type: "string", 
        name: "hardKeywords", 
        label: "Hard Keywords (70+)", 
        list: true,
        description: "High-competition keywords that are difficult to rank for. Consider long-tail variations or build authority with easier keywords first."
      },
      { 
        type: "string", 
        name: "topOpportunities", 
        label: "Top Opportunities", 
        list: true,
        description: "Best keyword opportunities ranked by difficulty and potential. Start your SEO efforts with these keywords."
      },
      { 
        type: "string", 
        name: "analysisNotes", 
        label: "Analysis Notes", 
        list: true,
        description: "Key insights and observations from the SERP analysis. Includes competitive landscape notes and strategic recommendations."
      },
      { 
        type: "string", 
        name: "nextSteps", 
        label: "Suggested Next Steps", 
        list: true,
        description: "Actionable recommendations based on the analysis results. Follow these steps to improve your SEO performance."
      },
      // Extended data: organic results, PAA, Related, raw serper payloads, and config
      {
        type: "object",
        name: "organicByKeyword",
        label: "Organic Results By Keyword",
        list: true,
        ui: {
          itemProps: (item: any) => ({ label: item?.keyword ? `Organic: ${item.keyword}` : 'Organic' }),
          description: "Top organic results captured for each keyword at analysis time."
        },
        fields: [
          { type: "string", name: "keyword", label: "Keyword" },
          {
            type: "object",
            name: "results",
            label: "Results",
            list: true,
            ui: {
              itemProps: (item: any) => {
                const host = item?.link ? String(item.link).replace(/^https?:\/\//, '').split('/')[0] : '';
                const rank = item?.rank ? `#${item.rank} ` : '';
                const title = item?.title || '';
                return { label: `${rank}${host}${host ? ' — ' : ''}${title}`.trim() };
              }
            },
            fields: [
              { type: "number", name: "rank", label: "Rank" },
              { type: "string", name: "title", label: "Title" },
              { type: "string", name: "link", label: "URL" },
              { type: "string", name: "snippet", label: "Snippet", ui: { component: "textarea" } },
            ],
          },
          {
            type: "object",
            name: "organicSummaryByKeyword",
            label: "Ranked Organic (1 per line)",
            description: "Quick scan of top organic results per keyword (ranked).",
            list: true,
            ui: {
              itemProps: (item: any) => ({ label: item?.keyword ? `Summary: ${item.keyword}` : 'Summary' })
            },
            fields: [
              { type: "string", name: "keyword", label: "Keyword" },
              { type: "string", name: "lines", label: "Ranked lines (#N domain — title)", list: true },
            ],
          },
        ],
      },
      {
        type: "object",
        name: "paaByKeywordList",
        label: "PAA Questions By Keyword",
        list: true,
        ui: {
          itemProps: (item: any) => ({ label: item?.keyword ? `PAA: ${item.keyword}` : 'PAA' })
        },
        fields: [
          { type: "string", name: "keyword", label: "Keyword" },
          { type: "string", name: "source", label: "Source" },
          { type: "string", name: "questions", label: "Questions", list: true },
        ],
      },
      {
        type: "object",
        name: "relatedByKeywordList",
        label: "Related Searches By Keyword",
        list: true,
        ui: {
          itemProps: (item: any) => ({ label: item?.keyword ? `Related: ${item.keyword}` : 'Related' })
        },
        fields: [
          { type: "string", name: "keyword", label: "Keyword" },
          { type: "string", name: "source", label: "Source" },
          { type: "string", name: "queries", label: "Queries", list: true },
        ],
      },
      {
        type: "object",
        name: "rawSerperByKeyword",
        label: "Raw serper.dev JSON By Keyword",
        list: true,
        ui: {
          itemProps: (item: any) => ({ label: item?.keyword ? `Raw: ${item.keyword}` : 'Raw JSON' })
        },
        fields: [
          { type: "string", name: "keyword", label: "Keyword" },
          { type: "string", name: "payload", label: "JSON (string)", ui: { component: "textarea" } },
        ],
      },
      {
        type: "object",
        name: "serperConfig",
        label: "Serper Config",
        fields: [
          { type: "string", name: "location", label: "Location" },
          { type: "boolean", name: "noCache", label: "No Cache" },
          { type: "number", name: "resultsPerQuery", label: "Results Per Query" },
        ],
      },
    ],
  },
  { 
    type: "string", 
    name: "currentReport", 
    label: "Current Active Report ID",
    description: "ID of the currently selected SERP analysis report. Used to track which report is being viewed in TinaCMS."
  },
  {
    type: "object",
    name: "targetKeywords",
    label: "Target Keywords (Page Specific)",
    description: "Keywords specifically targeted for this page. Separate from general keywords - these are strategic targets for this content.",
    fields: [
      { 
        type: "string", 
        name: "primary", 
        label: "Primary Keywords", 
        list: true,
        description: "Main keywords this page should rank for. Usually 1-3 highly relevant terms."
      },
      { 
        type: "string", 
        name: "secondary", 
        label: "Secondary Keywords", 
        list: true,
        description: "Supporting keywords that complement the primary terms. Help capture more search traffic."
      },
    ],
  },
  {
    type: "object",
    name: "openGraph",
    label: "Open Graph (Social Sharing)",
    description: "How this page appears when shared on social media platforms like Facebook, LinkedIn, etc.",
    fields: [
      { 
        type: "string", 
        name: "ogTitle", 
        label: "Social Title",
        description: "Title shown when shared on social media. Can be different from meta title to optimize for social platforms."
      },
      { 
        type: "string", 
        name: "ogDescription", 
        label: "Social Description", 
        ui: { component: "textarea" },
        description: "Description shown in social media shares. Make it engaging to encourage clicks from social platforms."
      },
      { 
        type: "image", 
        name: "ogImage", 
        label: "Social Image",
        description: "Image displayed when page is shared on social media. Ideal size: 1200x630px. Should be eye-catching and relevant."
      },
    ],
  },
] as any;

const branch =
  process.env.GITHUB_BRANCH ||
  process.env.VERCEL_GIT_COMMIT_REF ||
  process.env.HEAD ||
  "main";

export default defineConfig({
  branch,
  clientId: process.env.NEXT_PUBLIC_TINA_CLIENT_ID,
  token: process.env.TINA_TOKEN,
  build: { outputFolder: "admin", publicFolder: "public" },
  media: { tina: { mediaRoot: "", publicFolder: "public" } },
  schema: {
    collections: [
      {
        name: "mainPages",
        label: "Main Pages",
        path: "content",
        format: "md",
        match: { include: "{home,about,services,blog,case-studies,contact,faq}" },
        templates: [
          {
            name: "landing",
            label: "Generic Landing (all-in-one)",
            fields: [
              {
                type: "object",
                name: "seo",
                label: "SEO",
                fields: seoFields,
              },
              { type: "string", name: "heroTitle", label: "Hero Title (H1)" },
              { type: "string", name: "heroSubtitle", label: "Hero Subtitle" },
              { type: "string", name: "heroDescription", label: "Hero Description", ui: { component: "textarea" } },
              {
                type: "string",
                name: "heroHighlights",
                label: "Hero Highlights (pills under hero)",
                list: true,
                description: "Optional short highlights shown under the hero (e.g., Weekly Updates, Real Case Studies).",
              },
              {
                type: "object",
                name: "heroCtas",
                label: "Hero CTAs",
                fields: [
                  { type: "string", name: "primaryLabel", label: "Primary Label" },
                  { type: "string", name: "primaryHref", label: "Primary Href" },
                  { type: "string", name: "secondaryLabel", label: "Secondary Label" },
                  { type: "string", name: "secondaryHref", label: "Secondary Href" },
                ],
              },
              {
                type: "object",
                name: "secondaryLink",
                label: "Secondary Link (next to primary CTA)",
                fields: [
                  { type: "string", name: "label", label: "Label" },
                  { type: "string", name: "href", label: "Href" },
                ],
              },
              {
                type: "object",
                name: "pageCta",
                label: "Bottom CTA Section",
                fields: [
                  { type: "string", name: "title", label: "CTA Title" },
                  { type: "string", name: "description", label: "CTA Description", ui: { component: "textarea" } },
                  { type: "string", name: "buttonLabel", label: "Button Label" },
                  { type: "string", name: "buttonHref", label: "Button Href" },
                ],
              },
              {
                type: "object",
                name: "faqs",
                label: "Frequently Asked Questions",
                list: true,
                fields: [
                  { type: "string", name: "question", label: "Question" },
                  { type: "string", name: "answer", label: "Answer", ui: { component: "textarea" } },
                ],
              },
              {
                type: "string",
                name: "blogCategories",
                label: "Blog Categories (grid)",
                list: true,
                description: "Optional categories to display on the Blog page.",
              },
              {
                type: "object",
                name: "contactMethods",
                label: "Contact Methods (Contact Page)",
                list: true,
                fields: [
                  { type: "string", name: "icon", label: "Icon (name)" },
                  { type: "string", name: "title", label: "Title" },
                  { type: "string", name: "subtitle", label: "Subtitle" },
                  { type: "string", name: "value", label: "Value (email/text)" },
                  { type: "string", name: "href", label: "Href" },
                ],
              },
              {
                type: "string",
                name: "expectations",
                label: "What to Expect (Contact Page)",
                list: true,
              },
              {
                type: "object",
                name: "faqTiles",
                label: "FAQ Link Tiles",
                list: true,
                fields: [
                  { type: "string", name: "title", label: "Title" },
                  { type: "string", name: "description", label: "Description" },
                  { type: "string", name: "href", label: "Href" },
                ],
              },
            ],
          },
          {
            name: "contact",
            label: "Contact",
            fields: [
              {
                type: "object",
                name: "seo",
                label: "SEO",
                fields: seoFields,
              },
              { type: "string", name: "heroTitle", label: "Hero Title (H1)" },
              { type: "string", name: "heroSubtitle", label: "Hero Subtitle" },
              { type: "string", name: "heroDescription", label: "Hero Description", ui: { component: "textarea" } },
              {
                type: "object",
                name: "heroCtas",
                label: "Hero CTAs",
                fields: [
                  { type: "string", name: "primaryLabel", label: "Primary Label" },
                  { type: "string", name: "primaryHref", label: "Primary Href" },
                  { type: "string", name: "secondaryLabel", label: "Secondary Label" },
                  { type: "string", name: "secondaryHref", label: "Secondary Href" },
                ],
              },
              {
                type: "object",
                name: "contactMethods",
                label: "Contact Methods",
                list: true,
                fields: [
                  { type: "string", name: "icon", label: "Icon (name)" },
                  { type: "string", name: "title", label: "Title" },
                  { type: "string", name: "subtitle", label: "Subtitle" },
                  { type: "string", name: "value", label: "Value (email/text)" },
                  { type: "string", name: "href", label: "Href" },
                ],
              },
              { type: "string", name: "expectations", label: "What to Expect", list: true },
              {
                type: "object",
                name: "pageCta",
                label: "Bottom CTA Section",
                fields: [
                  { type: "string", name: "title", label: "CTA Title" },
                  { type: "string", name: "description", label: "CTA Description", ui: { component: "textarea" } },
                  { type: "string", name: "buttonLabel", label: "Button Label" },
                  { type: "string", name: "buttonHref", label: "Button Href" },
                ],
              },
            ],
          },
          {
            name: "faq",
            label: "FAQ",
            fields: [
              {
                type: "object",
                name: "seo",
                label: "SEO",
                fields: seoFields,
              },
              { type: "string", name: "heroTitle", label: "Hero Title (H1)" },
              { type: "string", name: "heroDescription", label: "Hero Description", ui: { component: "textarea" } },
              {
                type: "object",
                name: "faqs",
                label: "Frequently Asked Questions",
                list: true,
                fields: [
                  { type: "string", name: "question", label: "Question" },
                  { type: "string", name: "answer", label: "Answer", ui: { component: "textarea" } },
                ],
              },
              {
                type: "object",
                name: "pageCta",
                label: "Bottom CTA Section",
                fields: [
                  { type: "string", name: "title", label: "CTA Title" },
                  { type: "string", name: "description", label: "CTA Description", ui: { component: "textarea" } },
                  { type: "string", name: "buttonLabel", label: "Button Label" },
                  { type: "string", name: "buttonHref", label: "Button Href" },
                ],
              },
            ],
          },
          {
            name: "blogIndex",
            label: "Blog Index",
            fields: [
              {
                type: "object",
                name: "seo",
                label: "SEO",
                fields: seoFields,
              },
              { type: "string", name: "heroTitle", label: "Hero Title (H1)" },
              { type: "string", name: "heroSubtitle", label: "Hero Subtitle" },
              { type: "string", name: "heroDescription", label: "Hero Description", ui: { component: "textarea" } },
              { type: "string", name: "heroHighlights", label: "Hero Highlights", list: true },
              { type: "string", name: "blogCategories", label: "Blog Categories", list: true },
              {
                type: "object",
                name: "pageCta",
                label: "Bottom CTA Section",
                fields: [
                  { type: "string", name: "title", label: "CTA Title" },
                  { type: "string", name: "description", label: "CTA Description", ui: { component: "textarea" } },
                  { type: "string", name: "buttonLabel", label: "Button Label" },
                  { type: "string", name: "buttonHref", label: "Button Href" },
                ],
              },
            ],
          },
          {
            name: "caseStudiesIndex",
            label: "Case Studies Index",
            fields: [
              {
                type: "object",
                name: "seo",
                label: "SEO",
                fields: seoFields,
              },
              { type: "string", name: "heroTitle", label: "Hero Title (H1)" },
              { type: "string", name: "heroDescription", label: "Hero Description", ui: { component: "textarea" } },
              {
                type: "object",
                name: "pageCta",
                label: "Bottom CTA Section",
                fields: [
                  { type: "string", name: "title", label: "CTA Title" },
                  { type: "string", name: "description", label: "CTA Description", ui: { component: "textarea" } },
                  { type: "string", name: "buttonLabel", label: "Button Label" },
                  { type: "string", name: "buttonHref", label: "Button Href" },
                ],
              },
            ],
          },
          {
            name: "servicesIndex",
            label: "Services Index",
            fields: [
              {
                type: "object",
                name: "seo",
                label: "SEO",
                fields: seoFields,
              },
              { type: "string", name: "heroTitle", label: "Hero Title (H1)" },
              { type: "string", name: "heroDescription", label: "Hero Description", ui: { component: "textarea" } },
              {
                type: "object",
                name: "heroCtas",
                label: "Hero CTAs",
                fields: [
                  { type: "string", name: "primaryLabel", label: "Primary Label" },
                  { type: "string", name: "primaryHref", label: "Primary Href" },
                  { type: "string", name: "secondaryLabel", label: "Secondary Label" },
                  { type: "string", name: "secondaryHref", label: "Secondary Href" },
                ],
              },
              { type: "object", name: "secondaryLink", label: "Secondary Link (next to primary CTA)", fields: [
                { type: "string", name: "label", label: "Label" },
                { type: "string", name: "href", label: "Href" },
              ] },
              {
                type: "object",
                name: "pageCta",
                label: "Bottom CTA Section",
                fields: [
                  { type: "string", name: "title", label: "CTA Title" },
                  { type: "string", name: "description", label: "CTA Description", ui: { component: "textarea" } },
                  { type: "string", name: "buttonLabel", label: "Button Label" },
                  { type: "string", name: "buttonHref", label: "Button Href" },
                ],
              },
            ],
          },
          {
            name: "home",
            label: "Home",
            fields: [
              {
                type: "object",
                name: "seo",
                label: "SEO",
                fields: seoFields,
              },
              { type: "string", name: "heroTitle", label: "Hero Title (H1)" },
              { type: "string", name: "heroSubtitle", label: "Hero Subtitle" },
              { type: "string", name: "heroDescription", label: "Hero Description", ui: { component: "textarea" } },
              {
                type: "object",
                name: "heroCtas",
                label: "Hero CTAs",
                fields: [
                  { type: "string", name: "primaryLabel", label: "Primary Label" },
                  { type: "string", name: "primaryHref", label: "Primary Href" },
                  { type: "string", name: "secondaryLabel", label: "Secondary Label" },
                  { type: "string", name: "secondaryHref", label: "Secondary Href" },
                ],
              },
              {
                type: "object",
                name: "coreBlocks",
                label: "Core Building Blocks",
                fields: [
                  { type: "string", name: "title", label: "Section Title", required: true },
                  { type: "string", name: "intro", label: "Intro", ui: { component: "textarea" } },
                  {
                    type: "object",
                    name: "items",
                    label: "Blocks",
                    list: true,
                    fields: [
                      { type: "string", name: "title", label: "Title", required: true },
                      { type: "string", name: "description", label: "Description", ui: { component: "textarea" }, required: true },
                      { type: "string", name: "icon", label: "Icon" },
                      { type: "string", name: "category", label: "Category", options: ["Foundation","Attract","Trust","Convert"], required: true },
                      { type: "string", name: "benefits", label: "Benefits", list: true },
                      {
                        type: "object",
                        name: "links",
                        label: "Links",
                        list: true,
                        fields: [
                          { type: "string", name: "label", label: "Label", required: true },
                          { type: "string", name: "href", label: "Href", required: true },
                        ],
                      },
                    ],
                  },
                ],
              },
              {
                type: "object",
                name: "howWeHelp",
                label: "How We Help Section",
                fields: [
                  { type: "string", name: "title", label: "Section Title", required: true },
                  { type: "string", name: "intro", label: "Intro", ui: { component: "textarea" } },
                  { type: "string", name: "ctaLabel", label: "Link Label", required: true },
                  { type: "string", name: "ctaHref", label: "Link Href", required: true },
                ],
              },
              {
                type: "object",
                name: "clientSignals",
                label: "Client Signals Section",
                fields: [
                  { type: "string", name: "title", label: "Section Title", required: true },
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  { type: "string", name: "testimonialCaseStudies", label: "Testimonials: Pick Case Studies (slugs)", list: true, ui: { component: CaseStudyMultiSelect as any } },
                ],
              },
              {
                type: "object",
                name: "pageCta",
                label: "Bottom CTA Section",
                fields: [
                  { type: "string", name: "title", label: "CTA Title" },
                  { type: "string", name: "description", label: "CTA Description", ui: { component: "textarea" } },
                  { type: "string", name: "buttonLabel", label: "Button Label" },
                  { type: "string", name: "buttonHref", label: "Button Href" },
                ],
              },
              {
                type: "object",
                name: "toggles",
                label: "UI Toggles",
                fields: [
                  { type: "boolean", name: "enableCommandPalette", label: "Enable Command Palette" },
                  { type: "boolean", name: "enableScrollProgress", label: "Enable Scroll Progress" },
                ],
              },
            ],
          },
          {
            name: "about",
            label: "About",
            fields: [
              {
                type: "object",
                name: "seo",
                label: "SEO",
                description: "Per-page SEO settings for the About page.",
                fields: seoFields,
              },
              { type: "string", name: "name", label: "Name" },
              { type: "string", name: "title", label: "Title" },
              { type: "string", name: "subtitle", label: "Subtitle" },
              { type: "string", name: "heroTitle", label: "Hero Title (H1)" },
              { type: "string", name: "heroSubtitle", label: "Hero Subtitle" },
              { type: "string", name: "heroDescription", label: "Hero Description", ui: { component: "textarea" } },
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              { type: "string", name: "_aiSuggestHeroDesc", label: "", ui: { component: AiSuggestHeroDescription as any } },
              { type: "string", name: "storyApproachTitle", label: "Approach Title" },
              { type: "string", name: "storyApproachIcon", label: "Approach Icon" },
              { type: "string", name: "storyApproachTagline", label: "Approach Tagline" },
              { type: "string", name: "storyApproachBody", label: "Approach Body", ui: { component: "textarea" } },
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              { type: "string", name: "_aiSuggestApproachBody", label: "", ui: { component: AiSuggestApproachBody as any } },
              {
                type: "object",
                name: "storyDifferentiators",
                label: "What Sets Me Apart (Cards)",
                list: true,
                fields: [
                  { type: "string", name: "title", label: "Title", required: true },
                  { type: "string", name: "description", label: "Description", ui: { component: "textarea" } },
                  { type: "string", name: "icon", label: "Icon" },
                ],
              },
              { type: "string", name: "storyDifferentiatorsTitle", label: "What Sets Me Apart Title" },
              { type: "string", name: "storyMissionTitle", label: "Mission Title" },
              { type: "string", name: "storyMissionIcon", label: "Mission Icon" },
              { type: "string", name: "storyMissionBody", label: "Mission Body", ui: { component: "textarea" } },
              { type: "image", name: "profileImage", label: "Profile Image" },
              {
                type: "object",
                name: "profileImageFocus",
                label: "Profile Image Focus",
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                ui: { component: ImageFocusControl as any },
                fields: [
                  { type: "number", name: "x", label: "X (%)" },
                  { type: "number", name: "y", label: "Y (%)" },
                  { type: "number", name: "zoom", label: "Zoom (%)" },
                ],
              },
              { type: "number", name: "rating", label: "Client Rating" },
              { type: "string", name: "totalClients", label: "Total Clients" },
              { type: "string", name: "ctaTitle", label: "CTA Title" },
              { type: "string", name: "ctaDescription", label: "CTA Description" },
              { type: "rich-text", name: "body", label: "About Content", isBody: true },
            ],
          },
        ],
      },
      {
        name: "theme",
        label: "Theme",
        path: "content/settings",
        format: "json",
        match: { include: "theme" },
        fields: [
          {
            type: "object",
            name: "primary",
            label: "Primary Palette",
            fields: [
              { type: "string", name: "c50", label: "50", ui: { component: ColorWithHistoryField } },
              { type: "string", name: "c100", label: "100", ui: { component: ColorWithHistoryField } },
              { type: "string", name: "c200", label: "200", ui: { component: ColorWithHistoryField } },
              { type: "string", name: "c300", label: "300", ui: { component: ColorWithHistoryField } },
              { type: "string", name: "c400", label: "400", ui: { component: ColorWithHistoryField } },
              { type: "string", name: "c500", label: "500", ui: { component: ColorWithHistoryField } },
              { type: "string", name: "c600", label: "600", ui: { component: ColorWithHistoryField } },
              { type: "string", name: "c700", label: "700", ui: { component: ColorWithHistoryField } },
              { type: "string", name: "c800", label: "800", ui: { component: ColorWithHistoryField } },
              { type: "string", name: "c900", label: "900", ui: { component: ColorWithHistoryField } },
            ],
          },
          {
            type: "object",
            name: "accent",
            label: "Accent Colors",
            fields: [
              { type: "string", name: "green", label: "Green", ui: { component: "color" } },
              { type: "string", name: "blue", label: "Blue", ui: { component: "color" } },
              { type: "string", name: "yellow", label: "Yellow", ui: { component: "color" } },
              { type: "string", name: "red", label: "Red", ui: { component: "color" } },
            ],
          },
        ],
      },
      {
        name: "settings",
        label: "Site Settings",
        path: "content/settings",
        format: "json",
        match: { include: "ai" },
        fields: [
          { type: "string", name: "systemInstructions", label: "OpenAI System Instructions", ui: { component: "textarea" }, description: "Global AI guardrails." },
          { type: "string", name: "brandVoice", label: "Brand Voice", ui: { component: "textarea" }, description: "Primary tone of voice." },
          { type: "string", name: "model", label: "OpenAI Model", description: "Optional override for the model used by content suggestions." },
          { type: "string", name: "siteUrl", label: "Site URL (context only)", description: "Canonical production URL (no trailing slash)." },
        ],
      },
      {
        name: "seoSettings",
        label: "SEO Settings",
        path: "content/settings",
        format: "json",
        match: { include: "seo" },
        fields: [
      { type: "string", name: "region", label: "Region (e.g., UK)", description: "Primary market/area served." },
      { type: "string", name: "locale", label: "Locale (e.g., en-GB)", description: "Language/locale tag." },
      { type: "string", name: "readingLevel", label: "Reading Level" },
      { type: "number", name: "fleschTarget", label: "Flesch Target" },
          {
            type: "object",
            name: "keywordPolicy",
            label: "Keyword Policy",
            fields: [
              { type: "string", name: "includeAlways", label: "Always Include", list: true },
              { type: "string", name: "includePreferred", label: "Preferred Keywords", list: true },
              { type: "string", name: "avoid", label: "Avoid Phrases", list: true },
      { type: "number", name: "maxDensityPercent", label: "Max Keyword Density %" },
            ],
          },
          {
            type: "object",
            name: "lengthTargets",
            label: "Length Targets",
            fields: [
              {
                type: "object",
                name: "about",
                label: "About",
                fields: [
                  { type: "object", name: "heroDescription", label: "Hero Description", fields: [
        { type: "number", name: "minWords", label: "Min Words" },
        { type: "number", name: "maxWords", label: "Max Words" },
                  ] },
                  { type: "object", name: "body", label: "Body", fields: [
        { type: "number", name: "minWords", label: "Min Words" },
        { type: "number", name: "maxWords", label: "Max Words" },
                  ] },
                ],
              },
              {
                type: "object",
                name: "service",
                label: "Service",
                fields: [
                  { type: "object", name: "heroDescription", label: "Hero Description", fields: [
        { type: "number", name: "minWords", label: "Min Words" },
        { type: "number", name: "maxWords", label: "Max Words" },
                  ] },
                  { type: "object", name: "body", label: "Body", fields: [
        { type: "number", name: "minWords", label: "Min Words" },
        { type: "number", name: "maxWords", label: "Max Words" },
                  ] },
                ],
              },
              {
                type: "object",
                name: "blogPost",
                label: "Blog Post",
                fields: [
                  { type: "object", name: "excerptChars", label: "Excerpt Characters", fields: [
        { type: "number", name: "min", label: "Min" },
        { type: "number", name: "max", label: "Max" },
                  ] },
                  { type: "object", name: "body", label: "Body", fields: [
        { type: "number", name: "minWords", label: "Min Words" },
        { type: "number", name: "maxWords", label: "Max Words" },
                  ] },
                ],
              },
              {
                type: "object",
                name: "caseStudy",
                label: "Case Study",
                fields: [
                  { type: "object", name: "body", label: "Body", fields: [
        { type: "number", name: "minWords", label: "Min Words" },
        { type: "number", name: "maxWords", label: "Max Words" },
                  ] },
                ],
              },
              {
                type: "object",
                name: "testimonial",
                label: "Testimonial",
                fields: [
                  { type: "object", name: "body", label: "Body", fields: [
        { type: "number", name: "minWords", label: "Min Words" },
        { type: "number", name: "maxWords", label: "Max Words" },
                  ] },
                ],
              },
            ],
          },
          {
            type: "object",
            name: "jsonLd",
            label: "JSON-LD Defaults",
            fields: [
      { type: "boolean", name: "organization", label: "Organization" },
      { type: "boolean", name: "website", label: "Website" },
      { type: "boolean", name: "person", label: "Person (About)" },
      { type: "boolean", name: "service", label: "Service (detail pages)" },
      { type: "boolean", name: "article", label: "Article (blog posts)" },
      { type: "boolean", name: "breadcrumb", label: "Breadcrumb" },
      { type: "boolean", name: "faq", label: "FAQ" },
      { type: "boolean", name: "review", label: "Review" },
      { type: "boolean", name: "localBusiness", label: "Local Business (Home)" },
            ],
          },
        ],
      },
      {
        name: "business",
        label: "Business Info",
        path: "content/settings",
        format: "json",
        match: { include: "business" },
        fields: [
          { type: "string", name: "brand", label: "Brand Name" },
          { type: "string", name: "site_url", label: "Website URL" },
          { type: "string", name: "primaryCTAs", label: "Primary CTAs", list: true },
          { type: "string", name: "audience", label: "Target Audience", list: true },
          { type: "string", name: "services", label: "Services Offered", list: true },
          { type: "string", name: "locations", label: "Service Areas", list: true },
          { type: "string", name: "valueProps", label: "Value Propositions", list: true },
          {
            type: "object",
            name: "targetKeywords",
            label: "Target Keywords",
            fields: [
              { type: "string", name: "primary", label: "Primary Keywords", list: true },
              { type: "string", name: "secondary", label: "Secondary Keywords", list: true },
            ],
          },
          { type: "string", name: "competitors", label: "Main Competitors", list: true },
          { type: "object", name: "socialProfiles", label: "Social Profiles", fields: [
            { type: "string", name: "linkedin", label: "LinkedIn" },
            { type: "string", name: "twitter", label: "Twitter" },
            { type: "string", name: "facebook", label: "Facebook" },
            { type: "string", name: "instagram", label: "Instagram" }
          ]},
          { type: "object", name: "schemaDefaults", label: "Schema Defaults", fields: [
            { type: "string", name: "organization_name", label: "Organization Name" },
            { type: "string", name: "logo_url", label: "Logo URL" },
            { type: "string", name: "contact_phone", label: "Contact Phone" },
            { type: "string", name: "contact_email", label: "Contact Email" },
            { type: "object", name: "address", label: "Address", fields: [
              { type: "string", name: "streetAddress", label: "Street Address" },
              { type: "string", name: "addressLocality", label: "City" },
              { type: "string", name: "addressRegion", label: "Region / State" },
              { type: "string", name: "postalCode", label: "Postal Code" },
              { type: "string", name: "addressCountry", label: "Country Code" }
            ]}
          ]},
          { type: "object", name: "localSeo", label: "Local SEO / Citations", fields: [
            { type: "string", name: "description", label: "Business Description", ui: { component: "textarea" } },
            { type: "number", name: "foundedYear", label: "Founded Year" },
            { type: "object", name: "hours", label: "Hours", ui: { description: "Format: HH:MM-HH:MM or Closed" }, fields: [
              { type: "string", name: "monday", label: "Monday" },
              { type: "string", name: "tuesday", label: "Tuesday" },
              { type: "string", name: "wednesday", label: "Wednesday" },
              { type: "string", name: "thursday", label: "Thursday" },
              { type: "string", name: "friday", label: "Friday" },
              { type: "string", name: "saturday", label: "Saturday" },
              { type: "string", name: "sunday", label: "Sunday" }
            ]},
            { type: "object", name: "phones", label: "Phones", fields: [
              { type: "string", name: "primary", label: "Primary" },
              { type: "string", name: "secondary", label: "Secondary" },
              { type: "string", name: "tollFree", label: "Toll Free" }
            ]},
            { type: "object", name: "images", label: "Images", fields: [
              { type: "image", name: "logo", label: "Logo" },
              { type: "image", name: "squareLogo", label: "Square Logo" },
              { type: "image", name: "cover", label: "Cover Image" }
            ]},
            { type: "object", name: "tracking", label: "Tracking (UTM)", fields: [
              { type: "string", name: "utmMedium", label: "UTM Medium" },
              { type: "string", name: "utmCampaign", label: "UTM Campaign" }
            ]}
          ]},
        ],
      },
      {
        name: "directories",
        label: "Business Directories",
        path: "content/settings",
        format: "json",
        match: { include: "directories" },
        fields: [
          {
            type: "object",
            name: "directories",
            label: "Directories",
            list: true,
            ui: {
              itemProps: (item: any) => {
                return { label: item?.name || "New Directory" };
              },
              defaultItem: {
                name: "",
                url: "",
                status: "pending",
                submissionDate: "",
                lastUpdated: "",
                listingUrl: "",
                notes: "",
                isVerified: false
              }
            },
            fields: [
              { type: "string", name: "name", label: "Directory Name" },
              { type: "string", name: "url", label: "Directory URL" },
              { 
                type: "string", 
                name: "status", 
                label: "Status",
                options: [
                  { label: "Pending", value: "pending" },
                  { label: "Submitted", value: "submitted" },
                  { label: "Live", value: "live" },
                  { label: "Needs Update", value: "needs_update" },
                  { label: "Rejected", value: "rejected" },
                  { label: "Expired", value: "expired" }
                ]
              },
              { 
                type: "string", 
                name: "submissionDate", 
                label: "Submission Date",
                description: "Format: DD-MM-YYYY (e.g., 07-09-2025) or leave empty if not yet submitted"
              },
              { 
                type: "string", 
                name: "lastUpdated", 
                label: "Last Updated",
                description: "Format: DD-MM-YYYY (e.g., 07-09-2025) or leave empty"
              },
              { type: "string", name: "listingUrl", label: "Live Listing URL" },
              { type: "string", name: "notes", label: "Notes", ui: { component: "textarea" } },
              { type: "boolean", name: "isVerified", label: "Verified?" }
            ]
          }
        ],
      },
      {
        name: "service",
        label: "Services",
        path: "content/services",
        format: "md",
        fields: [
          { type: "object", name: "seo", label: "SEO", fields: seoFields },
          { type: "string", name: "serviceId", label: "Service ID" },
          { type: "string", name: "title", label: "Title (H1)", isTitle: true, required: true },
          { type: "string", name: "subtitle", label: "Subtitle" },
          { type: "string", name: "description", label: "Service Description", ui: { component: "textarea" } },
          { type: "string", name: "keywords", label: "Keywords", list: true },
          { type: "string", name: "icon", label: "Icon" },
          { type: "boolean", name: "featured", label: "Featured" },
          { type: "number", name: "order", label: "Order" },
          { type: "string", name: "heroTitle", label: "Hero Title" },
          { type: "string", name: "heroSubtitle", label: "Hero Subtitle" },
          { type: "string", name: "heroDescription", label: "Hero Description", ui: { component: "textarea" } },
          { type: "string", name: "whatYouGet", label: "What You Get", list: true },
          {
            type: "object",
            name: "features",
            label: "Features",
            list: true,
            fields: [
              { type: "string", name: "title", label: "Title" },
              { type: "string", name: "description", label: "Description", ui: { component: "textarea" } },
              { type: "string", name: "icon", label: "Icon" },
            ],
          },
          {
            type: "object",
            name: "process",
            label: "Process",
            list: true,
            fields: [
              { type: "string", name: "step", label: "Step" },
              { type: "string", name: "title", label: "Title" },
              { type: "string", name: "description", label: "Description", ui: { component: "textarea" } },
              { type: "string", name: "duration", label: "Duration" },
            ],
          },
          { type: "string", name: "results", label: "Results", list: true },
          {
            type: "object",
            name: "faqs",
            label: "FAQs",
            list: true,
            fields: [
              { type: "string", name: "question", label: "Question" },
              { type: "string", name: "answer", label: "Answer", ui: { component: "textarea" } },
            ],
          },
          { type: "string", name: "ctaTitle", label: "CTA Title" },
          { type: "string", name: "ctaDescription", label: "CTA Description", ui: { component: "textarea" } },
          { type: "string", name: "emailSubject", label: "Email Subject" },
          { type: "string", name: "emailBody", label: "Email Body", ui: { component: "textarea" } },
          { type: "rich-text", name: "body", label: "Service Content", isBody: true },
        ],
      },
      {
        name: "caseStudy",
        label: "Case Studies",
        path: "content/case-studies",
        format: "md",
        fields: [
          { type: "object", name: "seo", label: "SEO", fields: seoFields },
          { type: "string", name: "title", label: "Title (H1)", isTitle: true, required: true },
          { type: "string", name: "client", label: "Client Name (text)", required: true },
          { type: "string", name: "challenge", label: "Challenge (paragraphs <p>)", required: true, ui: { component: "textarea" } },
          { type: "image", name: "image", label: "Case Study Image (<img> src)", required: true },
          { type: "string", name: "date", label: "Date (display text)", required: true },
          { type: "string", name: "readTime", label: "Read Time (display text)", required: true },
          { type: "boolean", name: "featured", label: "Featured Case Study" },
          { type: "number", name: "order", label: "Display Order" },
          { type: "string", name: "tags", label: "Tags (chips)", list: true },
          // New: Direct service mapping for personalization & recommendations
          {
            type: "string",
            name: "relatedServices",
            label: "Related Services (select one or more)",
            list: true,
            options: [
              { value: 'brand-strategy', label: 'Brand Strategy' },
              { value: 'seo', label: 'SEO' },
              { value: 'content-marketing', label: 'Content Marketing' },
              { value: 'email-marketing', label: 'Email Marketing' },
              { value: 'lead-generation', label: 'Lead Generation' },
              { value: 'ppc', label: 'PPC / Paid Ads' },
              { value: 'social-media', label: 'Social Media' },
              { value: 'digital-campaigns', label: 'Digital Campaigns' },
              { value: 'website-design', label: 'Website Design' },
            ],
            description: "Select which core services this case study best supports (used for recommendations)."
          },
          // Advanced: Optional tag → service overrides (if a specific tag should map to specific service(s))
          {
            type: "object",
            name: "tagServiceMap",
            label: "Tag → Service Overrides",
            list: true,
            ui: { itemProps: (item) => ({ label: item?.tag ? `Tag: ${item.tag}` : 'Mapping' }) },
            description: "Optional overrides if certain tags imply specific services. If empty, generic heuristics + relatedServices are used.",
            fields: [
              { type: 'string', name: 'tag', label: 'Tag (must exactly match one of the tags above)' },
              {
                type: 'string',
                name: 'services',
                label: 'Service IDs',
                list: true,
                options: [
                  { value: 'brand-strategy', label: 'Brand Strategy' },
                  { value: 'seo', label: 'SEO' },
                  { value: 'content-marketing', label: 'Content Marketing' },
                  { value: 'email-marketing', label: 'Email Marketing' },
                  { value: 'lead-generation', label: 'Lead Generation' },
                  { value: 'ppc', label: 'PPC / Paid Ads' },
                  { value: 'social-media', label: 'Social Media' },
                  { value: 'digital-campaigns', label: 'Digital Campaigns' },
                  { value: 'website-design', label: 'Website Design' },
                ]
              }
            ]
          },
          {
            type: "object",
            name: "testimonial",
            label: "Customer Testimonial (for snippets)",
            fields: [
              { type: "string", name: "quote", label: "Quote (blockquote text)", ui: { component: "textarea" } },
              { type: "string", name: "author", label: "Author (text)" },
              { type: "string", name: "role", label: "Role/Title (text)" },
              { type: "string", name: "metrics", label: "Metric Chips (badge/list items)", list: true },
              { type: "boolean", name: "featured", label: "Featured Snippet" },
            ],
          },
          {
            type: "object",
            name: "results",
            label: "Results (stat chips)",
            fields: [
              { type: "string", name: "revenue", label: "Revenue Increase" },
              { type: "string", name: "onlineOrders", label: "Online Orders Growth" },
              { type: "string", name: "socialFollowing", label: "Social Media Growth" },
              { type: "string", name: "customerRetention", label: "Customer Retention" },
            ],
          },
          { type: "rich-text", name: "body", label: "Case Study Content", isBody: true },
        ],
      },
      {
        name: "blogPost",
        label: "Blog Posts",
        path: "content/blog",
        format: "md",
  match: { exclude: "{_*}" },
        fields: [
          {
            type: "object",
            name: "seo",
            label: "SEO",
            fields: seoFields,
          },
          { type: "string", name: "title", label: "Title (H1)", isTitle: true, required: true },
          { type: "string", name: "slug", label: "Slug" },
          { type: "string", name: "excerpt", label: "Excerpt", ui: { component: "textarea" } },
          { type: "image", name: "featuredImage", label: "Featured Image" },
          { type: "string", name: "alt", label: "Featured Image Alt" },
          {
            type: "object",
            name: "author",
            label: "Author",
            fields: [
              { type: "string", name: "name", label: "Name" },
              { type: "string", name: "bio", label: "Bio", ui: { component: "textarea" } },
              { type: "image", name: "avatar", label: "Avatar" },
              { type: "string", name: "linkedin", label: "LinkedIn" },
              { type: "string", name: "twitter", label: "Twitter" },
            ],
          },
          { type: "string", name: "categories", label: "Categories", list: true },
          { type: "string", name: "tags", label: "Tags", list: true },
          // New: Direct mapping of this blog post to one or more core services
          {
            type: 'string',
            name: 'relatedServices',
            label: 'Related Services (select one or more)',
            list: true,
            options: [
              { value: 'brand-strategy', label: 'Brand Strategy' },
              { value: 'seo', label: 'SEO' },
              { value: 'content-marketing', label: 'Content Marketing' },
              { value: 'email-marketing', label: 'Email Marketing' },
              { value: 'lead-generation', label: 'Lead Generation' },
              { value: 'ppc', label: 'PPC / Paid Ads' },
              { value: 'social-media', label: 'Social Media' },
              { value: 'digital-campaigns', label: 'Digital Campaigns' },
              { value: 'website-design', label: 'Website Design' },
            ],
            description: 'Select which services this post supports for recommendation & personalization.'
          },
          // Optional per-tag overrides: map a specific tag to explicit service IDs (if ambiguous)
          {
            type: 'object',
            name: 'tagServiceMap',
            label: 'Tag → Service Overrides',
            list: true,
            ui: { itemProps: (item) => ({ label: item?.tag ? `Tag: ${item.tag}` : 'Mapping' }) },
            description: 'If set, these override automatic theme inference for listed tags.',
            fields: [
              { type: 'string', name: 'tag', label: 'Tag (must match a tag above)' },
              {
                type: 'string',
                name: 'services',
                label: 'Service IDs',
                list: true,
                options: [
                  { value: 'brand-strategy', label: 'Brand Strategy' },
                  { value: 'seo', label: 'SEO' },
                  { value: 'content-marketing', label: 'Content Marketing' },
                  { value: 'email-marketing', label: 'Email Marketing' },
                  { value: 'lead-generation', label: 'Lead Generation' },
                  { value: 'ppc', label: 'PPC / Paid Ads' },
                  { value: 'social-media', label: 'Social Media' },
                  { value: 'digital-campaigns', label: 'Digital Campaigns' },
                  { value: 'website-design', label: 'Website Design' },
                ]
              }
            ]
          },
          { type: "string", name: "keywords", label: "Keywords", list: true },
          { type: "datetime", name: "publishDate", label: "Publish Date" },
          { type: "datetime", name: "lastModified", label: "Last Modified" },
          { type: "boolean", name: "featured", label: "Featured" },
          { type: "number", name: "readingTime", label: "Reading Time (mins)" },
          {
            type: "object",
            name: "socialShare",
            label: "Social Share",
            fields: [
              { type: "string", name: "title", label: "Title" },
              { type: "string", name: "description", label: "Description", ui: { component: "textarea" } },
              { type: "image", name: "image", label: "Image" },
            ],
          },
          { type: "rich-text", name: "body", label: "Blog Content", isBody: true },
        ],
      },
    ],
  },
});
