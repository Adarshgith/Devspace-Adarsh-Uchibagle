import { NextRequest, NextResponse } from 'next/server'
import { client } from './lib/sanity'
import { groq } from 'next-sanity'

// Define routes that should be handled by middleware
// const DYNAMIC_ROUTES = [
//   '/blog',
//   '/events', 
//   '/news',
//   '/pages'
// ]

// Query to check if a page exists in Sanity (including hierarchical paths)
const pageExistsQuery = groq`
  *[
    (_type == "page" && (slug.current == $slug || seo.pagePath == $slug)) ||
    (_type == "blocks" && (slug.current == $slug || seo.pagePath == $slug)) ||
    (_type == "blogs" && slug.current == $slug) ||
    (_type == "events" && slug.current == $slug) ||
    (_type == "news" && slug.current == $slug)
  ][0] {
    _type,
    slug,
    noIndex,
    seo {
      pagePath
    }
  }
`

// Query to check hierarchical page paths
const hierarchicalPageQuery = groq`
  *[
    (_type == "page" && seo.pagePath == $path) ||
    (_type == "blocks" && seo.pagePath == $path)
  ][0] {
    _type,
    slug,
    seo {
      pagePath
    }
  }
`

// Common redirects mapping
const REDIRECTS: Record<string, string> = {
  '/blog.html': '/blog',
  '/events.html': '/events',
  '/news.html': '/news',
  '/contact.html': '/contact',
  '/about.html': '/about',
  '/services.html': '/services',
  // Add more redirects as needed
}

// Simple in-memory cache for page existence checks
const pageCache = new Map<string, { exists: boolean; type: string; timestamp: number }>()
const CACHE_TTL = 5 * 60 * 1000 // 5 minutes

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const url = request.nextUrl.clone()

  // Handle static redirects first
  if (REDIRECTS[pathname]) {
    url.pathname = REDIRECTS[pathname]
    return NextResponse.redirect(url, 301)
  }

  // Handle trailing slashes - redirect to non-trailing slash version
  if (pathname.endsWith('/') && pathname !== '/') {
    url.pathname = pathname.slice(0, -1)
    return NextResponse.redirect(url, 301)
  }

  // Handle www redirect - redirect www to non-www
  if (request.headers.get('host')?.startsWith('www.')) {
    const newHost = request.headers.get('host')?.replace('www.', '')
    url.host = newHost || url.host
    return NextResponse.redirect(url, 301)
  }

  // Skip middleware for API routes, static files, and Next.js internals
  if (
    pathname.startsWith('/api/') ||
    pathname.startsWith('/_next/') ||
    pathname.startsWith('/studio') ||
    pathname.includes('.') ||
    pathname.startsWith('/favicon') ||
    pathname.startsWith('/robots') ||
    pathname.startsWith('/sitemap')
  ) {
    return NextResponse.next()
  }

  // Handle dynamic content routing
  try {
    // Extract potential slug from pathname
    const segments = pathname.split('/').filter(Boolean)
    
    if (segments.length === 0) {
      // Root path - continue normally
      return NextResponse.next()
    }

    // Helper function to check page existence with caching
    async function checkPageExists(slug: string, expectedType?: string) {
      const cacheKey = `${slug}:${expectedType || 'any'}`
      const cached = pageCache.get(cacheKey)
      
      // Return cached result if still valid
      if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
        return cached.exists ? { _type: cached.type, slug: { current: slug } } : null
      }
      
      try {
        // Add timeout to prevent hanging requests
        const timeoutPromise = new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Request timeout')), 3000)
        )
        
        const fetchPromise = client.fetch(pageExistsQuery, { slug })
        const page = await Promise.race([fetchPromise, timeoutPromise]) as any
        
        // Cache the result
        pageCache.set(cacheKey, {
          exists: !!page,
          type: page?._type || '',
          timestamp: Date.now()
        })
        
        return page
      } catch (error) {
        console.warn(`Failed to check page existence for ${slug}:`, error)
        // Cache negative result for shorter time on error
        pageCache.set(cacheKey, {
          exists: false,
          type: '',
          timestamp: Date.now() - (CACHE_TTL - 30000) // Cache for 30 seconds on error
        })
        return null
      }
    }

    // Check for blog posts: /blog/[slug]
    if (segments[0] === 'blog' && segments.length === 2) {
      const slug = segments[1]
      const page = await checkPageExists(slug, 'blogs')
      
      if (page && page._type === 'blogs') {
        // Already at correct path, continue
        return NextResponse.next()
      }
    }

    // Check for event posts: /events/[slug]
    if (segments[0] === 'events' && segments.length === 2) {
      const slug = segments[1]
      const page = await checkPageExists(slug, 'events')
      
      if (page && page._type === 'events') {
        // Already at correct path, continue
        return NextResponse.next()
      }
    }

    // Check for news posts: /news/[slug]
    if (segments[0] === 'news' && segments.length === 2) {
      const slug = segments[1]
      const page = await checkPageExists(slug, 'news')
      
      if (page && page._type === 'news') {
        // Already at correct path, continue
        return NextResponse.next()
      }
    }

    // Check for hierarchical pages and blocks: /[...slug]
    const fullPath = pathname
    const slug = segments.join('/')
    
    // Skip if it's a known static route
    const staticRoutes = ['blog', 'events', 'news', 'contact', 'about', 'services', 'search', 'api']
    if (segments.length === 1 && staticRoutes.includes(segments[0])) {
      return NextResponse.next()
    }
    
    // Helper function to check hierarchical page existence
    async function checkHierarchicalPage(path: string) {
      const cacheKey = `hierarchical:${path}`
      const cached = pageCache.get(cacheKey)
      
      if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
        return cached.exists ? { _type: cached.type, seo: { pagePath: path } } : null
      }
      
      try {
        const timeoutPromise = new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Request timeout')), 3000)
        )
        
        const fetchPromise = client.fetch(hierarchicalPageQuery, { path })
        const page = await Promise.race([fetchPromise, timeoutPromise]) as any
        
        pageCache.set(cacheKey, {
          exists: !!page,
          type: page?._type || '',
          timestamp: Date.now()
        })
        
        return page
      } catch (error) {
        console.warn(`Failed to check hierarchical page for ${path}:`, error)
        pageCache.set(cacheKey, {
          exists: false,
          type: '',
          timestamp: Date.now() - (CACHE_TTL - 30000)
        })
        return null
      }
    }
    
    // First, try to find by exact hierarchical path
    let page = await checkHierarchicalPage(fullPath)
    
    // If not found, try by slug (for single-level pages)
    if (!page && segments.length === 1) {
      page = await checkPageExists(slug, 'page')
    }
    
    // If still not found, try blocks
    if (!page) {
      page = await checkPageExists(slug, 'blocks')
    }
    
    if (page && (page._type === 'page' || page._type === 'blocks')) {
      // Page exists, continue to dynamic route handler
      return NextResponse.next()
    }

    // If no matching content found, continue to 404
    return NextResponse.next()

  } catch (error) {
    console.error('Middleware error:', error)
    // On error, continue to the original request to prevent blocking
    return NextResponse.next()
  }
}

// Configure which paths the middleware should run on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - studio (Sanity Studio)
     * - public files (images, etc.)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|studio|.*\\.).*)',
  ],
}