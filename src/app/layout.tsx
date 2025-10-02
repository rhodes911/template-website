import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import dynamic from 'next/dynamic'
import GoogleAnalytics from '@/components/GoogleAnalytics'
import { organizationJsonLd, websiteJsonLd, SITE_URL } from '@/lib/seo'
import ChatbotGate from '@/components/ChatbotGate'
import { getBusinessSettings, getSeoSettings } from '@/lib/settings'

const CommandPalette = dynamic(() => import('@/components/CommandPalette'), { ssr: false })
// Import TinaProvider statically so it doesn't force a CSR bailout for all children
import TinaProvider from '@/components/TinaProvider'

const inter = Inter({ subsets: ['latin'] })

const biz = getBusinessSettings()
const brand = biz.brand || 'REPLACE Your Business Name'
const defaultTitle = `${brand} - Expert Digital Marketing for Entrepreneurs`
const defaultDescription = 'Transform your brand with smart marketing strategies. We help entrepreneurs and personal brands create compelling campaigns that convert visitors into loyal customers.'
const ogAbs = `${SITE_URL}/og-image.png`

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: defaultTitle,
  description: defaultDescription,
  keywords: [
    'digital marketing',
    'marketing strategy',
    'brand development',
    'REPLACE keyword 1',
    'REPLACE keyword 2',
    'REPLACE your main service',
    'REPLACE your job title',
    'REPLACE your specialty'
  ],
  authors: [{ name: 'REPLACE Author Name' }],
  creator: brand,
  publisher: brand,
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/icon', sizes: '32x32', type: 'image/png' },
    ],
    shortcut: '/favicon.ico',
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
  openGraph: {
    title: defaultTitle,
    description: 'Transform your brand with smart marketing strategies. Get your free consultation today.',
    url: SITE_URL,
    siteName: brand,
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: ogAbs,
        width: 1200,
        height: 630,
        alt: `${brand} – REPLACE Your Business Description`,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: defaultTitle,
    description: 'REPLACE Twitter/X card description for your business. Keep under 200 characters.',
    images: [ogAbs],
  },
  verification: {
    google: 'eVAC5mWqTi84VqVwMkEDQl-E70PdqJB2upZGtGOFz-w',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const gaId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID

  return (
    <html lang="en" className="scroll-smooth">
      <head>
        {/* Performance optimizations */}
        <link rel="preconnect" href="https://www.googletagmanager.com" />
        <link rel="preconnect" href="https://www.google-analytics.com" />
        <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
        {/* Favicon and app icons - Next.js will automatically serve /icon from icon.tsx */}
        <link rel="icon" type="image/x-icon" href="/favicon.ico" />
        <link rel="manifest" href="/site.webmanifest" />
        <meta name="theme-color" content="#000000" />
        {/* Global JSON-LD: controlled via Tina (SEO Settings → JSON-LD) */}
        {(() => {
          const seo = getSeoSettings();
          const showOrg = seo.jsonLd?.organization !== false; // default on
          const showSite = seo.jsonLd?.website !== false; // default on
          return (
            <>
              {showOrg && (
                <script
                  type="application/ld+json"
                  // eslint-disable-next-line react/no-danger
                  dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd()) }}
                />
              )}
              {showSite && (
                <script
                  type="application/ld+json"
                  // eslint-disable-next-line react/no-danger
                  dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd()) }}
                />
              )}
            </>
          );
        })()}
      </head>
      <body className={inter.className}>
        {gaId && <GoogleAnalytics />}
        <TinaProvider>
          {children}
          <CommandPalette />
          {/* Floating AI chatbot wizard for lead capture (hidden in Tina admin) */}
          <ChatbotGate />
        </TinaProvider>
      </body>
    </html>
  )
}
