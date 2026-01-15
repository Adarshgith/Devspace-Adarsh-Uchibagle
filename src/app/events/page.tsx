import { Metadata } from 'next'
import { Suspense } from 'react'
import { Calendar, MapPin, Users, Clock } from 'lucide-react'
import { client } from '@/lib/sanity'
import { 
  getAllEventsQuery, 
  getUpcomingEventsQuery,
  getPastEventsQuery,
  siteSettingsQuery 
} from '@/lib/queries'
import { Event, SiteSettings } from '@/types/sanity'
import { formatDate, isUpcomingEvent } from '@/lib/utils'
import EventCard from '@/components/events/EventCard'
import EventFilters from '@/components/events/EventFilters'
import EventSearch from '@/components/events/EventSearch'
import Pagination from '@/components/ui/Pagination'
import Breadcrumbs from '@/components/ui/Breadcrumbs'

interface EventsPageProps {
  searchParams: Promise<{
    page?: string
    q?: string
    type?: string
    location?: string
    sort?: string
  }>
}

const ITEMS_PER_PAGE = 12

// Generate metadata
export async function generateMetadata(): Promise<Metadata> {
  const siteSettings = await client.fetch(siteSettingsQuery)
  const siteName = siteSettings?.title || 'Agency Website'
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://example.com'
  
  return {
    title: `Events | ${siteName}`,
    description: 'Discover upcoming events, workshops, conferences, and networking opportunities. Join us for engaging experiences and professional development.',
    keywords: 'events, workshops, conferences, networking, professional development, seminars, webinars',
    openGraph: {
      title: `Events | ${siteName}`,
      description: 'Discover upcoming events, workshops, conferences, and networking opportunities.',
      type: 'website',
      url: `${siteUrl}/events`,
      siteName
    },
    twitter: {
      card: 'summary_large_image',
      title: `Events | ${siteName}`,
      description: 'Discover upcoming events, workshops, conferences, and networking opportunities.'
    },
    alternates: {
      canonical: `${siteUrl}/events`
    }
  }
}

