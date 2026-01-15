'use client'

import Link from 'next/link'
import { HomeIcon, MagnifyingGlassIcon, ArrowLeftIcon } from '@heroicons/react/24/outline'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="text-center">
          {/* 404 Illustration */}
          <div className="mx-auto w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mb-8">
            <svg
              className="w-12 h-12 text-blue-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.291-1.007-5.691-2.709M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
              />
            </svg>
          </div>
          
          {/* Error Message */}
          <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">
            Page Not Found
          </h2>
          <p className="text-gray-600 mb-8 max-w-md mx-auto">
            Sorry, we couldn&apos;t find the page you&apos;re looking for. The page might have been moved, deleted, or you entered the wrong URL.
          </p>
        </div>
        
        {/* Action Buttons */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/"
              className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 transition-colors duration-200"
            >
              <HomeIcon className="w-5 h-5 mr-2" />
              Go Home
            </Link>
            
            <Link
              href="/search"
              className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 text-base font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition-colors duration-200"
            >
              <MagnifyingGlassIcon className="w-5 h-5 mr-2" />
              Search Site
            </Link>
          </div>
          
          <div className="text-center">
            <button
              onClick={() => window.history.back()}
              className="inline-flex items-center text-sm text-blue-600 hover:text-blue-700 transition-colors duration-200"
            >
              <ArrowLeftIcon className="w-4 h-4 mr-1" />
              Go Back
            </button>
          </div>
        </div>
        
        {/* Helpful Links */}
        <div className="mt-12 border-t border-gray-200 pt-8">
          <h3 className="text-lg font-medium text-gray-900 mb-4 text-center">
            Popular Pages
          </h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <Link
              href="/blog"
              className="text-blue-600 hover:text-blue-700 transition-colors duration-200 text-center"
            >
              Blog
            </Link>
            <Link
              href="/news"
              className="text-blue-600 hover:text-blue-700 transition-colors duration-200 text-center"
            >
              News
            </Link>
            <Link
              href="/events"
              className="text-blue-600 hover:text-blue-700 transition-colors duration-200 text-center"
            >
              Events
            </Link>
            <Link
              href="/contact"
              className="text-blue-600 hover:text-blue-700 transition-colors duration-200 text-center"
            >
              Contact
            </Link>
          </div>
        </div>
        
        {/* Contact Support */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500">
            Still can&apos;t find what you&apos;re looking for?{' '}
            <Link
              href="/contact"
              className="text-blue-600 hover:text-blue-700 transition-colors duration-200"
            >
              Contact our support team
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}