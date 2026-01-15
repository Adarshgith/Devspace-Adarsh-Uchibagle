import PageContent from '@/components/ui/PageContent'
import {
  generateBreadcrumbs,
  generateBreadcrumbsFromSlug,
  generatePageUrl,
  getAllPagePaths,
  getBlockWithHierarchy,
  getChildPages,
  resolvePageByPath,
  type BreadcrumbItem,
  type HierarchicalPage
} from '@/lib/pageHierarchy'
import {
  getSiteSettings,
  homePageQuery
} from '@/lib/queries'
import { client, urlFor } from '@/lib/sanity'
import { generateExcerpt } from '@/lib/utils'
import { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'

interface CustomPageProps {
  params: {
    slug?: string[]
  }
}

// Generate metadata for SEO
export async function generateMetadata({ params }: CustomPageProps): Promise<Metadata> {
  const resolvedParams = await params
  const slug = resolvedParams.slug ? resolvedParams.slug.join('/') : ''

  // Handle root route - fetch home page from Sanity
  let page: HierarchicalPage | null = null

  if (slug === '' || slug === '/' || !slug) {
    page = await client.fetch(homePageQuery)
  } else {
    // Try hierarchical page resolution first
    page = await resolvePageByPath(slug)

    console.log(`Resolved page for slug "${slug}":`, page)

    // Fallback to blocks if no page found
    if (!page) {
      const block = await getBlockWithHierarchy(slug)
      if (block) {
        page = {
          ...block,
          featuredImage: null,
          content: block.mainContent,
          sections: null,
          heroSection: null,
          mainContent: block.mainContent
        }
      }
    }
  }

  const siteSettings = await client.fetch(getSiteSettings)

  if (!page) {
    return {
      title: 'Page Not Found',
      description: 'The requested page could not be found.'
    }
  }

  const title = page.seo?.seoTitle || page.title
  const description = page.seo?.seoDescription || page.excerpt || generateExcerpt(page.content)
  const siteName = siteSettings?.title || 'Agency Website'
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://example.com'
  const pageUrl = page.seo?.pagePath || generatePageUrl(page)

  return {
    title: `${title} | ${siteName}`,
    description,
    keywords: page.seo?.focusKeyword,
    openGraph: {
      title,
      description,
      type: 'website',
      url: `${siteUrl}${pageUrl}`,
      siteName,
      images: page.featuredImage ? [
        {
          url: urlFor(page.featuredImage).width(1200).height(630).url(),
          width: 1200,
          height: 630,
          alt: page.featuredImage.alt || page.title
        }
      ] : []
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: page.featuredImage ? [
        urlFor(page.featuredImage).width(1200).height(630).url()
      ] : []
    },
    alternates: {
      canonical: page.seo?.canonicalUrl || `${siteUrl}${pageUrl}`
    }
  }
}

// Generate static params for static generation
export async function generateStaticParams() {
  try {
    const { pages, blocks } = await getAllPagePaths()
    const allContent = [...pages, ...blocks]

    return allContent
      .filter((item: any) => {
        // Use pagePath if available, otherwise fall back to slug
        const path = item.seo?.pagePath || item.slug?.current
        if (!path || path === '' || path === '/' || path === 'home') {
          return false
        }

        // Filter out reserved Next.js routes
        const reservedRoutes = ['blog', 'news', 'events', 'search', 'api']
        const firstSegment = path.split('/')[1] || path.split('/')[0] // Handle leading slash
        return !reservedRoutes.includes(firstSegment)
      })
      .map((item: any) => {
        // Use pagePath if available for hierarchical paths
        const path = item.seo?.pagePath || item.slug?.current
        const slugParts = path.startsWith('/')
          ? path.slice(1).split('/').filter(Boolean)
          : path.split('/').filter(Boolean)

        return {
          slug: slugParts
        }
      })
  } catch (error) {
    console.error('Error generating static params:', error)
    return []
  }
}

export default async function CustomPage({ params }: CustomPageProps) {
  const resolvedParams = await params
  const slug = resolvedParams.slug ? resolvedParams.slug.join('/') : ''

  // Handle root route - fetch home page from Sanity
  const isHomePage = !slug || slug === '' || slug === '/'

  // Prevent catching reserved routes (but allow home page)
  if (!isHomePage) {
    const reservedRoutes = ['blog', 'news', 'events', 'search', 'api']
    const firstSegment = slug.split('/')[0]
    if (reservedRoutes.includes(firstSegment)) {
      notFound()
    }
  }

  // Fetch page with hierarchical data
  let page: HierarchicalPage | null = null
  let isBlockContent = false

  if (isHomePage) {
    page = await client.fetch(homePageQuery)
  } else {
    // Try hierarchical page resolution first
    page = await resolvePageByPath(slug)

    console.log(`Resolved page for slug 2"${slug}":`, page)

    // Debug: Check if sections exist and what they contain
    console.log('Page sections:', page?.sections)
    console.log('Page content:', page?.content)
    if (page?.sections && page.sections.length > 0) {
      console.log('First section:', page.sections[0])
      if (page.sections[0]?.rows) {
        console.log('First section rows:', page.sections[0].rows)
      }
    }

    // Fallback to blocks if no page found
    if (!page) {
      const block = await getBlockWithHierarchy(slug)
      if (block) {
        page = {
          ...block,
          featuredImage: null,
          content: block.mainContent,
          sections: null,
          heroSection: null,
          mainContent: block.mainContent
        }
        isBlockContent = true
      }
    }
  }

  const siteSettings = await client.fetch(getSiteSettings)

  if (!page) {
    notFound()
  }

  // Generate breadcrumbs using hierarchical data
  let breadcrumbItems: BreadcrumbItem[]

  if (isHomePage) {
    breadcrumbItems = [] // No breadcrumbs on home page
  } else if (page.seo?.parentPage) {
    // Use hierarchical breadcrumb generation
    breadcrumbItems = generateBreadcrumbs(page)
  } else {
    // Fallback to slug-based breadcrumbs
    breadcrumbItems = generateBreadcrumbsFromSlug(slug, page.title)
  }

  // Get child pages for navigation (if any)
  const childPages = !isHomePage && !isBlockContent ? await getChildPages(page._id) : []

  return (
    <>
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'WebPage',
            name: page.title,
            description: page.excerpt || generateExcerpt(page.content),
            url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://example.com'}${page.seo?.pagePath || generatePageUrl(page)}`,
            image: page.featuredImage ? [
              urlFor(page.featuredImage).width(1200).height(630).url()
            ] : [],
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
              '@id': `${process.env.NEXT_PUBLIC_SITE_URL || 'https://example.com'}${page.seo?.pagePath || generatePageUrl(page)}`
            },
            breadcrumb: {
              '@type': 'BreadcrumbList',
              itemListElement: breadcrumbItems.map((item, index) => ({
                '@type': 'ListItem',
                position: index + 1,
                name: item.label,
                item: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://example.com'}${item.href}`
              }))
            }
          })
        }}
      />

      <div className="min-h-screen bg-gray-50">
        <div className="relative bg-white">
          {/* {page.featuredImage && (
            <div className="relative h-96 lg:h-[500px] overflow-hidden">
              <Image
                src={urlFor(page.featuredImage).width(1920).height(1080).url()}
                alt={page.featuredImage.alt || page.title}
                fill
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-black bg-opacity-40" />
              <div className="absolute inset-0 flex items-end">
                <div className="container mx-auto px-4 pb-12">
                  <div className="max-w-4xl">
                    {breadcrumbItems.length > 0 && (
                      <div className="mb-6">
                        <Breadcrumbs
                          items={breadcrumbItems}
                          className="text-white/80 hover:text-white"
                          showHome={false}
                        />
                      </div>
                    )}
                    <h1 className="text-3xl lg:text-5xl font-bold text-white mb-4 leading-tight">
                      {page.title}
                    </h1>
                    {page.excerpt && (
                      <p className="text-lg text-white/90 mb-6 max-w-3xl leading-relaxed">
                        {page.excerpt}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )} */}

          {/* No Image Header */}
          {/* {!page.featuredImage && (
            <div className="bg-gradient-to-r from-blue-600 to-blue-800 py-16">
              <div className="container mx-auto px-4">
                <div className="max-w-4xl mx-auto text-center">
                  {breadcrumbItems.length > 0 && (
                    <div className="mb-6">
                      <Breadcrumbs
                        items={breadcrumbItems}
                        className="text-white/80 hover:text-white justify-center"
                        showHome={false}
                      />
                    </div>
                  )}

                  <h1 className="text-3xl lg:text-5xl font-bold text-white mb-4 leading-tight">
                    {page.title}
                  </h1>
                  {page.excerpt && (
                    <p className="text-lg text-white/90 mb-6 max-w-3xl mx-auto leading-relaxed">
                      {page.excerpt}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )} */}
        </div>

        {/* Main Content */}
        <div className="">
          <div className={`maincontent w-full`}>
            {/* Page Content - Handle both sections and main content */}
            {page?.mainContent?.rows?.map((row: any, index: number) => (
              <div key={index} id={`section-${index}`}>
                <PageContent
                  key={index}
                  rows={[row]}
                />
              </div>
            ))}

            {/* Child Pages Navigation */}
            {childPages.length > 0 && (
              <div className="mt-16">
                <div className="bg-white rounded-lg shadow-sm p-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Related Pages</h2>
                  <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {childPages.map((child) => {
                      const childUrl = child.seo?.pagePath || `/${child.slug.current}`
                      return (
                        <div key={child._id} className="group">
                          <Link
                            href={childUrl}
                            className="block p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-md transition-all duration-200"
                          >
                            {child.featuredImage && (
                              <div className="relative h-32 mb-3 overflow-hidden rounded">
                                <Image
                                  src={urlFor(child.featuredImage).width(400).height(200).url()}
                                  alt={child.featuredImage.alt || child.title}
                                  fill
                                  className="object-cover group-hover:scale-105 transition-transform duration-200"
                                />
                              </div>
                            )}
                            <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                              {child.title}
                            </h3>
                            {child.excerpt && (
                              <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                                {child.excerpt}
                              </p>
                            )}
                          </Link>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}

// Loading component
export function CustomPageSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Skeleton */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="h-12 bg-white/20 rounded animate-pulse mb-6 mx-auto max-w-md" />
            <div className="h-6 bg-white/20 rounded animate-pulse mb-8 mx-auto max-w-lg" />
          </div>
        </div>
      </div>

      {/* Content Skeleton */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-sm p-8">
            <div className="space-y-4">
              <div className="h-4 bg-gray-200 rounded animate-pulse" />
              <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4" />
              <div className="h-4 bg-gray-200 rounded animate-pulse w-1/2" />
              <div className="h-4 bg-gray-200 rounded animate-pulse w-5/6" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
