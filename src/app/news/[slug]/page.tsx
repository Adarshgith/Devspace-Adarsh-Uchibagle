import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { Calendar, Tag, ArrowLeft, Share2 } from 'lucide-react'
import { client } from '@/lib/sanity'
import { urlFor } from '@/lib/sanity'
import { 
  newsBySlugQuery, 
  newsSlugsQuery, 
  siteSettingsQuery,
  relatedNewsQuery 
} from '@/lib/queries'
// Types are inferred from queries
import { formatDate, generateExcerpt } from '@/lib/utils'
import PortableTextRenderer from '@/components/ui/PortableTextRenderer'
import SocialShare from '@/components/ui/SocialShare'
import NewsCard from '@/components/news/NewsCard'
import Breadcrumbs from '@/components/ui/Breadcrumbs'

interface NewsPageProps {
  params: Promise<{
    slug: string
  }>
}

// Generate metadata for SEO
export async function generateMetadata({ params }: NewsPageProps): Promise<Metadata> {
  const { slug } = await params
  const news = await client.fetch(newsBySlugQuery, { slug })
  const siteSettings = await client.fetch(siteSettingsQuery)
  
  if (!news) {
    return {
      title: 'News Not Found',
      description: 'The requested news article could not be found.'
    }
  }
  
  const title = news.seo?.title || news.title
  const description = news.seo?.description || generateExcerpt(news.content)
  const siteName = siteSettings?.title || 'Agency Website'
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://example.com'
  
  return {
    title: `${title} | ${siteName}`,
    description,
    keywords: news.seo?.keywords,
    openGraph: {
      title,
      description,
      type: 'article',
      url: `${siteUrl}/news/${slug}`,
      siteName,
      publishedTime: news.publishedAt,
      modifiedTime: news._updatedAt,
      images: news.featuredImage ? [
        {
          url: urlFor(news.featuredImage).width(1200).height(630).url(),
          width: 1200,
          height: 630,
          alt: news.featuredImage.alt || news.title
        }
      ] : [],
      tags: news.categories?.map(cat => cat.title) || []
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: news.featuredImage ? [
        urlFor(news.featuredImage).width(1200).height(630).url()
      ] : []
    },
    alternates: {
      canonical: `${siteUrl}/news/${slug}`
    }
  }
}

// Generate static params for static generation
export async function generateStaticParams() {
  const slugs = await client.fetch(newsSlugsQuery)
  
  return slugs.map((item: { slug: string }) => ({
    slug: item.slug
  }))
}

