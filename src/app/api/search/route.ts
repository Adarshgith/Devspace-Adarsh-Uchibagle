import { NextRequest, NextResponse } from 'next/server'
import { client } from '@/lib/sanity'
import { getSearchQuery } from '@/lib/queries'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get('q')
    const type = searchParams.get('type') // 'blog', 'news', 'events', 'pages', or 'all'
    const limit = parseInt(searchParams.get('limit') || '10')
    
    if (!query || query.trim().length < 2) {
      return NextResponse.json(
        { error: 'Search query must be at least 2 characters long' },
        { status: 400 }
      )
    }
    
    // Sanitize query
    const sanitizedQuery = query.trim().replace(/["']/g, '')
    
    // Build search parameters
    const searchParams_obj = {
      query: sanitizedQuery,
      limit
    }
    
    let results = []
    
    if (type === 'all' || !type) {
      // Search across all content types
      const allResults = await client.fetch(getSearchQuery, searchParams_obj)
      
      // Combine and sort results by relevance
      results = [
        ...allResults.blogs.map((item: any) => ({ ...item, _type: 'blog' })),
        ...allResults.news.map((item: any) => ({ ...item, _type: 'news' })),
        ...allResults.events.map((item: any) => ({ ...item, _type: 'event' })),
        ...allResults.pages.map((item: any) => ({ ...item, _type: 'page' }))
      ]
      
      // Sort by relevance (title matches first, then content matches)
      results.sort((a, b) => {
        const aTitle = a.title.toLowerCase().includes(sanitizedQuery.toLowerCase())
        const bTitle = b.title.toLowerCase().includes(sanitizedQuery.toLowerCase())
        
        if (aTitle && !bTitle) return -1
        if (!aTitle && bTitle) return 1
        
        // If both or neither have title matches, sort by creation date
        return new Date(b._createdAt).getTime() - new Date(a._createdAt).getTime()
      })
      
      // Limit results
      results = results.slice(0, limit)
    } else {
      // Search specific content type
      let typeQuery = ''
      
      switch (type) {
        case 'blog':
          typeQuery = `*[_type == "blog" && (title match "*${sanitizedQuery}*" || pt::text(content) match "*${sanitizedQuery}*")] {
            _id,
            _type,
            title,
            slug,
            excerpt,
            featuredImage,
            publishedAt,
            _createdAt,
            _updatedAt,
            author->{
              name,
              slug
            },
            categories[]->{
              title,
              slug
            }
          } | order(_score desc, publishedAt desc) [0...${limit}]`
          break
          
        case 'news':
          typeQuery = `*[_type == "news" && (title match "*${sanitizedQuery}*" || pt::text(content) match "*${sanitizedQuery}*")] {
            _id,
            _type,
            title,
            slug,
            excerpt,
            featuredImage,
            publishedAt,
            _createdAt,
            _updatedAt,
            categories[]->{
              title,
              slug
            }
          } | order(_score desc, publishedAt desc) [0...${limit}]`
          break
          
        case 'events':
          typeQuery = `*[_type == "event" && (title match "*${sanitizedQuery}*" || pt::text(description) match "*${sanitizedQuery}*")] {
            _id,
            _type,
            title,
            slug,
            excerpt,
            featuredImage,
            startDate,
            endDate,
            location,
            isVirtual,
            eventType,
            _createdAt,
            _updatedAt
          } | order(_score desc, startDate asc) [0...${limit}]`
          break
          
        case 'pages':
          typeQuery = `*[_type == "page" && (title match "*${sanitizedQuery}*" || pt::text(content) match "*${sanitizedQuery}*")] {
            _id,
            _type,
            title,
            slug,
            excerpt,
            featuredImage,
            _createdAt,
            _updatedAt
          } | order(_score desc, _createdAt desc) [0...${limit}]`
          break
          
        default:
          return NextResponse.json(
            { error: 'Invalid search type' },
            { status: 400 }
          )
      }
      
      results = await client.fetch(typeQuery)
    }
    
    // Add search metadata
    const response = {
      query: sanitizedQuery,
      type: type || 'all',
      total: results.length,
      results: results.map((item: any) => ({
        ...item,
        url: getItemUrl(item)
      }))
    }
    
    return NextResponse.json(response, {
      headers: {
        'Cache-Control': 'public, max-age=300, s-maxage=300' // Cache for 5 minutes
      }
    })
    
  } catch (error) {
    console.error('Search API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Helper function to generate URLs for different content types
function getItemUrl(item: any): string {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://example.com'
  
  switch (item._type) {
    case 'blog':
      return `${baseUrl}/blog/${item.slug.current}`
    case 'news':
      return `${baseUrl}/news/${item.slug.current}`
    case 'event':
      return `${baseUrl}/events/${item.slug.current}`
    case 'page':
      return `${baseUrl}/${item.slug.current}`
    default:
      return baseUrl
  }
}

// Handle OPTIONS for CORS
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    }
  })
}