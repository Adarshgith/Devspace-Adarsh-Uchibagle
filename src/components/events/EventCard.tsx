import React from 'react'
import { Event } from '@/types/sanity'
import ContentCard from '@/components/ui/ContentCard'
import { ContentCardSkeleton } from '@/components/ui/SkeletonLoader'
import { isUpcomingEvent } from '@/lib/utils'

interface EventCardProps {
  event: Event
  featured?: boolean
  showLocation?: boolean
  showRegistration?: boolean
  className?: string
}

const EventCard = React.memo<EventCardProps>(({ 
  event, 
  featured = false, 
  showLocation = true,
  showRegistration = true,
  className 
}) => {
  const isUpcoming = isUpcomingEvent(event.startDate)
  const eventDate = event.startDate || event.eventDate
  
  // Transform Event type to ContentCard's expected format
  const transformedEvent = {
    ...event,
    _type: 'events' as const,
    publishDate: eventDate,
    isUpcoming,
    eventTime: event.eventTime,
    location: event.location,
    isVirtual: event.isVirtual,
    registrationLink: event.registrationLink,
    startDate: event.startDate,
    endDate: event.endDate
  }

  return (
    <ContentCard
      content={transformedEvent}
      type="event"
      featured={featured}
      showLocation={showLocation}
      showRegistration={showRegistration}
      className={className}
    />
  )
})

EventCard.displayName = 'EventCard'

// Loading skeleton component
export function EventCardSkeleton({ featured = false }: { featured?: boolean }) {
  return (
    <ContentCardSkeleton 
      featured={featured}
      showLocation={true}
      showRegistration={true}
    />
  )
}

export default EventCard