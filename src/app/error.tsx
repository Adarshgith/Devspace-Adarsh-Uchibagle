'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { ExclamationTriangleIcon, ArrowPathIcon, HomeIcon } from '@heroicons/react/24/outline'

interface ErrorProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Application error:', error)
  }, [error])

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="text-center">
          {/* Error Icon */}
          <div className="mx-auto w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mb-8">
            <ExclamationTriangleIcon className="w-12 h-12 text-red-600" />
          </div>
          
          {/* Error Message */}
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Oops! Something went wrong
          </h1>
          <p className="text-gray-600 mb-8 max-w-md mx-auto">
            We encountered an unexpected error. Don't worry, our team has been notified and we're working to fix it.
          </p>
          
          {/* Error Details (Development only) */}
          {process.env.NODE_ENV === 'development' && (
            <div className="mb-8 p-4 bg-gray-100 rounded-lg text-left">
              <h3 className="text-sm font-medium text-gray-900 mb-2">Error Details:</h3>
              <p className="text-xs text-gray-700 font-mono break-all">
                {error.message}
              </p>
              {error.digest && (
                <p className="text-xs text-gray-500 mt-2">
                  Error ID: {error.digest}
                </p>
              )}
            </div>
          )}
        </div>
        
        {/* Action Buttons */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={reset}
              className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 transition-colors duration-200"
            >
              <ArrowPathIcon className="w-5 h-5 mr-2" />
              Try Again
            </button>
            
            <Link
              href="/"
              className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 text-base font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition-colors duration-200"
            >
              <HomeIcon className="w-5 h-5 mr-2" />
              Go Home
            </Link>
          </div>
          
          <div className="text-center">
            <button
              onClick={() => window.location.reload()}
              className="text-sm text-blue-600 hover:text-blue-700 transition-colors duration-200"
            >
              Refresh Page
            </button>
          </div>
        </div>
        
        {/* Helpful Information */}
        <div className="mt-12 border-t border-gray-200 pt-8">
          <h3 className="text-lg font-medium text-gray-900 mb-4 text-center">
            What can you do?
          </h3>
          <div className="space-y-3 text-sm text-gray-600">
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center mt-0.5">
                <span className="text-xs font-medium text-blue-600">1</span>
              </div>
              <p>Try refreshing the page or clicking "Try Again"</p>
            </div>
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center mt-0.5">
                <span className="text-xs font-medium text-blue-600">2</span>
              </div>
              <p>Check your internet connection</p>
            </div>
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center mt-0.5">
                <span className="text-xs font-medium text-blue-600">3</span>
              </div>
              <p>Clear your browser cache and cookies</p>
            </div>
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center mt-0.5">
                <span className="text-xs font-medium text-blue-600">4</span>
              </div>
              <p>Try again in a few minutes</p>
            </div>
          </div>
        </div>
        
        {/* Contact Support */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500">
            If the problem persists, please{' '}
            <Link
              href="/contact"
              className="text-blue-600 hover:text-blue-700 transition-colors duration-200"
            >
              contact our support team
            </Link>
            {error.digest && (
              <span className="block mt-1">
                Reference ID: <code className="text-xs bg-gray-100 px-1 py-0.5 rounded">{error.digest}</code>
              </span>
            )}
          </p>
        </div>
      </div>
    </div>
  )
}

// Specific error components for different scenarios
export function NetworkError({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="text-center py-12">
      <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-6">
        <ExclamationTriangleIcon className="w-8 h-8 text-red-600" />
      </div>
      <h3 className="text-lg font-medium text-gray-900 mb-2">
        Network Error
      </h3>
      <p className="text-gray-600 mb-6">
        Unable to connect to the server. Please check your internet connection.
      </p>
      <button
        onClick={onRetry}
        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 transition-colors duration-200"
      >
        <ArrowPathIcon className="w-4 h-4 mr-2" />
        Retry
      </button>
    </div>
  )
}

export function DataError({ message, onRetry }: { message?: string; onRetry?: () => void }) {
  return (
    <div className="text-center py-8">
      <div className="mx-auto w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mb-4">
        <ExclamationTriangleIcon className="w-6 h-6 text-yellow-600" />
      </div>
      <h3 className="text-base font-medium text-gray-900 mb-2">
        Data Error
      </h3>
      <p className="text-sm text-gray-600 mb-4">
        {message || 'Unable to load the requested data.'}
      </p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition-colors duration-200"
        >
          <ArrowPathIcon className="w-4 h-4 mr-2" />
          Try Again
        </button>
      )}
    </div>
  )
}