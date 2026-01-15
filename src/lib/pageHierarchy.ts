import { client } from '@/lib/sanity'
import { 
  pageWithHierarchyQuery, 
  getChildPagesQuery, 
  getPageBreadcrumbsQuery,
  blockBySlugQuery,
  getAllPagePathsQuery
} from '@/lib/queries'

// Types for hierarchical page structure
export interface HierarchicalPage {
  _id: string
  title: string
  slug: { current: string }
  excerpt?: string
  featuredImage?: any
  content?: any
  sections?: any[]
  heroSection?: any
  mainContent?: any
  seo?: {
    pagePath?: string
    parentPage?: HierarchicalPage
    focusKeyword?: string
    seoTitle?: string
    seoDescription?: string
    canonicalUrl?: string
  }
  showSocialShare?: boolean
  noIndex?: boolean
  include_in_sitemap?: boolean
}

export interface BreadcrumbItem {
  label: string
  href: string
  isCurrentPage?: boolean
}

export interface ChildPage {
  _id: string
  title: string
  slug: { current: string }
  excerpt?: string
  featuredImage?: any
  seo?: {
    pagePath?: string
  }
}

/**
 * Fetch a page with full hierarchy information
 */
export async function getPageWithHierarchy(slug: string): Promise<HierarchicalPage | null> {
  try {
    const page = await client.fetch(pageWithHierarchyQuery, { slug })
    return page || null
  } catch (error) {
    console.error('Error fetching page with hierarchy:', error)
    return null
  }
}

/**
 * Fetch a block with hierarchy information
 */
export async function getBlockWithHierarchy(slug: string): Promise<any | null> {
  try {
    const block = await client.fetch(blockBySlugQuery, { slug })
    return block || null
  } catch (error) {
    console.error('Error fetching block with hierarchy:', error)
    return null
  }
}

/**
 * Generate breadcrumbs from a hierarchical page
 */
export function generateBreadcrumbs(page: HierarchicalPage): BreadcrumbItem[] {
  const breadcrumbs: BreadcrumbItem[] = []
  
  // Always start with home
  breadcrumbs.push({
    label: 'Home',
    href: '/'
  })
  
  // Build breadcrumb chain from parent hierarchy
  const buildParentChain = (currentPage: HierarchicalPage): HierarchicalPage[] => {
    const chain: HierarchicalPage[] = []
    let parent = currentPage.seo?.parentPage
    
    while (parent) {
      chain.unshift(parent)
      parent = parent.seo?.parentPage
    }
    
    return chain
  }
  
  const parentChain = buildParentChain(page)
  
  // Add parent pages to breadcrumbs
  parentChain.forEach(parent => {
    const href = parent.seo?.pagePath || `/${parent.slug.current}`
    breadcrumbs.push({
      label: parent.title,
      href
    })
  })
  
  // Add current page
  const currentHref = page.seo?.pagePath || `/${page.slug.current}`
  breadcrumbs.push({
    label: page.title,
    href: currentHref,
    isCurrentPage: true
  })
  
  return breadcrumbs
}

/**
 * Generate breadcrumbs from slug path (fallback method)
 */
export function generateBreadcrumbsFromSlug(slug: string, pageTitle?: string): BreadcrumbItem[] {
  const breadcrumbs: BreadcrumbItem[] = [
    { label: 'Home', href: '/' }
  ]
  
  if (!slug || slug === '' || slug === '/') {
    return breadcrumbs
  }
  
  const parts = slug.split('/').filter(Boolean)
  let currentPath = ''
  
  parts.forEach((part, index) => {
    currentPath += `/${part}`
    const isLast = index === parts.length - 1
    
    breadcrumbs.push({
      label: isLast && pageTitle ? pageTitle : part.charAt(0).toUpperCase() + part.slice(1).replace(/-/g, ' '),
      href: currentPath,
      isCurrentPage: isLast
    })
  })
  
  return breadcrumbs
}

/**
 * Get child pages for a given parent page ID
 */
export async function getChildPages(parentId: string): Promise<ChildPage[]> {
  try {
    const children = await client.fetch(getChildPagesQuery, { parentId })
    return children || []
  } catch (error) {
    console.error('Error fetching child pages:', error)
    return []
  }
}

/**
 * Get all page paths for static generation
 */
export async function getAllPagePaths(): Promise<{ pages: any[], blocks: any[] }> {
  try {
    const result = await client.fetch(getAllPagePathsQuery)
    return {
      pages: result.pages || [],
      blocks: result.blocks || []
    }
  } catch (error) {
    console.error('Error fetching all page paths:', error)
    return { pages: [], blocks: [] }
  }
}

/**
 * Resolve page by path (handles both slug and pagePath)
 */
export async function resolvePageByPath(path: string): Promise<HierarchicalPage | null> {
  // Try to find by pagePath first (for hierarchical paths)
  let page = await getPageWithHierarchy(path)
  
  if (!page) {
    // Try to find by slug as fallback
    const slugPath = path.split('/').pop() || path
    page = await getPageWithHierarchy(slugPath)
  }
  
  return page
}

/**
 * Get page ancestors (parent chain)
 */
export function getPageAncestors(page: HierarchicalPage): HierarchicalPage[] {
  const ancestors: HierarchicalPage[] = []
  let parent = page.seo?.parentPage
  
  while (parent) {
    ancestors.unshift(parent)
    parent = parent.seo?.parentPage
  }
  
  return ancestors
}

/**
 * Get page depth in hierarchy
 */
export function getPageDepth(page: HierarchicalPage): number {
  let depth = 0
  let parent = page.seo?.parentPage
  
  while (parent) {
    depth++
    parent = parent.seo?.parentPage
  }
  
  return depth
}

/**
 * Check if page is descendant of another page
 */
export function isDescendantOf(page: HierarchicalPage, ancestorId: string): boolean {
  let parent = page.seo?.parentPage
  
  while (parent) {
    if (parent._id === ancestorId) {
      return true
    }
    parent = parent.seo?.parentPage
  }
  
  return false
}

/**
 * Generate page URL from hierarchy
 */
export function generatePageUrl(page: HierarchicalPage): string {
  // Use pagePath if available (automatically generated)
  if (page.seo?.pagePath) {
    return page.seo.pagePath
  }
  
  // Fallback to building URL from hierarchy
  const ancestors = getPageAncestors(page)
  const pathParts = ancestors.map(ancestor => ancestor.slug.current)
  pathParts.push(page.slug.current)
  
  return '/' + pathParts.join('/')
}

/**
 * Get sibling pages (pages with same parent)
 */
export async function getSiblingPages(page: HierarchicalPage): Promise<ChildPage[]> {
  if (!page.seo?.parentPage) {
    // If no parent, get all root level pages
    try {
      const rootPages = await client.fetch(`
        *[_type == "page" && !defined(seo.parentPage)] | order(title asc) {
          _id,
          title,
          slug,
          excerpt,
          "featuredImage": heroSection.backgroundImage,
          seo {
            pagePath
          }
        }
      `)
      return rootPages.filter((p: any) => p._id !== page._id) || []
    } catch (error) {
      console.error('Error fetching root pages:', error)
      return []
    }
  }
  
  const siblings = await getChildPages(page.seo.parentPage._id)
  return siblings.filter(sibling => sibling._id !== page._id)
}