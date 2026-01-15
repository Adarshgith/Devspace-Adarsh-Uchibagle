'use client'

import React from 'react'
import { 
  ContactForm, 
  NewsletterForm, 
  SearchForm, 
  EventRegistrationForm, 
  CommentForm,
  CompactSearchForm,
  CompactCommentForm
} from '@/components/forms'
import { ToastProvider } from '@/components/ui/Toast'

export default function FormsDemo() {
  const [activeTab, setActiveTab] = React.useState('contact')

  const tabs = [
    { id: 'contact', label: 'Contact Form', component: ContactFormDemo },
    { id: 'newsletter', label: 'Newsletter', component: NewsletterDemo },
    { id: 'search', label: 'Search Forms', component: SearchDemo },
    { id: 'event', label: 'Event Registration', component: EventDemo },
    { id: 'comments', label: 'Comments', component: CommentsDemo }
  ]

  const ActiveComponent = tabs.find(tab => tab.id === activeTab)?.component || ContactFormDemo

  return (
    <ToastProvider>
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Form Components Demo
            </h1>
            <p className="text-lg text-gray-600">
              Interactive demonstration of all form components with validation and functionality
            </p>
          </div>

          {/* Tab Navigation */}
          <div className="mb-8">
            <div className="border-b border-gray-200">
              <nav className="-mb-px flex space-x-8 justify-center">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                      activeTab === tab.id
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Active Tab Content */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <ActiveComponent />
          </div>
        </div>
      </div>
    </ToastProvider>
  )
}

function ContactFormDemo() {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Contact Form</h2>
        <p className="text-gray-600">
          Complete contact form with validation, sanitization, and email integration
        </p>
      </div>
      
      <ContactForm className="max-w-2xl mx-auto" />
      
      <div className="mt-8 p-4 bg-blue-50 rounded-lg">
        <h3 className="font-semibold text-blue-900 mb-2">Features:</h3>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Form validation with Zod schema</li>
          <li>• Input sanitization for security</li>
          <li>• Rate limiting protection</li>
          <li>• Email integration ready</li>
          <li>• Responsive design</li>
          <li>• Toast notifications</li>
        </ul>
      </div>
    </div>
  )
}

function NewsletterDemo() {
  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Newsletter Forms</h2>
        <p className="text-gray-600">
          Full and compact newsletter subscription forms with preferences
        </p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <h3 className="text-lg font-semibold mb-4">Full Newsletter Form</h3>
          <NewsletterForm />
        </div>
        
        <div>
          <h3 className="text-lg font-semibold mb-4">Compact Newsletter Form</h3>
          <div className="bg-gray-100 p-6 rounded-lg">
            <h4 className="font-medium mb-4">Stay Updated</h4>
            <NewsletterForm compact className="" />
          </div>
        </div>
      </div>
      
      <div className="mt-8 p-4 bg-green-50 rounded-lg">
        <h3 className="font-semibold text-green-900 mb-2">Features:</h3>
        <ul className="text-sm text-green-800 space-y-1">
          <li>• Subscription preferences management</li>
          <li>• Duplicate email detection</li>
          <li>• Confirmation email workflow</li>
          <li>• Unsubscribe token generation</li>
          <li>• Compact and full form variants</li>
        </ul>
      </div>
    </div>
  )
}

function SearchDemo() {
  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Search Forms</h2>
        <p className="text-gray-600">
          Advanced search with filters and compact search variants
        </p>
      </div>
      
      <div className="space-y-8">
        <div>
          <h3 className="text-lg font-semibold mb-4">Advanced Search Form</h3>
          <SearchForm 
            showAdvancedFilters={true}
            placeholder="Search articles, news, events..."
            className="max-w-4xl mx-auto"
          />
        </div>
        
        <div>
          <h3 className="text-lg font-semibold mb-4">Compact Search Form</h3>
          <div className="max-w-md mx-auto">
            <CompactSearchForm placeholder="Quick search..." />
          </div>
        </div>
      </div>
      
      <div className="mt-8 p-4 bg-purple-50 rounded-lg">
        <h3 className="font-semibold text-purple-900 mb-2">Features:</h3>
        <ul className="text-sm text-purple-800 space-y-1">
          <li>• Query sanitization and validation</li>
          <li>• Advanced filtering options</li>
          <li>• URL synchronization</li>
          <li>• Debounced search input</li>
          <li>• Category and date filtering</li>
          <li>• Sort options</li>
        </ul>
      </div>
    </div>
  )
}

function EventDemo() {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Event Registration</h2>
        <p className="text-gray-600">
          Complete event registration with capacity management
        </p>
      </div>
      
      <EventRegistrationForm
        eventId="demo-event-123"
        eventTitle="Web Development Workshop"
        eventDate="2024-02-15T14:00:00Z"
        eventLocation="Tech Hub, Downtown"
        maxAttendees={50}
        currentAttendees={23}
        className="max-w-4xl mx-auto"
      />
      
      <div className="mt-8 p-4 bg-orange-50 rounded-lg">
        <h3 className="font-semibold text-orange-900 mb-2">Features:</h3>
        <ul className="text-sm text-orange-800 space-y-1">
          <li>• Capacity management and tracking</li>
          <li>• Dietary and accessibility requirements</li>
          <li>• Registration confirmation emails</li>
          <li>• Duplicate registration prevention</li>
          <li>• Event details display</li>
          <li>• Spots remaining indicator</li>
        </ul>
      </div>
    </div>
  )
}

function CommentsDemo() {
  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Comment Forms</h2>
        <p className="text-gray-600">
          Comment and reply forms with moderation features
        </p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <h3 className="text-lg font-semibold mb-4">Full Comment Form</h3>
          <CommentForm
            contentId="demo-blog-post"
            contentType="blog"
          />
        </div>
        
        <div>
          <h3 className="text-lg font-semibold mb-4">Reply Form</h3>
          <CompactCommentForm
            contentId="demo-blog-post"
            contentType="blog"
            parentId="parent-comment-123"
            parentAuthor="John Doe"
          />
        </div>
      </div>
      
      <div className="mt-8 p-4 bg-red-50 rounded-lg">
        <h3 className="font-semibold text-red-900 mb-2">Features:</h3>
        <ul className="text-sm text-red-800 space-y-1">
          <li>• Comment moderation system</li>
          <li>• Spam detection and filtering</li>
          <li>• Threaded replies support</li>
          <li>• Content sanitization</li>
          <li>• Rate limiting protection</li>
          <li>• Admin approval workflow</li>
        </ul>
      </div>
    </div>
  )
}