export default async function NewsPage({ params }: NewsPageProps) {
  const { slug } = await params
  const [news, siteSettings] = await Promise.all([
    client.fetch(newsBySlugQuery, { slug }),
    client.fetch(siteSettingsQuery)
  ])
  
  if (!news) {
    notFound()
  }
  
  // Fetch related news
  const relatedNews = await client.fetch(relatedNewsQuery, {
    currentId: news._id,
    categories: news.category ? [news.category._id] : [],
    limit: 3
  })
  
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://example.com'
  const newsUrl = `${siteUrl}/news/${slug}`
  
  // Breadcrumb items
  const breadcrumbItems = [
    { label: 'Home', href: '/' },
    { label: 'News', href: '/news' },
    { label: news.title, href: `/news/${slug}` }
  ]
  
  return (
    <>
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'NewsArticle',
            headline: news.title,
            description: generateExcerpt(news.content),
            image: news.featuredImage ? [
              urlFor(news.featuredImage).width(1200).height(630).url()
            ] : [],
            datePublished: news.publishedAt,
            dateModified: news._updatedAt,
            author: {
              '@type': 'Organization',
              name: siteSettings?.title || 'Agency Website'
            },
            publisher: {
              '@type': 'Organization',
              name: siteSettings?.title || 'Agency Website',
              logo: siteSettings?.logo ? {
                '@type': 'ImageObject',
                url: urlFor(siteSettings.logo).width(200).height(60).url()
              } : undefined
            },
            mainEntityOfPage: {
              '@type': 'WebPage',
              '@id': newsUrl
            },
            articleSection: news.categories?.[0]?.title || 'News',
            keywords: news.categories?.map(cat => cat.title).join(', ') || ''
          })
        }}
      />
      
      <div className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <div className="relative bg-white">
          {news.featuredImage && (
            <div className="relative h-96 lg:h-[500px] overflow-hidden">
              <Image
                src={urlFor(news.featuredImage).width(1920).height(1080).url()}
                alt={news.featuredImage.alt || news.title}
                fill
                className="object-cover"
                priority
                unoptimized
              />
              <div className="absolute inset-0 bg-black bg-opacity-40" />
              
              {/* Content Overlay */}
              <div className="absolute inset-0 flex items-end">
                <div className="container mx-auto px-4 pb-12">
                  <div className="max-w-4xl">
                    {/* Breadcrumbs */}
                    <div className="mb-6">
                      <Breadcrumbs 
                        items={breadcrumbItems}
                        showHome={false}
                        className="text-white/80 hover:text-white"
                      />
                    </div>
                    
                    {/* Categories */}
                    {news.categories && news.categories.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {news.categories.map((category) => (
                          <Link
                            key={category._id}
                            href={`/news?category=${category.slug.current}`}
                            className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-emerald-600 text-white hover:bg-emerald-700 transition-colors duration-200"
                          >
                            {category.title}
                          </Link>
                        ))}
                      </div>
                    )}
                    
                    {/* Title */}
                    <h1 className="text-3xl lg:text-5xl font-bold text-white mb-4 leading-tight">
                      {news.title}
                    </h1>
                    
                    {/* Excerpt */}
                    {news.excerpt && (
                      <p className="text-lg text-white/90 mb-6 max-w-3xl leading-relaxed">
                        {news.excerpt}
                      </p>
                    )}
                    
                    {/* Meta Information */}
                    <div className="flex flex-wrap items-center gap-6 text-white/80">
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-4 h-4" />
                        <span className="text-sm">
                          {formatDate(news.publishedAt)}
                        </span>
                      </div>
                      
                      {news.isSticky && (
                        <div className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-yellow-400 rounded-full" />
                          <span className="text-sm font-medium">Featured</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* No Image Header */}
          {!news.featuredImage && (
            <div className="bg-gradient-to-r from-emerald-600 to-emerald-800 py-16">
              <div className="container mx-auto px-4">
                <div className="max-w-4xl">
                  {/* Breadcrumbs */}
                  <div className="mb-6">
                    <Breadcrumbs 
                      items={breadcrumbItems}
                      className="text-white/80 hover:text-white"
                    />
                  </div>
                  
                  {/* Categories */}
                  {news.categories && news.categories.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {news.categories.map((category) => (
                        <Link
                          key={category._id}
                          href={`/news?category=${category.slug.current}`}
                          className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-white/20 text-white hover:bg-white/30 transition-colors duration-200"
                        >
                          {category.title}
                        </Link>
                      ))}
                    </div>
                  )}
                  
                  {/* Title */}
                  <h1 className="text-3xl lg:text-5xl font-bold text-white mb-4 leading-tight">
                    {news.title}
                  </h1>
                  
                  {/* Excerpt */}
                  {news.excerpt && (
                    <p className="text-lg text-white/90 mb-6 max-w-3xl leading-relaxed">
                      {news.excerpt}
                    </p>
                  )}
                  
                  {/* Meta Information */}
                  <div className="flex flex-wrap items-center gap-6 text-white/80">
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4" />
                      <span className="text-sm">
                        {formatDate(news.publishedAt)}
                      </span>
                    </div>
                    
                    {news.isSticky && (
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-yellow-400 rounded-full" />
                        <span className="text-sm font-medium">Featured</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
        
        {/* Main Content */}
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              {/* Article Content */}
              <div className="lg:col-span-3">
                <div className="bg-white rounded-lg shadow-sm p-8">
                  {/* Back Button */}
                  <div className="mb-8">
                    <Link
                      href="/news"
                      className="inline-flex items-center space-x-2 text-emerald-600 hover:text-emerald-700 transition-colors duration-200"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      <span>Back to News</span>
                    </Link>
                  </div>
                  
                  {/* Content */}
                  <div className="prose prose-lg max-w-none">
                    <PortableTextRenderer content={news.content} />
                  </div>
                  
                  {/* Tags */}
                  {news.tags && news.tags.length > 0 && (
                    <div className="mt-12 pt-8 border-t border-gray-200">
                      <div className="flex items-center space-x-2 mb-4">
                        <Tag className="w-4 h-4 text-gray-500" />
                        <span className="text-sm font-medium text-gray-700">Tags:</span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {news.tags.map((tag) => (
                          <span
                            key={tag._id}
                            className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors duration-200"
                          >
                            {tag.title}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Sidebar */}
              <div className="lg:col-span-1">
                {/* Social Share */}
                <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
                  <div className="flex items-center space-x-2 mb-4">
                    <Share2 className="w-4 h-4 text-gray-500" />
                    <span className="text-sm font-medium text-gray-700">Share Article</span>
                  </div>
                  <SocialShare 
                    url={newsUrl}
                    title={news.title}
                    description={news.excerpt || generateExcerpt(news.content)}
                    variant="minimal"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Related News */}
        {relatedNews && relatedNews.length > 0 && (
          <div className="bg-white py-16">
            <div className="container mx-auto px-4">
              <div className="max-w-6xl mx-auto">
                <div className="text-center mb-12">
                  <h2 className="text-3xl font-bold text-gray-900 mb-4">
                    Related News
                  </h2>
                  <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                    Stay informed with more news and updates
                  </p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {relatedNews.map((relatedItem) => (
                    <NewsCard key={relatedItem._id} news={relatedItem} />
                  ))}
                </div>
                
                <div className="text-center mt-12">
                  <Link
                    href="/news"
                    className="inline-flex items-center px-6 py-3 border border-emerald-600 text-emerald-600 font-medium rounded-lg hover:bg-emerald-600 hover:text-white transition-colors duration-200"
                  >
                    View All News
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  )
}

// Loading component
export function NewsPageSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Skeleton */}
      <div className="relative bg-gray-300 animate-pulse h-96 lg:h-[500px]" />
      
      {/* Content Skeleton */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <div className="lg:col-span-3">
              <div className="bg-white rounded-lg shadow-sm p-8">
                <div className="space-y-4">
                  <div className="h-4 bg-gray-200 rounded animate-pulse" />
                  <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4" />
                  <div className="h-4 bg-gray-200 rounded animate-pulse w-1/2" />
                </div>
              </div>
            </div>
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="space-y-3">
                  <div className="h-4 bg-gray-200 rounded animate-pulse" />
                  <div className="h-4 bg-gray-200 rounded animate-pulse w-2/3" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}