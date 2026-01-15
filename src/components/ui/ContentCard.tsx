// import React from 'react'
// import Link from 'next/link'
// import Image from 'next/image'
// import { Calendar, Clock, User, ArrowRight, MapPin, Users, ExternalLink, Tag } from 'lucide-react'
// import { urlFor } from '@/lib/sanity'
// import { formatDate, getReadingTime, generateExcerpt, isUpcomingEvent } from '@/lib/utils'
// import { cn } from '@/lib/utils'

// type ContentType = 'blog' | 'event' | 'news'

// interface BaseContent {
//   _id: string
//   _type: string
//   title: string
//   slug: { current: string }
//   mainImage?: any
//   excerpt?: string
//   mainContent?: any
//   isSticky?: boolean
//   _createdAt?: string
//   publishDate?: string
// }

// interface BlogContent extends BaseContent {
//   _type: 'blogs'
//   featuredBlog?: boolean
//   blogsAuthor?: {
//     name: string
//     bio?: string
//     image?: any
//   }
// }

// interface EventContent extends BaseContent {
//   _type: 'events'
//   startDate?: string
//   endDate?: string
//   eventDate?: string
//   eventTime?: string
//   location?: string
//   isVirtual?: boolean
//   registrationLink?: string
// }

// interface NewsContent extends BaseContent {
//   _type: 'news'
//   featuredNews?: boolean
//   category?: {
//     title: string
//     description?: string
//   }
// }

// type Content = BlogContent | EventContent | NewsContent

// interface ContentCardProps {
//   content: Content
//   type: ContentType
//   featured?: boolean
//   showAuthor?: boolean
//   className?: string
// }

// interface MetaInfoProps {
//   content: Content
//   type: ContentType
//   readingTime?: string
// }

// const MetaInfo = React.memo<MetaInfoProps>(({ content, type, readingTime }) => {
//   const getMetaItems = () => {
//     const items = []
    
//     // Date information
//     const date = content.publishDate || content._createdAt
//     if (date) {
//       items.push({
//         icon: Calendar,
//         text: formatDate(date),
//         key: 'date'
//       })
//     }
    
//     // Type-specific meta
//     switch (type) {
//       case 'blog':
//         const blogContent = content as BlogContent
//         if (readingTime) {
//           items.push({
//             icon: Clock,
//             text: `${readingTime} min read`,
//             key: 'reading-time'
//           })
//         }
//         if (blogContent.blogsAuthor) {
//           items.push({
//             icon: User,
//             text: blogContent.blogsAuthor.name,
//             key: 'author'
//           })
//         }
//         break
        
//       case 'event':
//         const eventContent = content as EventContent
//         if (eventContent.eventTime) {
//           items.push({
//             icon: Clock,
//             text: eventContent.eventTime,
//             key: 'time'
//           })
//         }
//         if (eventContent.location && !eventContent.isVirtual) {
//           items.push({
//             icon: MapPin,
//             text: eventContent.location,
//             key: 'location'
//           })
//         }
//         if (eventContent.isVirtual) {
//           items.push({
//             icon: Users,
//             text: 'Virtual Event',
//             key: 'virtual',
//             className: 'text-purple-600'
//           })
//         }
//         break
        
//       case 'news':
//         const newsContent = content as NewsContent
//         if (newsContent.category) {
//           items.push({
//             icon: Tag,
//             text: newsContent.category.title,
//             key: 'category'
//           })
//         }
//         break
//     }
    
//     return items
//   }
  
//   const metaItems = getMetaItems()
  
//   return (
//     <div className="flex items-center space-x-4 text-sm text-gray-500 mb-3">
//       {metaItems.map(({ icon: Icon, text, key, className }) => (
//         <div key={key} className={cn("flex items-center space-x-1", className)}>
//           <Icon className="w-4 h-4" />
//           <span>{text}</span>
//         </div>
//       ))}
//     </div>
//   )
// })

// MetaInfo.displayName = 'MetaInfo'

// const StatusBadges = React.memo<{ content: Content; type: ContentType }>(({ content, type }) => {
//   const getBadges = () => {
//     const badges = []
    
//     // Sticky/Featured badges
//     if (content.isSticky) {
//       const label = type === 'news' ? 'Breaking' : 'Featured'
//       badges.push({
//         text: label,
//         className: 'bg-yellow-100 text-yellow-800',
//         position: 'top-left'
//       })
//     }
    
//     // Type-specific badges
//     switch (type) {
//       case 'blog':
//         const blogContent = content as BlogContent
//         if (blogContent.featuredBlog) {
//           badges.push({
//             text: "Editor's Pick",
//             className: 'bg-blue-100 text-blue-800',
//             position: 'top-right'
//           })
//         }
//         break
        
