import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Users, 
  ExternalLink, 
  ArrowLeft, 
  Share2,
  Video,
  Ticket
} from 'lucide-react'
import { client } from '@/lib/sanity'
import { urlFor } from '@/lib/sanity'
import { 
  getEventBySlug, 
  getAllEventSlugQuery, 
  getRelatedEventsQuery,
  siteSettingsQuery 
} from '@/lib/queries'
import { Event, SiteSettings } from '@/types/sanity'
import { formatDate, generateExcerpt, isUpcomingEvent, isPastEvent } from '@/lib/utils'
import PortableTextRenderer from '@/components/ui/PortableTextRenderer'
import SocialShare from '@/components/ui/SocialShare'
import EventCard from '@/components/events/EventCard'
import Breadcrumbs from '@/components/ui/Breadcrumbs'

interface EventPageProps {
  params: Promise<{
    slug: string
  }>
}

// Generate metadata for SEO
export async function generateMetadata({ params }: EventPageProps): Promise<Metadata> {
  const { slug } = await params
  const event = await client.fetch(getEventBySlug, { slug })
  const siteSettings = await client.fetch(siteSettingsQuery)
  
  if (!event) {
    return {
      title: 'Event Not Found',
      description: 'The requested event could not be found.'
    }
  }
  
  const title = event.seo?.title || event.title
  const description = event.seo?.description || event.excerpt || generateExcerpt(event.description)
  const siteName = siteSettings?.title || 'Agency Website'
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://example.com'
  
  return {
    title: `${title} | ${siteName}`,
    description,
    keywords: event.seo?.keywords,
    openGraph: {
      title,
      description,
      type: 'article',
      url: `${siteUrl}/events/${slug}`,
      siteName,
      images: event.featuredImage ? [
        {
          url: urlFor(event.featuredImage).width(1200).height(630).url(),
          width: 1200,
          height: 630,
          alt: event.featuredImage.alt || event.title
        }
      ] : []
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: event.featuredImage ? [
        urlFor(event.featuredImage).width(1200).height(630).url()
      ] : []
    },
    alternates: {
      canonical: `${siteUrl}/events/${slug}`
    }
  }
}

// Generate static params for static generation
export async function generateStaticParams() {
  const slugs = await client.fetch(getAllEventSlugQuery)
  
  return slugs.map((item: { slug: { current: string } }) => ({
    slug: item.slug.current
  }))
}

