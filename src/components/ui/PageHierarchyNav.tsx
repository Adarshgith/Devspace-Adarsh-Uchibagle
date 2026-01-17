'use client'

import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ChevronRight, Folder, FileText } from 'lucide-react'
import { urlFor } from '@/lib/sanity'
import { type ChildPage } from '@/lib/pageHierarchy'

interface PageHierarchyNavProps {
  childPages: ChildPage[]
  title?: string
  className?: string
}

export default function PageHierarchyNav({ 
  childPages, 
  title = "Related Pages", 
  className = "" 
}: PageHierarchyNavProps) {
  if (childPages.length === 0) {
    return null
  }

  return (
    <div className={`bg-white rounded-lg shadow-sm border border-gray-200 ${className}`}>
      <div className="p-6">
        <div className="flex items-center gap-2 mb-6">
          <Folder className="h-5 w-5 text-blue-600" />
          <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
        </div>
        
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {childPages.map((child) => {
            const childUrl = child.seo?.pagePath || `/${child.slug.current}`
            
            return (
              <Link
                key={child._id}
                href={childUrl}
                className="group block p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-md transition-all duration-200 hover:bg-blue-50/50"
              >
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 mt-1">
                    <FileText className="h-4 w-4 text-gray-400 group-hover:text-blue-600 transition-colors" />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors truncate">
                        {child.title}
                      </h3>
                      <ChevronRight className="h-3 w-3 text-gray-400 group-hover:text-blue-600 transition-colors flex-shrink-0" />
                    </div>
                    
                    {child.excerpt && (
                      <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed">
                        {child.excerpt}
                      </p>
                    )}
                    
                    {child.featuredImage && (
                      <div className="relative h-20 mt-3 overflow-hidden rounded border">
                        <Image
                          src={urlFor(child.featuredImage).width(300).height(150).url()}
                          alt={child.featuredImage.alt || child.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-200"
                          unoptimized
                        />
                      </div>
                    )}
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
        
        {childPages.length > 6 && (
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500">
              Showing {Math.min(6, childPages.length)} of {childPages.length} pages
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

// Compact version for sidebar use
export function PageHierarchyNavCompact({ 
  childPages, 
  title = "In this section", 
  className = "" 
}: PageHierarchyNavProps) {
  if (childPages.length === 0) {
    return null
  }

  return (
    <div className={`bg-gray-50 rounded-lg p-4 ${className}`}>
      <h3 className="text-sm font-medium text-gray-900 mb-3 flex items-center gap-2">
        <Folder className="h-4 w-4 text-gray-600" />
        {title}
      </h3>
      
      <ul className="space-y-2">
        {childPages.slice(0, 8).map((child) => {
          const childUrl = child.seo?.pagePath || `/${child.slug.current}`
          
          return (
            <li key={child._id}>
              <Link
                href={childUrl}
                className="group flex items-center gap-2 text-sm text-gray-600 hover:text-blue-600 transition-colors"
              >
                <FileText className="h-3 w-3 flex-shrink-0" />
                <span className="truncate">{child.title}</span>
                <ChevronRight className="h-3 w-3 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
              </Link>
            </li>
          )
        })}
      </ul>
      
      {childPages.length > 8 && (
        <p className="text-xs text-gray-500 mt-3">
          +{childPages.length - 8} more pages
        </p>
      )}
    </div>
  )
}

// Tree view for complex hierarchies
interface PageTreeNode extends ChildPage {
  children?: PageTreeNode[]
  level?: number
}

interface PageTreeViewProps {
  pages: PageTreeNode[]
  currentPageId?: string
  maxLevel?: number
  className?: string
}

export function PageTreeView({ 
  pages, 
  currentPageId, 
  maxLevel = 3, 
  className = "" 
}: PageTreeViewProps) {
  const renderTreeNode = (node: PageTreeNode, level: number = 0) => {
    const isCurrentPage = node._id === currentPageId
    const hasChildren = node.children && node.children.length > 0
    const nodeUrl = node.seo?.pagePath || `/${node.slug.current}`
    
    return (
      <div key={node._id} className={`${level > 0 ? 'ml-4' : ''}`}>
        <div className={`flex items-center gap-2 py-1 px-2 rounded ${
          isCurrentPage 
            ? 'bg-blue-100 text-blue-900' 
            : 'hover:bg-gray-100 text-gray-700'
        }`}>
          <div className="flex items-center gap-1" style={{ paddingLeft: `${level * 12}px` }}>
            {hasChildren ? (
              <Folder className="h-4 w-4 text-blue-600" />
            ) : (
              <FileText className="h-4 w-4 text-gray-400" />
            )}
            
            <Link
              href={nodeUrl}
              className={`text-sm font-medium hover:underline ${
                isCurrentPage ? 'text-blue-900' : 'text-gray-700 hover:text-blue-600'
              }`}
            >
              {node.title}
            </Link>
          </div>
        </div>
        
        {hasChildren && level < maxLevel && (
          <div className="mt-1">
            {node.children!.map(child => renderTreeNode(child, level + 1))}
          </div>
        )}
      </div>
    )
  }

  return (
    <div className={`bg-white border border-gray-200 rounded-lg p-4 ${className}`}>
      <h3 className="text-sm font-medium text-gray-900 mb-3 flex items-center gap-2">
        <Folder className="h-4 w-4 text-gray-600" />
        Page Structure
      </h3>
      
      <div className="space-y-1">
        {pages.map(page => renderTreeNode(page))}
      </div>
    </div>
  )
}