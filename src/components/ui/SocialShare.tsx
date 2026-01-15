// 'use client'

// import { useState } from 'react'
// import { Share2, Facebook, Twitter, Linkedin, Link, Mail, MessageCircle, Check } from 'lucide-react'
// import { cn } from '@/lib/utils'

// interface SocialShareProps {
//   url: string
//   title: string
//   description?: string
//   className?: string
//   size?: 'sm' | 'md' | 'lg'
//   variant?: 'default' | 'minimal' | 'floating'
//   showLabels?: boolean
// }

// export default function SocialShare({
//   url,
//   title,
//   description = '',
//   className,
//   size = 'md',
//   variant = 'default',
//   showLabels = false
// }: SocialShareProps) {
//   const [copied, setCopied] = useState(false)
  
//   const encodedUrl = encodeURIComponent(url)
//   const encodedTitle = encodeURIComponent(title)
//   const encodedDescription = encodeURIComponent(description)
  
//   const shareLinks = {
//     facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
//     twitter: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
//     linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
//     email: `mailto:?subject=${encodedTitle}&body=${encodedDescription}%0A%0A${encodedUrl}`,
//     whatsapp: `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`
//   }
  
//   const copyToClipboard = async () => {
//     try {
//       await navigator.clipboard.writeText(url)
//       setCopied(true)
//       setTimeout(() => setCopied(false), 2000)
//     } catch (err) {
//       console.error('Failed to copy URL:', err)
//     }
//   }
  
//   const openShareWindow = (shareUrl: string) => {
//     window.open(
//       shareUrl,
//       'share-window',
//       'width=600,height=400,scrollbars=yes,resizable=yes'
//     )
//   }
  
//   const sizeClasses = {
//     sm: 'w-8 h-8',
//     md: 'w-10 h-10',
//     lg: 'w-12 h-12'
//   }
  
//   const iconSizes = {
//     sm: 'w-4 h-4',
//     md: 'w-5 h-5',
//     lg: 'w-6 h-6'
//   }
  
//   if (variant === 'floating') {
//     return (
//       <FloatingSocialShare
//         url={url}
//         title={title}
//         description={description}
//         className={className}
//       />
//     )
//   }
  
//   if (variant === 'minimal') {
//     return (
//       <MinimalSocialShare
//         url={url}
//         title={title}
//         description={description}
//         className={className}
//         size={size}
//       />
//     )
//   }
  
//   return (
//     <div className={cn('flex flex-wrap gap-3', className)}>
//       {/* Facebook */}
//       <button
//         onClick={() => openShareWindow(shareLinks.facebook)}
//         className={cn(
//           'flex items-center justify-center rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors duration-200',
//           sizeClasses[size],
//           showLabels && 'px-4 w-auto space-x-2'
//         )}
//         aria-label="Share on Facebook"
//       >
//         <Facebook className={iconSizes[size]} />
//         {showLabels && <span className="text-sm font-medium">Facebook</span>}
//       </button>
      
//       {/* Twitter */}
//       <button
//         onClick={() => openShareWindow(shareLinks.twitter)}
//         className={cn(
//           'flex items-center justify-center rounded-lg bg-sky-500 text-white hover:bg-sky-600 transition-colors duration-200',
//           sizeClasses[size],
//           showLabels && 'px-4 w-auto space-x-2'
//         )}
//         aria-label="Share on Twitter"
//       >
//         <Twitter className={iconSizes[size]} />
//         {showLabels && <span className="text-sm font-medium">Twitter</span>}
//       </button>
      
//       {/* LinkedIn */}
//       <button
//         onClick={() => openShareWindow(shareLinks.linkedin)}
//         className={cn(
//           'flex items-center justify-center rounded-lg bg-blue-700 text-white hover:bg-blue-800 transition-colors duration-200',
//           sizeClasses[size],
//           showLabels && 'px-4 w-auto space-x-2'
//         )}
//         aria-label="Share on LinkedIn"
//       >
//         <Linkedin className={iconSizes[size]} />
//         {showLabels && <span className="text-sm font-medium">LinkedIn</span>}
//       </button>
      