export default async function EventPage({ params }: EventPageProps) {
  const { slug } = await params
  const [event, siteSettings] = await Promise.all([
    client.fetch(getEventBySlug, { slug }),
    client.fetch(siteSettingsQuery)
  ])
  
  if (!event) {
    notFound()
  }
  
  // Fetch related events
  const relatedEvents = await client.fetch(getRelatedEventsQuery, {
    currentId: event._id,
    eventType: event.eventType,
    limit: 3
  })
  
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://example.com'
  const eventUrl = `${siteUrl}/events/${slug}`
  
  const isUpcoming = isUpcomingEvent(event.startDate)
  const isPast = isPastEvent(event.startDate)
  
  // Breadcrumb items
  const breadcrumbItems = [
    { label: 'Home', href: '/' },
    { label: 'Events', href: '/events' },
    { label: event.title, href: `/events/${slug}` }
  ]
  
  // Format date and time
  const formatEventDateTime = (startDate: string, endDate?: string, startTime?: string, endTime?: string) => {
    const start = new Date(startDate)
    const end = endDate ? new Date(endDate) : null
    
    let dateStr = formatDate(startDate)
    if (end && end.toDateString() !== start.toDateString()) {
      dateStr += ` - ${formatDate(endDate!)}`
    }
    
    let timeStr = ''
    if (startTime) {
      timeStr = startTime
      if (endTime) {
        timeStr += ` - ${endTime}`
      }
    }
    
    return { dateStr, timeStr }
  }
  
  const { dateStr, timeStr } = formatEventDateTime(event.startDate, event.endDate, event.startTime, event.endTime)
  
  return (
    <>
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Event',
            name: event.title,
            description: event.excerpt || generateExcerpt(event.description),
            image: event.featuredImage ? [
              urlFor(event.featuredImage).width(1200).height(630).url()
            ] : [],
            startDate: event.startDate,
            endDate: event.endDate || event.startDate,
            eventStatus: isUpcoming ? 'https://schema.org/EventScheduled' : 'https://schema.org/EventCancelled',
            eventAttendanceMode: event.isVirtual 
              ? 'https://schema.org/OnlineEventAttendanceMode'
              : 'https://schema.org/OfflineEventAttendanceMode',
            location: event.isVirtual ? {
              '@type': 'VirtualLocation',
              url: event.registrationUrl || eventUrl
            } : {
              '@type': 'Place',
              name: event.location,
              address: event.location
            },
            organizer: {
              '@type': 'Organization',
              name: siteSettings?.title || 'Agency Website',
              url: siteUrl
            },
            offers: event.registrationUrl ? {
              '@type': 'Offer',
              url: event.registrationUrl,
              price: '0',
              priceCurrency: 'USD',
              availability: 'https://schema.org/InStock'
            } : undefined
          })
        }}
      />
      
      <div className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <div className="relative bg-white">
          {event.featuredImage && (
            <div className="relative h-96 lg:h-[500px] overflow-hidden">
              <Image
                src={urlFor(event.featuredImage).width(1920).height(1080).url()}
                alt={event.featuredImage.alt || event.title}
                fill
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-black bg-opacity-40" />
              
              {/* Content Overlay */}
              <div className="absolute inset-0 flex items-end">
                <div className="container mx-auto px-4 pb-12">
                  <div className="max-w-4xl">
                    {/* Breadcrumbs */}
                    <div className="mb-6">
                      <Breadcrumbs 
                        items={breadcrumbItems}
                        showHome={false}
                        className="text-white/80 hover:text-white"
                      />
                    </div>
                    
                    {/* Event Status Badge */}
                    <div className="mb-4">
                      {isUpcoming && (
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-600 text-white">
                          Upcoming Event
                        </span>
                      )}
                      {isPast && (
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-600 text-white">
                          Past Event
                        </span>
                      )}
                      {event.isFeatured && (
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-yellow-600 text-white ml-2">
                          Featured
                        </span>
                      )}
                    </div>
                    
                    {/* Title */}
                    <h1 className="text-3xl lg:text-5xl font-bold text-white mb-4 leading-tight">
                      {event.title}
                    </h1>
                    
                    {/* Excerpt */}
                    {event.excerpt && (
                      <p className="text-lg text-white/90 mb-6 max-w-3xl leading-relaxed">
                        {event.excerpt}
                      </p>
                    )}
                    
                    {/* Event Details */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-white/80">
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-4 h-4" />
                        <span className="text-sm">{dateStr}</span>
                      </div>
                      
                      {timeStr && (
                        <div className="flex items-center space-x-2">
                          <Clock className="w-4 h-4" />
                          <span className="text-sm">{timeStr}</span>
                        </div>
                      )}
                      
                      <div className="flex items-center space-x-2">
                        {event.isVirtual ? (
                          <>
                            <Video className="w-4 h-4" />
                            <span className="text-sm">Virtual Event</span>
                          </>
                        ) : (
                          <>
                            <MapPin className="w-4 h-4" />
                            <span className="text-sm">{event.location}</span>
                          </>
                        )}
                      </div>
                      
                      {event.capacity && (
                        <div className="flex items-center space-x-2">
                          <Users className="w-4 h-4" />
                          <span className="text-sm">{event.capacity} attendees</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* No Image Header */}
          {!event.featuredImage && (
            <div className="bg-gradient-to-r from-purple-600 to-purple-800 py-16">
              <div className="container mx-auto px-4">
                <div className="max-w-4xl">
                  {/* Breadcrumbs */}
                  <div className="mb-6">
                    <Breadcrumbs 
                      items={breadcrumbItems}
                      className="text-white/80 hover:text-white"
                    />
                  </div>
                  
                  {/* Event Status Badge */}
                  <div className="mb-4">
                    {isUpcoming && (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-600 text-white">
                        Upcoming Event
                      </span>
                    )}
                    {isPast && (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-600 text-white">
                        Past Event
                      </span>
                    )}
                    {event.isFeatured && (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-yellow-600 text-white ml-2">
                        Featured
                      </span>
                    )}
                  </div>
                  
                  {/* Title */}
                  <h1 className="text-3xl lg:text-5xl font-bold text-white mb-4 leading-tight">
                    {event.title}
                  </h1>
                  
                  {/* Excerpt */}
                  {event.excerpt && (
                    <p className="text-lg text-white/90 mb-6 max-w-3xl leading-relaxed">
                      {event.excerpt}
                    </p>
                  )}
                  
                  {/* Event Details */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-white/80">
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4" />
                      <span className="text-sm">{dateStr}</span>
                    </div>
                    
                    {timeStr && (
                      <div className="flex items-center space-x-2">
                        <Clock className="w-4 h-4" />
                        <span className="text-sm">{timeStr}</span>
                      </div>
                    )}
                    
                    <div className="flex items-center space-x-2">
                      {event.isVirtual ? (
                        <>
                          <Video className="w-4 h-4" />
                          <span className="text-sm">Virtual Event</span>
                        </>
                      ) : (
                        <>
                          <MapPin className="w-4 h-4" />
                          <span className="text-sm">{event.location}</span>
                        </>
                      )}
                    </div>
                    
                    {event.capacity && (
                      <div className="flex items-center space-x-2">
                        <Users className="w-4 h-4" />
                        <span className="text-sm">{event.capacity} attendees</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
        
        {/* Main Content */}
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              {/* Event Content */}
              <div className="lg:col-span-3">
                <div className="bg-white rounded-lg shadow-sm p-8">
                  {/* Back Button */}
                  <div className="mb-8">
                    <Link
                      href="/events"
                      className="inline-flex items-center space-x-2 text-purple-600 hover:text-purple-700 transition-colors duration-200"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      <span>Back to Events</span>
                    </Link>
                  </div>
                  
                  {/* Registration CTA */}
                  {event.registrationUrl && isUpcoming && (
                    <div className="bg-purple-50 border border-purple-200 rounded-lg p-6 mb-8">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-lg font-semibold text-purple-900 mb-2">
                            Register for this event
                          </h3>
                          <p className="text-purple-700">
                            Don't miss out on this exciting opportunity!
                          </p>
                        </div>
                        <a
                          href={event.registrationUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center space-x-2 px-6 py-3 bg-purple-600 text-white font-medium rounded-lg hover:bg-purple-700 transition-colors duration-200"
                        >
                          <Ticket className="w-4 h-4" />
                          <span>Register Now</span>
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      </div>
                    </div>
                  )}
                  
                  {/* Content */}
                  <div className="prose prose-lg max-w-none">
                    <PortableTextRenderer content={event.description} />
                  </div>
                </div>
              </div>
              
              {/* Sidebar */}
              <div className="lg:col-span-1">
                {/* Event Details Card */}
                <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Event Details</h3>
                  
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <Calendar className="w-5 h-5 text-purple-600 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">Date</p>
                        <p className="text-sm text-gray-600">{dateStr}</p>
                      </div>
                    </div>
                    
                    {timeStr && (
                      <div className="flex items-start space-x-3">
                        <Clock className="w-5 h-5 text-purple-600 mt-0.5" />
                        <div>
                          <p className="text-sm font-medium text-gray-900">Time</p>
                          <p className="text-sm text-gray-600">{timeStr}</p>
                        </div>
                      </div>
                    )}
                    
                    <div className="flex items-start space-x-3">
                      {event.isVirtual ? (
                        <Video className="w-5 h-5 text-purple-600 mt-0.5" />
                      ) : (
                        <MapPin className="w-5 h-5 text-purple-600 mt-0.5" />
                      )}
                      <div>
                        <p className="text-sm font-medium text-gray-900">Location</p>
                        <p className="text-sm text-gray-600">
                          {event.isVirtual ? 'Virtual Event' : event.location}
                        </p>
                      </div>
                    </div>
                    
                    {event.eventType && (
                      <div className="flex items-start space-x-3">
                        <div className="w-5 h-5 bg-purple-600 rounded-full mt-0.5" />
                        <div>
                          <p className="text-sm font-medium text-gray-900">Type</p>
                          <p className="text-sm text-gray-600">
                            {event.eventType.charAt(0).toUpperCase() + event.eventType.slice(1)}
                          </p>
                        </div>
                      </div>
                    )}
                    
                    {event.capacity && (
                      <div className="flex items-start space-x-3">
                        <Users className="w-5 h-5 text-purple-600 mt-0.5" />
                        <div>
                          <p className="text-sm font-medium text-gray-900">Capacity</p>
                          <p className="text-sm text-gray-600">{event.capacity} attendees</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Social Share */}
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <div className="flex items-center space-x-2 mb-4">
                    <Share2 className="w-4 h-4 text-gray-500" />
                    <span className="text-sm font-medium text-gray-700">Share Event</span>
                  </div>
                  <SocialShare 
                    url={eventUrl}
                    title={event.title}
                    description={event.excerpt || generateExcerpt(event.description)}
                    variant="minimal"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Related Events */}
        {relatedEvents && relatedEvents.length > 0 && (
          <div className="bg-white py-16">
            <div className="container mx-auto px-4">
              <div className="max-w-6xl mx-auto">
                <div className="text-center mb-12">
                  <h2 className="text-3xl font-bold text-gray-900 mb-4">
                    Related Events
                  </h2>
                  <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                    Discover more events you might be interested in
                  </p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {relatedEvents.map((relatedEvent) => (
                    <EventCard key={relatedEvent._id} event={relatedEvent} />
                  ))}
                </div>
                
                <div className="text-center mt-12">
                  <Link
                    href="/events"
                    className="inline-flex items-center px-6 py-3 border border-purple-600 text-purple-600 font-medium rounded-lg hover:bg-purple-600 hover:text-white transition-colors duration-200"
                  >
                    View All Events
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  )
}

// Loading component
export function EventPageSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Skeleton */}
      <div className="relative bg-gray-300 animate-pulse h-96 lg:h-[500px]" />
      
      {/* Content Skeleton */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <div className="lg:col-span-3">
              <div className="bg-white rounded-lg shadow-sm p-8">
                <div className="space-y-4">
                  <div className="h-4 bg-gray-200 rounded animate-pulse" />
                  <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4" />
                  <div className="h-4 bg-gray-200 rounded animate-pulse w-1/2" />
                </div>
              </div>
            </div>
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="space-y-3">
                  <div className="h-4 bg-gray-200 rounded animate-pulse" />
                  <div className="h-4 bg-gray-200 rounded animate-pulse w-2/3" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}