export default async function EventsPage({ searchParams }: EventsPageProps) {
  const resolvedSearchParams = await searchParams
  const currentPage = parseInt(resolvedSearchParams.page || '1')
  const searchQuery = resolvedSearchParams.q || ''
  const eventType = resolvedSearchParams.type || ''
  const location = resolvedSearchParams.location || ''
  const sortBy = resolvedSearchParams.sort || 'date'
  
  // Build GROQ query based on filters
  let query = `*[_type == "event"`
  const queryParams: any = {}
  
  // Add search filter
  if (searchQuery) {
    query += ` && (title match "*${searchQuery}*" || description match "*${searchQuery}*")`
  }
  
  // Add type filter
  if (eventType) {
    query += ` && eventType == "${eventType}"`
  }
  
  // Add location filter
  if (location) {
    query += ` && (location match "*${location}*" || isVirtual == true)`
  }
  
  query += `] {
    _id,
    title,
    slug,
    description,
    excerpt,
    featuredImage,
    startDate,
    endDate,
    startTime,
    endTime,
    location,
    isVirtual,
    eventType,
    capacity,
    registrationUrl,
    isFeatured,
    _createdAt,
    _updatedAt
  }`
  
  // Add sorting
  switch (sortBy) {
    case 'date':
      query += ` | order(startDate asc)`
      break
    case 'title':
      query += ` | order(title asc)`
      break
    case 'featured':
      query += ` | order(isFeatured desc, startDate asc)`
      break
    default:
      query += ` | order(startDate asc)`
  }
  
  // Fetch data
  const [allEvents, siteSettings] = await Promise.all([
    client.fetch(query, queryParams),
    client.fetch(siteSettingsQuery)
  ])
  
  // Pagination
  const totalEvents = allEvents.length
  const totalPages = Math.ceil(totalEvents / ITEMS_PER_PAGE)
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const endIndex = startIndex + ITEMS_PER_PAGE
  const paginatedEvents = allEvents.slice(startIndex, endIndex)
  
  // Separate upcoming and past events for stats
  const upcomingEvents = allEvents.filter((event: Event) => isUpcomingEvent(event.startDate))
  const pastEvents = allEvents.filter((event: Event) => !isUpcomingEvent(event.startDate))
  
  // Get unique event types and locations for filters
  const eventTypes = [...new Set(allEvents.map((event: Event) => event.eventType).filter(Boolean))]
  const locations = [...new Set(allEvents.map((event: Event) => event.location).filter(Boolean))]
  
  // Breadcrumb items
  const breadcrumbItems = [
    { label: 'Home', href: '/' },
    { label: 'Events', href: '/events' }
  ]
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-purple-600 to-purple-800 py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            {/* Breadcrumbs */}
            <div className="mb-6">
              <Breadcrumbs 
                items={breadcrumbItems}
                className="text-white/80 hover:text-white justify-center"
                showHome={false}
              />
            </div>
            
            <h1 className="text-4xl lg:text-6xl font-bold text-white mb-6">
              Events
            </h1>
            <p className="text-xl text-purple-100 mb-8 max-w-2xl mx-auto">
              Discover upcoming events, workshops, conferences, and networking opportunities. 
              Join us for engaging experiences and professional development.
            </p>
            
            {/* Event Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-2xl mx-auto">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <div className="flex items-center justify-center space-x-2 mb-2">
                  <Calendar className="w-5 h-5 text-purple-200" />
                  <span className="text-2xl font-bold text-white">{upcomingEvents.length}</span>
                </div>
                <p className="text-purple-200 text-sm">Upcoming Events</p>
              </div>
              
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <div className="flex items-center justify-center space-x-2 mb-2">
                  <Clock className="w-5 h-5 text-purple-200" />
                  <span className="text-2xl font-bold text-white">{pastEvents.length}</span>
                </div>
                <p className="text-purple-200 text-sm">Past Events</p>
              </div>
              
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <div className="flex items-center justify-center space-x-2 mb-2">
                  <MapPin className="w-5 h-5 text-purple-200" />
                  <span className="text-2xl font-bold text-white">{locations.length}</span>
                </div>
                <p className="text-purple-200 text-sm">Locations</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          {/* Search and Filters */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Search */}
              <div className="lg:col-span-2">
                <Suspense fallback={<div className="h-12 bg-gray-200 rounded animate-pulse" />}>
                  <EventSearch 
                    initialQuery={searchQuery}
                    placeholder="Search events by title, description, or location..."
                  />
                </Suspense>
              </div>
              
              {/* Filters */}
              <div>
                <Suspense fallback={<div className="h-12 bg-gray-200 rounded animate-pulse" />}>
                  <EventFilters 
                    eventTypes={eventTypes}
                    locations={locations}
                    initialFilters={{
                      type: eventType,
                      location,
                      sort: sortBy
                    }}
                  />
                </Suspense>
              </div>
            </div>
            
            {/* Search Results Summary */}
            {searchQuery && (
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                  <p className="text-sm text-purple-800">
                    <span className="font-medium">{totalEvents}</span> event{totalEvents !== 1 ? 's' : ''} found for{' '}
                    <span className="font-semibold">"{searchQuery}"</span>
                    {totalEvents > 0 && (
                      <span className="ml-2 text-purple-600">
                        (Page {currentPage} of {totalPages})
                      </span>
                    )}
                  </p>
                </div>
              </div>
            )}
          </div>
          
          {/* Events Grid */}
          {paginatedEvents.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                {paginatedEvents.map((event: Event) => (
                  <EventCard key={event._id} event={event} />
                ))}
              </div>
              
              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center">
                  <Pagination 
                    currentPage={currentPage}
                    totalPages={totalPages}
                    baseUrl="/events"
                    searchParams={searchParams}
                  />
                </div>
              )}
            </>
          ) : (
            /* No Events Found */
            <div className="text-center py-16">
              <div className="max-w-md mx-auto">
                <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  No events found
                </h3>
                <p className="text-gray-600 mb-6">
                  {searchQuery || eventType || location
                    ? 'Try adjusting your search criteria or browse all events.'
                    : 'No events are currently available. Check back soon for upcoming events!'}
                </p>
                {(searchQuery || eventType || location) && (
                  <a
                    href="/events"
                    className="inline-flex items-center px-4 py-2 border border-purple-600 text-purple-600 font-medium rounded-lg hover:bg-purple-600 hover:text-white transition-colors duration-200"
                  >
                    View All Events
                  </a>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// Loading component
export function EventsPageSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Skeleton */}
      <div className="bg-gradient-to-r from-purple-600 to-purple-800 py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="h-12 bg-white/20 rounded animate-pulse mb-6 mx-auto max-w-md" />
            <div className="h-6 bg-white/20 rounded animate-pulse mb-8 mx-auto max-w-lg" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-2xl mx-auto">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                  <div className="h-8 bg-white/20 rounded animate-pulse mb-2" />
                  <div className="h-4 bg-white/20 rounded animate-pulse" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      {/* Content Skeleton */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          {/* Search and Filters Skeleton */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <div className="h-12 bg-gray-200 rounded animate-pulse" />
              </div>
              <div>
                <div className="h-12 bg-gray-200 rounded animate-pulse" />
              </div>
            </div>
          </div>
          
          {/* Events Grid Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-lg shadow-sm overflow-hidden">
                <div className="h-48 bg-gray-200 animate-pulse" />
                <div className="p-6">
                  <div className="h-4 bg-gray-200 rounded animate-pulse mb-2" />
                  <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4 mb-4" />
                  <div className="space-y-2">
                    <div className="h-3 bg-gray-200 rounded animate-pulse" />
                    <div className="h-3 bg-gray-200 rounded animate-pulse w-2/3" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}