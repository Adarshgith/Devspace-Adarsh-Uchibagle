import {useState, useEffect} from 'react'
import {DocumentActionProps, useDocumentOperation, useValidationStatus} from 'sanity'
import { createClient } from '@sanity/client'

const SANITY_STUDIO_PROJECT_ID = import.meta.env.SANITY_STUDIO_PROJECT_ID;
const SANITY_STUDIO_API_DATASET = import.meta.env.SANITY_STUDIO_API_DATASET || 'production';
const SANITY_STUDIO_API_TOKEN = import.meta.env.SANITY_STUDIO_API_TOKEN;

const sanityClientConfig = {
  projectId: SANITY_STUDIO_PROJECT_ID,
  dataset: SANITY_STUDIO_API_DATASET,
  token: SANITY_STUDIO_API_TOKEN,
  apiVersion: '2025-02-14',
  ignoreBrowserTokenWarning: true,
  useCdn: false,
} 
const client = createClient(sanityClientConfig)

/**
 * Normalize a given path:
 *  - Ensures a leading '/'
 *  - Removes any trailing '/' to avoid duplicates.
 */
function normalizePath(path: any) {
  if (!path) return ''
  // Ensure it starts with a '/'
  if (!path.startsWith('/')) {
    path = '/' + path
  }
  // Remove trailing slash if present
  return path.replace(/\/+$/, '')
}

/**
 * Recursively update child page paths.
 * For each child page, append its slug to the new base path.
 */
const updateChildPagePaths = async (basePageId: any, newBasePath: any) => {
  // Query to get all direct children of the current page/blocks (both page and blocks can be children)
  const childrenQuery = `*[(_type=='page' || _type=='blocks') && seo.parentPage._ref == $basePageId]{
    _id,
    _type,
    slug,
    "currentPagePath": seo.pagePath
  }`
  
  try {
    const childPages = await client.fetch(childrenQuery, { basePageId })
    
    if (childPages && childPages.length > 0) {
      //console.log(`Found ${childPages.length} child pages for ${basePageId}`)
      
      const updatePromises = childPages.map(async (childPage: any) => {
        // Determine the path ending: use custom ending if different from slug, otherwise use slug
        let pathEnding = childPage.slug.current // Default to slug
        
        if (childPage.currentPagePath) {
          // Extract the last segment from the current pagePath
          const pathSegments = childPage.currentPagePath.replace(/^\/+|\/+$/g, '').split('/')
          if (pathSegments.length > 0) {
            const lastSegment = pathSegments[pathSegments.length - 1]
            // If the last segment is different from slug, use it as the custom ending
            if (lastSegment !== childPage.slug.current) {
              pathEnding = lastSegment
            }
          }
        }
        
        // Build new path: parent's path + child's custom ending (or slug)
        const normalizedBase = normalizePath(newBasePath)
        const newChildPath = normalizedBase 
          ? `${normalizedBase}/${pathEnding}`
          : `/${pathEnding}`
        
        // Only update if the path has actually changed
        if (newChildPath !== childPage.currentPagePath) {
          //console.log(`Updating child ${childPage._id} from ${childPage.currentPagePath} to ${newChildPath}`)
          
          try {
            // Update the child page's pagePath
            await client
              .patch(childPage._id)
              .set({ 'seo.pagePath': newChildPath })
              .commit()
            
            // Recursively update this child's children
            await updateChildPagePaths(childPage._id, newChildPath)
          } catch (err: unknown) {
            console.error(`Failed to update child page ${childPage._id}:`, err instanceof Error ? err.message : String(err))
          }
        } else {
          // Even if this child's path didn't change, we still need to check its children
          // in case the structure changed somewhere up the hierarchy
          await updateChildPagePaths(childPage._id, newChildPath)
        }
      })
      
      await Promise.all(updatePromises)
    }
  } catch (error) {
    console.error('Error in updateChildPagePaths:', error)
  }
}