//       {/* WhatsApp */}
//       <button
//         onClick={() => openShareWindow(shareLinks.whatsapp)}
//         className={cn(
//           'flex items-center justify-center rounded-lg bg-green-500 text-white hover:bg-green-600 transition-colors duration-200',
//           sizeClasses[size],
//           showLabels && 'px-4 w-auto space-x-2'
//         )}
//         aria-label="Share on WhatsApp"
//       >
//         <MessageCircle className={iconSizes[size]} />
//         {showLabels && <span className="text-sm font-medium">WhatsApp</span>}
//       </button>
      
//       {/* Email */}
//       <a
//         href={shareLinks.email}
//         className={cn(
//           'flex items-center justify-center rounded-lg bg-gray-600 text-white hover:bg-gray-700 transition-colors duration-200',
//           sizeClasses[size],
//           showLabels && 'px-4 w-auto space-x-2'
//         )}
//         aria-label="Share via Email"
//       >
//         <Mail className={iconSizes[size]} />
//         {showLabels && <span className="text-sm font-medium">Email</span>}
//       </a>
      
//       {/* Copy Link */}
//       <button
//         onClick={copyToClipboard}
//         className={cn(
//           'flex items-center justify-center rounded-lg border-2 border-gray-300 text-gray-600 hover:border-gray-400 hover:text-gray-700 transition-all duration-200',
//           sizeClasses[size],
//           showLabels && 'px-4 w-auto space-x-2',
//           copied && 'border-green-500 text-green-600'
//         )}
//         aria-label="Copy link"
//       >
//         {copied ? (
//           <Check className={iconSizes[size]} />
//         ) : (
//           <Link className={iconSizes[size]} />
//         )}
//         {showLabels && (
//           <span className="text-sm font-medium">
//             {copied ? 'Copied!' : 'Copy Link'}
//           </span>
//         )}
//       </button>
//     </div>
//   )
// }

// // Minimal Social Share (just icons)
// function MinimalSocialShare({
//   url,
//   title,
//   className,
//   size = 'md'
// }: Omit<SocialShareProps, 'variant' | 'showLabels' | 'description'>) {
//   const [copied, setCopied] = useState(false)
  
//   const encodedUrl = encodeURIComponent(url)
//   const encodedTitle = encodeURIComponent(title)
  
//   const shareLinks = {
//     facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
//     twitter: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
//     linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`
//   }
  
//   const copyToClipboard = async () => {
//     try {
//       await navigator.clipboard.writeText(url)
//       setCopied(true)
//       setTimeout(() => setCopied(false), 2000)
//     } catch (err) {
//       console.error('Failed to copy URL:', err)
//     }
//   }
  
//   const openShareWindow = (shareUrl: string) => {
//     window.open(
//       shareUrl,
//       'share-window',
//       'width=600,height=400,scrollbars=yes,resizable=yes'
//     )
//   }
  
//   const iconSizes = {
//     sm: 'w-4 h-4',
//     md: 'w-5 h-5',
//     lg: 'w-6 h-6'
//   }
  
//   return (
//     <div className={cn('flex items-center space-x-3', className)}>
//       <button
//         onClick={() => openShareWindow(shareLinks.facebook)}
//         className="text-gray-500 hover:text-blue-600 transition-colors duration-200"
//         aria-label="Share on Facebook"
//       >
//         <Facebook className={iconSizes[size]} />
//       </button>
      
//       <button
//         onClick={() => openShareWindow(shareLinks.twitter)}
//         className="text-gray-500 hover:text-sky-500 transition-colors duration-200"
//         aria-label="Share on Twitter"
//       >
//         <Twitter className={iconSizes[size]} />
//       </button>
      
//       <button
//         onClick={() => openShareWindow(shareLinks.linkedin)}
//         className="text-gray-500 hover:text-blue-700 transition-colors duration-200"
//         aria-label="Share on LinkedIn"
//       >
//         <Linkedin className={iconSizes[size]} />
//       </button>
      
