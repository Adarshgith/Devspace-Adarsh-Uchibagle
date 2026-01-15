import { NextResponse } from 'next/server'
import { client } from '@/lib/sanity'
import { getSitemapQuery } from '@/lib/queries'

interface SitemapItem {
  slug: { current: string }
  _updatedAt: string
}

interface SitemapData {
  blogs?: SitemapItem[]
  news?: SitemapItem[]
  events?: SitemapItem[]
  pages?: SitemapItem[]
}

export async function GET() {
  try {
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://example.com'
    
    // Fetch all content from Sanity
    const data: SitemapData = await client.fetch(getSitemapQuery)
    
    // Static pages
    const staticPages = [
      {
        url: `${siteUrl}/`,
        lastModified: new Date().toISOString(),
        changeFrequency: 'daily',
        priority: 1.0
      },
      {
        url: `${siteUrl}/blog`,
        lastModified: new Date().toISOString(),
        changeFrequency: 'daily',
        priority: 0.9
      },
      {
        url: `${siteUrl}/news`,
        lastModified: new Date().toISOString(),
        changeFrequency: 'daily',
        priority: 0.9
      },
      {
        url: `${siteUrl}/events`,
        lastModified: new Date().toISOString(),
        changeFrequency: 'weekly',
        priority: 0.8
      }
    ]
    
    // Dynamic pages from Sanity
    const dynamicPages = []
    
    // Blog posts
    if (data.blogs) {
      data.blogs.forEach((blog: SitemapItem) => {
        dynamicPages.push({
          url: `${siteUrl}/blog/${blog.slug.current}`,
          lastModified: blog._updatedAt,
          changeFrequency: 'weekly',
          priority: 0.7
        })
      })
    }

    // News articles
    if (data.news) {
      data.news.forEach((article: SitemapItem) => {
        dynamicPages.push({
          url: `${siteUrl}/news/${article.slug.current}`,
          lastModified: article._updatedAt,
          changeFrequency: 'weekly',
          priority: 0.7
        })
      })
    }

    // Events
    if (data.events) {
      data.events.forEach((event: SitemapItem) => {
        dynamicPages.push({
          url: `${siteUrl}/events/${event.slug.current}`,
          lastModified: event._updatedAt,
          changeFrequency: 'weekly',
          priority: 0.6
        })
      })
    }

    // Custom pages
    if (data.pages) {
      data.pages.forEach((page: SitemapItem) => {
        dynamicPages.push({
          url: `${siteUrl}/${page.slug.current}`,
          lastModified: page._updatedAt,
          changeFrequency: 'monthly',
          priority: 0.5
        })
      })
    }
    
    // Combine all pages
    const allPages = [...staticPages, ...dynamicPages]
    
    // Generate XML sitemap
    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allPages
  .map(
    (page) => `  <url>
    <loc>${page.url}</loc>
    <lastmod>${page.lastModified}</lastmod>
    <changefreq>${page.changeFrequency}</changefreq>
    <priority>${page.priority}</priority>
  </url>`
  )
  .join('\n')}
</urlset>`
    
    return new NextResponse(sitemap, {
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, max-age=3600, s-maxage=3600'
      }
    })
  } catch (error) {
    console.error('Error generating sitemap:', error)
    
    // Return a basic sitemap if there's an error
    const basicSitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${process.env.NEXT_PUBLIC_SITE_URL || 'https://example.com'}/</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
</urlset>`
    
    return new NextResponse(basicSitemap, {
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, max-age=3600, s-maxage=3600'
      }
    })
  }
}