export default function SetSlugAndPublishAction(props: any) {
  const { isValidating, validation } = useValidationStatus(props.id, props.type)
  const [canPublish, allowPublish] = useState(false)
  const { patch, publish } = useDocumentOperation(props.id, props.type)
  const [isPublishing, setIsPublishing] = useState(false)

  useEffect(() => {
    if (publish.disabled) {
      allowPublish(false)
      return
    }
    if (!isValidating) {
      allowPublish(validation.length === 0)
    }
    if (isPublishing && !props.draft) {
      setIsPublishing(false)
    }
  }, [publish.disabled, isValidating, props.draft])

  return {
    disabled: !canPublish,
    label: isPublishing ? 'Publishing...' : 'Publish',
    onHandle: async () => {
      setIsPublishing(true)
      
      // Generate the slug from the draft's slug field or title
      const slug =
        props.draft.slug?.current ||
        props.draft.title?.toLowerCase().replace(/\s+/g, '-').slice(0, 200)

      if (props.type === 'page') {
        // Get current published slug to compare with new slug
        const currentSlug = props.published?.slug?.current
        const newSlug = slug
        const hasSlugChanged = currentSlug !== newSlug
        const hasExistingPagePath = props.published?.seo?.pagePath || props.draft?.seo?.pagePath
        
        // Check if parent page reference has changed
        const currentParentRef = props.published?.seo?.parentPage?._ref
        const newParentRef = props.draft?.seo?.parentPage?._ref
        const hasParentChanged = currentParentRef !== newParentRef
        
        // Get the current custom endpoint (last segment of pagePath)
        let customEndpoint = slug // Default to slug
        if (props.draft?.seo?.pagePath || props.published?.seo?.pagePath) {
          const currentPagePath = props.draft?.seo?.pagePath || props.published?.seo?.pagePath
          const pathSegments = currentPagePath.replace(/^\/+|\/+$/g, '').split('/')
          if (pathSegments.length > 0) {
            customEndpoint = pathSegments[pathSegments.length - 1]
          }
        }
        
        // Track the current published pagePath to detect changes
        const currentPublishedPagePath = props.published?.seo?.pagePath
        let finalPagePath = null
        
        // CASE 1: New document (no existing pagePath) OR slug changed
        if (!hasExistingPagePath || hasSlugChanged) {
          let fullPath = `/${slug}` // Use new slug as endpoint
          
          // Check if this page has a parent
          if (props.draft.seo?.parentPage?._ref) {
            const parentQuery = '*[_id == $parentId][0]{ "pagePath": seo.pagePath }'
            const parentQueryParams = { parentId: props.draft.seo.parentPage._ref }
            
            try {
              const parentPage = await client.fetch(parentQuery, parentQueryParams)
              if (parentPage?.pagePath) {
                const normalizedParentPath = normalizePath(parentPage.pagePath)
                fullPath = `${normalizedParentPath}/${slug}`
              }
            } catch (error) {
              console.error('Error fetching parent page:', error)
              fullPath = `/${slug}`
            }
          }

          finalPagePath = fullPath

          // Update both slug and pagePath
          patch.execute([
            {
              set: {
                slug: { _type: 'slug', current: slug },
                'seo.pagePath': fullPath,
              },
            },
          ])
        } 
        // CASE 2: Parent changed (preserve custom endpoint)
        else if (hasParentChanged) {
          let fullPath = `/${customEndpoint}` // Preserve current endpoint
          
          if (props.draft.seo?.parentPage?._ref) {
            const parentQuery = '*[_id == $parentId][0]{ "pagePath": seo.pagePath }'
            const parentQueryParams = { parentId: props.draft.seo.parentPage._ref }
            
            try {
              const parentPage = await client.fetch(parentQuery, parentQueryParams)
              if (parentPage?.pagePath) {
                const normalizedParentPath = normalizePath(parentPage.pagePath)
                fullPath = `${normalizedParentPath}/${customEndpoint}`
              }
            } catch (error) {
              console.error('Error fetching parent page:', error)
              fullPath = `/${customEndpoint}`
            }
          }

          finalPagePath = fullPath

          // Update only pagePath (preserve slug and custom endpoint)
          patch.execute([
            {
              set: {
                'seo.pagePath': fullPath,
              },
            },
          ])
        } 
        // CASE 3: Check if pagePath was manually changed in the draft
        else if (props.draft?.seo?.pagePath && props.draft.seo.pagePath !== currentPublishedPagePath) {
          finalPagePath = props.draft.seo.pagePath
        }
        
        // Update all children if pagePath changed (for any reason)
        if (finalPagePath && finalPagePath !== currentPublishedPagePath) {
          await updateChildPagePaths(props.id, finalPagePath)
        }
        
      } else if (props.type === 'blocks') {
        // Get current published slug to compare with new slug
        const currentSlug = props.published?.slug?.current
        const newSlug = slug
        const hasSlugChanged = currentSlug !== newSlug
        const hasExistingPagePath = props.published?.seo?.pagePath || props.draft?.seo?.pagePath
        
        // Check if parent page reference has changed
        const currentParentRef = props.published?.seo?.parentPage?._ref
        const newParentRef = props.draft?.seo?.parentPage?._ref
        const hasParentChanged = currentParentRef !== newParentRef
        
        // Get the current custom endpoint (last segment of pagePath)
        let customEndpoint = slug // Default to slug
        if (props.draft?.seo?.pagePath || props.published?.seo?.pagePath) {
          const currentPagePath = props.draft?.seo?.pagePath || props.published?.seo?.pagePath
          const pathSegments = currentPagePath.replace(/^\/+|\/+$/g, '').split('/')
          if (pathSegments.length > 0) {
            customEndpoint = pathSegments[pathSegments.length - 1]
          }
        }
        
        // Track the current published pagePath to detect changes
        const currentPublishedPagePath = props.published?.seo?.pagePath
        let finalPagePath = null
        
        // CASE 1: New document (no existing pagePath) OR slug changed
        if (!hasExistingPagePath || hasSlugChanged) {
          let fullPath = `/${slug}` // Use new slug as endpoint
          
          // Check if this blocks has a parent (can be page or blocks)
          if (props.draft.seo?.parentPage?._ref) {
            const parentQuery = '*[_id == $parentId][0]{ "pagePath": seo.pagePath }'
            const parentQueryParams = { parentId: props.draft.seo.parentPage._ref }
            
            try {
              const parentPage = await client.fetch(parentQuery, parentQueryParams)
              if (parentPage?.pagePath) {
                const normalizedParentPath = normalizePath(parentPage.pagePath)
                fullPath = `${normalizedParentPath}/${slug}`
              }
            } catch (error) {
              console.error('Error fetching parent page:', error)
              fullPath = `/${slug}`
            }
          }

          finalPagePath = fullPath

          // Update both slug and pagePath
          patch.execute([
            {
              set: {
                slug: { _type: 'slug', current: slug },
                'seo.pagePath': fullPath,
              },
            },
          ])
        } 
        // CASE 2: Parent changed (preserve custom endpoint)
        else if (hasParentChanged) {
          let fullPath = `/${customEndpoint}` // Preserve current endpoint
          
          if (props.draft.seo?.parentPage?._ref) {
            const parentQuery = '*[_id == $parentId][0]{ "pagePath": seo.pagePath }'
            const parentQueryParams = { parentId: props.draft.seo.parentPage._ref }
            
            try {
              const parentPage = await client.fetch(parentQuery, parentQueryParams)
              if (parentPage?.pagePath) {
                const normalizedParentPath = normalizePath(parentPage.pagePath)
                fullPath = `${normalizedParentPath}/${customEndpoint}`
              }
            } catch (error) {
              console.error('Error fetching parent page:', error)
              fullPath = `/${customEndpoint}`
            }
          }

          finalPagePath = fullPath

          // Update only pagePath (preserve slug and custom endpoint)
          patch.execute([
            {
              set: {
                'seo.pagePath': fullPath,
              },
            },
          ])
        } 
        // CASE 3: Check if pagePath was manually changed in the draft
        else if (props.draft?.seo?.pagePath && props.draft.seo.pagePath !== currentPublishedPagePath) {
          finalPagePath = props.draft.seo.pagePath
        }
        
        // Update all children if pagePath changed (for any reason)
        if (finalPagePath && finalPagePath !== currentPublishedPagePath) {
          await updateChildPagePaths(props.id, finalPagePath)
        }
        
      } else if (slug) {
        // For other types, update only the slug field
        patch.execute([
          {
            set: {
              slug: { _type: 'slug', current: slug },
            },
          },
        ])
      }

      // Execute the publish operation
      publish.execute()
      props.onComplete()
    },
  }
}