//       <button
//         onClick={copyToClipboard}
//         className={cn(
//           'text-gray-500 hover:text-gray-700 transition-colors duration-200',
//           copied && 'text-green-600'
//         )}
//         aria-label="Copy link"
//       >
//         {copied ? (
//           <Check className={iconSizes[size]} />
//         ) : (
//           <Link className={iconSizes[size]} />
//         )}
//       </button>
//     </div>
//   )
// }

// // Floating Social Share (sticky sidebar)
// function FloatingSocialShare({
//   url,
//   title,
//   className
// }: Omit<SocialShareProps, 'variant' | 'size' | 'showLabels' | 'description'>) {
//   const [copied, setCopied] = useState(false)
  
//   const encodedUrl = encodeURIComponent(url)
//   const encodedTitle = encodeURIComponent(title)
  
//   const shareLinks = {
//     facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
//     twitter: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
//     linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`
//   }
  
//   const copyToClipboard = async () => {
//     try {
//       await navigator.clipboard.writeText(url)
//       setCopied(true)
//       setTimeout(() => setCopied(false), 2000)
//     } catch (err) {
//       console.error('Failed to copy URL:', err)
//     }
//   }
  
//   const openShareWindow = (shareUrl: string) => {
//     window.open(
//       shareUrl,
//       'share-window',
//       'width=600,height=400,scrollbars=yes,resizable=yes'
//     )
//   }
  
//   return (
//     <div className={cn(
//       'fixed left-4 top-1/2 transform -translate-y-1/2 z-40 hidden lg:block',
//       className
//     )}>
//       <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-2 space-y-2">
//         <div className="text-xs text-gray-500 text-center mb-2">
//           <Share2 className="w-4 h-4 mx-auto" />
//         </div>
        
//         <button
//           onClick={() => openShareWindow(shareLinks.facebook)}
//           className="w-10 h-10 flex items-center justify-center rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors duration-200"
//           aria-label="Share on Facebook"
//         >
//           <Facebook className="w-5 h-5" />
//         </button>
        
//         <button
//           onClick={() => openShareWindow(shareLinks.twitter)}
//           className="w-10 h-10 flex items-center justify-center rounded-lg bg-sky-500 text-white hover:bg-sky-600 transition-colors duration-200"
//           aria-label="Share on Twitter"
//         >
//           <Twitter className="w-5 h-5" />
//         </button>
        
//         <button
//           onClick={() => openShareWindow(shareLinks.linkedin)}
//           className="w-10 h-10 flex items-center justify-center rounded-lg bg-blue-700 text-white hover:bg-blue-800 transition-colors duration-200"
//           aria-label="Share on LinkedIn"
//         >
//           <Linkedin className="w-5 h-5" />
//         </button>
        
//         <button
//           onClick={copyToClipboard}
//           className={cn(
//             'w-10 h-10 flex items-center justify-center rounded-lg border-2 border-gray-300 text-gray-600 hover:border-gray-400 hover:text-gray-700 transition-all duration-200',
//             copied && 'border-green-500 text-green-600'
//           )}
//           aria-label="Copy link"
//         >
//           {copied ? (
//             <Check className="w-5 h-5" />
//           ) : (
//             <Link className="w-5 h-5" />
//           )}
//         </button>
//       </div>
//     </div>
//   )
// }

// // Native Share API (for mobile devices)
// export function NativeShare({
//   url,
//   title,
//   description = ''
// }: {
//   url: string
//   title: string
//   description?: string
// }) {
//   const handleNativeShare = async () => {
//     if (navigator.share) {
//       try {
//         await navigator.share({
//           title,
//           text: description,
//           url
//         })
//       } catch (err) {
//         console.error('Error sharing:', err)
//       }
//     }
//   }
  
//   // Only show if native sharing is supported
//   if (!navigator.share) {
//     return null
//   }
  
//   return (
//     <button
//       onClick={handleNativeShare}
//       className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
//     >
//       <Share2 className="w-4 h-4" />
//       <span>Share</span>
//     </button>
//   )
// }