//       case 'event':
//         const eventContent = content as EventContent
//         const isUpcoming = isUpcomingEvent(eventContent.startDate || eventContent.eventDate)
//         badges.push({
//           text: isUpcoming ? 'Upcoming' : 'Past Event',
//           className: isUpcoming ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800',
//           position: 'top-left'
//         })
//         if (eventContent.isVirtual) {
//           badges.push({
//             text: 'Virtual Event',
//             className: 'bg-purple-100 text-purple-800',
//             position: 'bottom-left'
//           })
//         }
//         break
        
//       case 'news':
//         const newsContent = content as NewsContent
//         if (newsContent.featuredNews) {
//           badges.push({
//             text: 'Featured',
//             className: 'bg-red-100 text-red-800',
//             position: 'top-right'
//           })
//         }
//         if (newsContent.category) {
//           badges.push({
//             text: newsContent.category.title,
//             className: 'bg-blue-100 text-blue-800',
//             position: 'bottom-left'
//           })
//         }
//         break
//     }
    
//     return badges
//   }
  
//   const badges = getBadges()
  
//   return (
//     <>
//       {badges.map((badge, index) => {
//         const positionClasses = {
//           'top-left': 'absolute top-4 left-4',
//           'top-right': 'absolute top-4 right-4',
//           'bottom-left': 'absolute bottom-4 left-4',
//           'bottom-right': 'absolute bottom-4 right-4'
//         }
        
//         return (
//           <div key={index} className={positionClasses[badge.position as keyof typeof positionClasses]}>
//             <span className={cn(
//               "inline-flex items-center px-3 py-1 rounded-full text-xs font-medium",
//               badge.className
//             )}>
//               {badge.text}
//             </span>
//           </div>
//         )
//       })}
//     </>
//   )
// })

// StatusBadges.displayName = 'StatusBadges'

// const ActionButtons = React.memo<{ content: Content; type: ContentType }>(({ content, type }) => {
//   const getHref = () => {
//     switch (type) {
//       case 'blog': return `/blog/${content.slug.current}`
//       case 'event': return `/events/${content.slug.current}`
//       case 'news': return `/news/${content.slug.current}`
//       default: return '#'
//     }
//   }
  
//   const getActionText = () => {
//     switch (type) {
//       case 'blog': return 'Read More'
//       case 'event': return 'Learn More'
//       case 'news': return 'Read Full Story'
//       default: return 'Learn More'
//     }
//   }
  
//   const href = getHref()
//   const actionText = getActionText()
  
//   return (
//     <div className="flex items-center justify-between">
//       <Link
//         href={href}
//         className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium text-sm group-hover:gap-2 transition-all duration-200"
//       >
//         {actionText}
//         <ArrowRight className="w-4 h-4 ml-1 transition-transform duration-200 group-hover:translate-x-1" />
//       </Link>
      
//       {/* Event-specific registration button */}
//       {type === 'event' && (() => {
//         const eventContent = content as EventContent
//         const isUpcoming = isUpcomingEvent(eventContent.startDate || eventContent.eventDate)
        
//         if (eventContent.registrationLink && isUpcoming) {
//           return (
//             <a
//               href={eventContent.registrationLink}
//               target="_blank"
//               rel="noopener noreferrer"
//               className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors duration-200"
//             >
//               Register
//               <ExternalLink className="w-4 h-4 ml-1" />
//             </a>
//           )
//         }
//         return null
//       })()}
//     </div>
//   )
// })

// ActionButtons.displayName = 'ActionButtons'

// const ContentCard = React.memo<ContentCardProps>(({ 
//   content, 
//   type, 
//   featured = false, 
//   showAuthor = false,
//   className 
// }) => {
//   const imageUrl = content.mainImage 
//     ? urlFor(content.mainImage)
//         .width(featured ? 600 : 400)
//         .height(featured ? 400 : 250)
//         .quality(85)
//         .url()
//     : null

//   const excerpt = content.excerpt || generateExcerpt(content.mainContent)
//   const readingTime = type === 'blog' ? getReadingTime(content.mainContent) : undefined
//   const href = `/${type === 'blog' ? 'blog' : type === 'event' ? 'events' : 'news'}/${content.slug.current}`

//   return (
//     <article className={cn(
//       "group bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden",
//       featured && "lg:col-span-2",
//       className
//     )}>
//       {/* Image */}
//       {imageUrl && (
//         <div className="relative overflow-hidden">
//           <Link href={href}>
//             <Image
//               src={imageUrl}
//               alt={content.title}
//               width={featured ? 600 : 400}
//               height={featured ? 400 : 250}
//               className={cn(
//                 "w-full object-cover transition-transform duration-300 group-hover:scale-105",
//                 featured ? "h-64 lg:h-80" : "h-48"
//               )}
//             />
//           </Link>
          
