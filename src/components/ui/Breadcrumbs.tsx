'use client'

import { ChevronRight, Home } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface BreadcrumbItem {
  label: string
  href: string
  isCurrentPage?: boolean
  current?: boolean // Keep for backward compatibility
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[]
  className?: string
  separator?: React.ReactNode
  showHome?: boolean
  homeLabel?: string
  homeHref?: string
}

export default function Breadcrumbs({
  items,
  className,
  separator,
  showHome = true,
  homeLabel = 'Home',
  homeHref = '/'
}: BreadcrumbsProps) {
  // Prepare breadcrumb items with home
  const breadcrumbItems = showHome 
    ? [{ label: homeLabel, href: homeHref }, ...items]
    : items
  
  // Don't render if only home item
  if (breadcrumbItems.length <= 1 && showHome) {
    return null
  }
  
  return (
    <nav 
      className={cn('flex items-center space-x-1 text-sm', className)}
      aria-label="Breadcrumb"
    >
      <ol className="flex items-center space-x-1">
        {breadcrumbItems.map((item, index) => {
          const isLast = index === breadcrumbItems.length - 1
          const isHome = index === 0 && showHome
          const isCurrent = item.isCurrentPage || item.current || isLast
          
          return (
            <li key={index} className="flex items-center">
              {/* Separator */}
              {index > 0 && (
                <span className="mx-2 text-gray-400" aria-hidden="true">
                  {separator || <ChevronRight className="w-4 h-4" />}
                </span>
              )}
              
              {/* Breadcrumb Item */}
              {item.href && !isCurrent ? (
                <a
                  href={item.href}
                  className="flex items-center text-gray-500 hover:text-gray-700 transition-colors duration-200"
                >
                  {isHome && <Home className="w-4 h-4 mr-1" />}
                  <span>{item.label}</span>
                </a>
              ) : (
                <span 
                  className={cn(
                    'flex items-center',
                    isCurrent 
                      ? 'text-gray-900 font-medium' 
                      : 'text-gray-500'
                  )}
                  aria-current={isCurrent ? 'page' : undefined}
                >
                  {isHome && <Home className="w-4 h-4 mr-1" />}
                  <span>{item.label}</span>
                </span>
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}

// Compact Breadcrumbs (for mobile)
export function CompactBreadcrumbs({
  items,
  className,
  showHome = true,
  homeLabel = 'Home',
  homeHref = '/'
}: Omit<BreadcrumbsProps, 'separator'>) {
  const breadcrumbItems = showHome 
    ? [{ label: homeLabel, href: homeHref }, ...items]
    : items
  
  if (breadcrumbItems.length <= 1) {
    return null
  }
  
  const currentItem = breadcrumbItems[breadcrumbItems.length - 1]
  const parentItem = breadcrumbItems.length > 1 ? breadcrumbItems[breadcrumbItems.length - 2] : null
  
  return (
    <nav 
      className={cn('flex items-center space-x-2 text-sm', className)}
      aria-label="Breadcrumb"
    >
      {parentItem && parentItem.href && (
        <>
          <a
            href={parentItem.href}
            className="text-gray-500 hover:text-gray-700 transition-colors duration-200 truncate"
          >
            {parentItem.label}
          </a>
          <ChevronRight className="w-4 h-4 text-gray-400 flex-shrink-0" />
        </>
      )}
      
      <span className="text-gray-900 font-medium truncate" aria-current="page">
        {currentItem.label}
      </span>
    </nav>
  )
}

// Breadcrumbs with Dropdown (for complex navigation)
export function DropdownBreadcrumbs({
  items,
  className,
  showHome = true,
  homeLabel = 'Home',
  homeHref = '/'
}: Omit<BreadcrumbsProps, 'separator'>) {
  const breadcrumbItems = showHome 
    ? [{ label: homeLabel, href: homeHref }, ...items]
    : items
  
  if (breadcrumbItems.length <= 3) {
    return (
      <Breadcrumbs 
        items={items}
        className={className}
        showHome={showHome}
        homeLabel={homeLabel}
        homeHref={homeHref}
      />
    )
  }
  
  const firstItem = breadcrumbItems[0]
  const lastTwoItems = breadcrumbItems.slice(-2)
  const middleItems = breadcrumbItems.slice(1, -2)
  
  return (
    <nav 
      className={cn('flex items-center space-x-1 text-sm', className)}
      aria-label="Breadcrumb"
    >
      <ol className="flex items-center space-x-1">
        {/* First Item (Home) */}
        <li className="flex items-center">
          {firstItem.href ? (
            <a
              href={firstItem.href}
              className="flex items-center text-gray-500 hover:text-gray-700 transition-colors duration-200"
            >
              <Home className="w-4 h-4 mr-1" />
              <span>{firstItem.label}</span>
            </a>
          ) : (
            <span className="flex items-center text-gray-500">
              <Home className="w-4 h-4 mr-1" />
              <span>{firstItem.label}</span>
            </span>
          )}
        </li>
        
        {/* Separator */}
        <span className="mx-2 text-gray-400" aria-hidden="true">
          <ChevronRight className="w-4 h-4" />
        </span>
        
        {/* Dropdown for Middle Items */}
        <li className="flex items-center">
          <div className="relative group">
            <button className="flex items-center text-gray-500 hover:text-gray-700 transition-colors duration-200 px-2 py-1 rounded hover:bg-gray-100">
              <span>...</span>
            </button>
            
            {/* Dropdown Menu */}
            <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 min-w-48">
              {middleItems.map((item, index) => (
                <div key={index}>
                  {item.href ? (
                    <a
                      href={item.href}
                      className="block px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                    >
                      {item.label}
                    </a>
                  ) : (
                    <span className="block px-4 py-2 text-gray-500">
                      {item.label}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </li>
        
        {/* Last Two Items */}
        {lastTwoItems.map((item, index) => {
          const isLast = index === lastTwoItems.length - 1
          
          return (
            <li key={index} className="flex items-center">
              {/* Separator */}
              <span className="mx-2 text-gray-400" aria-hidden="true">
                <ChevronRight className="w-4 h-4" />
              </span>
              
              {/* Item */}
              {item.href && !isLast ? (
                <a
                  href={item.href}
                  className="text-gray-500 hover:text-gray-700 transition-colors duration-200"
                >
                  {item.label}
                </a>
              ) : (
                <span 
                  className={isLast ? 'text-gray-900 font-medium' : 'text-gray-500'}
                  aria-current={isLast ? 'page' : undefined}
                >
                  {item.label}
                </span>
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}

// Hierarchical Breadcrumbs (for page hierarchies)
export function HierarchicalBreadcrumbs({
  items,
  className,
  showHome = true,
  homeLabel = 'Home',
  homeHref = '/'
}: BreadcrumbsProps) {
  const breadcrumbItems = showHome 
    ? [{ label: homeLabel, href: homeHref }, ...items]
    : items
  
  if (breadcrumbItems.length <= 1 && showHome) {
    return null
  }
  
  return (
    <nav 
      className={cn('flex items-center space-x-1 text-sm bg-gray-50 px-4 py-2 rounded-lg border', className)}
      aria-label="Page hierarchy"
    >
      <ol className="flex items-center space-x-1">
        {breadcrumbItems.map((item, index) => {
          const isLast = index === breadcrumbItems.length - 1
          const isHome = index === 0 && showHome
          const isCurrent = item.isCurrentPage || item.current || isLast
          
          return (
            <li key={index} className="flex items-center">
              {/* Separator */}
              {index > 0 && (
                <span className="mx-2 text-gray-400" aria-hidden="true">
                  <ChevronRight className="w-3 h-3" />
                </span>
              )}
              
              {/* Breadcrumb Item */}
              {item.href && !isCurrent ? (
                <a
                  href={item.href}
                  className="flex items-center text-blue-600 hover:text-blue-800 transition-colors duration-200 px-2 py-1 rounded hover:bg-blue-50"
                >
                  {isHome && <Home className="w-3 h-3 mr-1" />}
                  <span className="text-xs font-medium">{item.label}</span>
                </a>
              ) : (
                <span 
                  className={cn(
                    'flex items-center px-2 py-1 rounded',
                    isCurrent 
                      ? 'text-gray-900 font-semibold bg-white border border-gray-200' 
                      : 'text-gray-600'
                  )}
                  aria-current={isCurrent ? 'page' : undefined}
                >
                  {isHome && <Home className="w-3 h-3 mr-1" />}
                  <span className="text-xs">{item.label}</span>
                </span>
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}

// Structured Data Breadcrumbs (for SEO)
export function StructuredBreadcrumbs({
  items,
  showHome = true,
  homeLabel = 'Home',
  homeHref = '/'
}: Omit<BreadcrumbsProps, 'className' | 'separator'>) {
  const breadcrumbItems = showHome 
    ? [{ label: homeLabel, href: homeHref }, ...items]
    : items
  
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    'itemListElement': breadcrumbItems.map((item, index) => ({
      '@type': 'ListItem',
      'position': index + 1,
      'name': item.label,
      ...(item.href && { 'item': `${process.env.NEXT_PUBLIC_SITE_URL}${item.href}` })
    }))
  }
  
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  )
}