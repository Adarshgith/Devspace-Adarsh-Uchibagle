import { siteSettingsQuery } from '@/lib/queries'
import { client } from '@/lib/sanity'
import { SiteSettings } from '@/types/sanity'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
//import Header from '@/components/layout/Header'
import { Header, HeaderSkeleton } from '@/components/header'
//import Footer from '@/components/layout/Footer'
import Footer from '@/components/footer/'
import ErrorBoundary from '@/components/ui/ErrorBoundary'
import { Suspense } from 'react'
import PerformanceMonitoring from '@/components/PerformanceMonitoring'
import GoogleAnalytics from '@/components/GoogleAnalytics'

const inter = Inter({ subsets: ['latin'] })

// Fetch site settings for metadata
async function getSiteSettings(): Promise<SiteSettings | null> {
  try {
    return await client.fetch(siteSettingsQuery)
  } catch (error) {
    console.error('Error fetching site settings:', error)
    return null
  }
}

export async function generateMetadata(): Promise<Metadata> {
  const siteSettings = await getSiteSettings()

  const title = siteSettings?.title || 'Agency Website'
  const description = siteSettings?.description || 'Professional agency website built with Next.js and Sanity'
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

  return {
    title: {
      default: title,
      template: `%s | ${title}`,
    },
    description,
    keywords: 'agency, web development, digital marketing, SEO, design',
    authors: [{ name: title }],
    creator: title,
    publisher: title,
    robots: {
      index: !siteSettings?.noIndex,
      follow: !siteSettings?.noIndex,
      googleBot: {
        index: !siteSettings?.noIndex,
        follow: !siteSettings?.noIndex,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    openGraph: {
      type: 'website',
      locale: 'en_US',
      url: siteUrl,
      title,
      description,
      siteName: title,
      images: [
        {
          url: `${siteUrl}/og-image.jpg`,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [`${siteUrl}/og-image.jpg`],
      creator: '@yourhandle',
    },
    verification: {
      google: 'your-google-verification-code',
    },
    alternates: {
      canonical: siteUrl,
    },
    other: {
      'msapplication-TileColor': '#000000',
      'theme-color': '#000000',
    },
  }
}

interface RootLayoutProps {
  children: React.ReactNode
}

export default async function RootLayout({ children }: RootLayoutProps) {
  const siteSettings = await getSiteSettings()
  const gaId = process.env.NEXT_PUBLIC_GA_ID

  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <meta name="msapplication-TileColor" content="#000000" />
        <meta name="theme-color" content="#000000" />

        {/* Preconnect to external domains */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://www.google-analytics.com" />

        {/* DNS prefetch for performance */}
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />

        {/* Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Organization',
              name: siteSettings?.title || 'Agency Website',
              description: siteSettings?.description,
              url: process.env.NEXT_PUBLIC_SITE_URL,
              logo: siteSettings?.siteLogo ? `${process.env.NEXT_PUBLIC_SITE_URL}/logo.png` : undefined,
              contactPoint: {
                '@type': 'ContactPoint',
                telephone: siteSettings?.phone,
                contactType: 'customer service',
                email: siteSettings?.email,
              },
              address: {
                '@type': 'PostalAddress',
                streetAddress: siteSettings?.address,
              },
              sameAs: [
                siteSettings?.linkedInLink,
                siteSettings?.twitterLink,
                siteSettings?.facebookLink,
                siteSettings?.instagramLink,
              ].filter(Boolean),
            }),
          }}
        />
      </head>
      <body className={`${inter.className} antialiased min-h-screen flex flex-col`}>
        {/* Skip to main content for accessibility */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-blue-600 text-white px-4 py-2 rounded-md z-50"
        >
          Skip to main content
        </a>

        <ErrorBoundary>
          <Suspense fallback={<HeaderSkeleton />}>
            <Header />
          </Suspense>
        </ErrorBoundary>

        <main id="main-content" className="flex-1">
          <ErrorBoundary>
            {children}
          </ErrorBoundary>
        </main>

        <ErrorBoundary>
          <Suspense>
            <Footer />
          </Suspense>
        </ErrorBoundary>

        {/* Client-side components */}
        {gaId && <GoogleAnalytics gaId={gaId} />}
        <PerformanceMonitoring />
      </body>
    </html>
  )
}