//           <StatusBadges content={content} type={type} />
//         </div>
//       )}
      
//       {/* Content */}
//       <div className={cn("p-6", featured && "lg:p-8")}>
//         {/* Event Date Display */}
//         {type === 'event' && (() => {
//           const eventContent = content as EventContent
//           const eventDate = eventContent.startDate || eventContent.eventDate
//           const isUpcoming = isUpcomingEvent(eventDate)
          
//           if (eventDate) {
//             return (
//               <div className="flex items-center space-x-2 mb-3">
//                 <div className={cn(
//                   "flex items-center justify-center w-12 h-12 rounded-lg",
//                   isUpcoming ? "bg-blue-100" : "bg-gray-100"
//                 )}>
//                   <Calendar className={cn(
//                     "w-6 h-6",
//                     isUpcoming ? "text-blue-600" : "text-gray-600"
//                   )} />
//                 </div>
//                 <div>
//                   <div className={cn(
//                     "text-sm font-medium",
//                     isUpcoming ? "text-blue-600" : "text-gray-600"
//                   )}>
//                     {formatDate(eventDate)}
//                   </div>
//                   {eventContent.eventTime && (
//                     <div className="text-xs text-gray-500">
//                       {eventContent.eventTime}
//                     </div>
//                   )}
//                 </div>
//               </div>
//             )
//           }
//           return null
//         })()}
        
//         {/* Meta Information */}
//         <MetaInfo content={content} type={type} readingTime={readingTime} />
        
//         {/* Title */}
//         <h3 className={cn(
//           "font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors duration-200",
//           featured ? "text-xl lg:text-2xl" : "text-lg"
//         )}>
//           <Link href={href} className="hover:underline">
//             {content.title}
//           </Link>
//         </h3>
        
//         {/* Excerpt */}
//         {excerpt && (
//           <p className={cn(
//             "text-gray-600 mb-4 leading-relaxed",
//             featured ? "text-base" : "text-sm"
//           )}>
//             {excerpt}
//           </p>
//         )}
        
//         {/* Author Info (for featured blog posts) */}
//         {featured && type === 'blog' && showAuthor && (() => {
//           const blogContent = content as BlogContent
//           if (blogContent.blogsAuthor) {
//             return (
//               <div className="flex items-center space-x-3 mb-4 p-4 bg-gray-50 rounded-lg">
//                 {blogContent.blogsAuthor.image && (
//                   <Image
//                     src={urlFor(blogContent.blogsAuthor.image).width(48).height(48).url()}
//                     alt={blogContent.blogsAuthor.name}
//                     width={48}
//                     height={48}
//                     className="w-12 h-12 rounded-full object-cover"
//                   />
//                 )}
//                 <div>
//                   <div className="font-medium text-gray-900">
//                     {blogContent.blogsAuthor.name}
//                   </div>
//                   {blogContent.blogsAuthor.bio && (
//                     <div className="text-sm text-gray-600">
//                       {blogContent.blogsAuthor.bio}
//                     </div>
//                   )}
//                 </div>
//               </div>
//             )
//           }
//           return null
//         })()}
        
//         {/* Action Buttons */}
//         <ActionButtons content={content} type={type} />
        
//         {/* Featured Event Additional Info */}
//         {featured && type === 'event' && (() => {
//           const eventContent = content as EventContent
//           const isUpcoming = isUpcomingEvent(eventContent.startDate || eventContent.eventDate)
          
//           return (
//             <div className="mt-6 pt-6 border-t border-gray-200">
//               <div className="grid grid-cols-2 gap-4 text-sm">
//                 <div>
//                   <span className="font-medium text-gray-900">Event Type:</span>
//                   <span className="ml-2 text-gray-600">
//                     {eventContent.isVirtual ? 'Virtual' : 'In-Person'}
//                   </span>
//                 </div>
//                 <div>
//                   <span className="font-medium text-gray-900">Status:</span>
//                   <span className={cn(
//                     "ml-2",
//                     isUpcoming ? "text-green-600" : "text-gray-600"
//                   )}>
//                     {isUpcoming ? 'Upcoming' : 'Completed'}
//                   </span>
//                 </div>
//               </div>
//             </div>
//           )
//         })()}
//       </div>
//     </article>
//   )
// })

// ContentCard.displayName = 'ContentCard'

// export default ContentCard
// export type { ContentCardProps, Content, ContentType }