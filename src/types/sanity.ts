// import { SanityImageSource } from '@sanity/image-url/lib/types/types'

// Base Sanity document interface
export interface SanityDocument {
  _id: string
  _type: string
  _createdAt: string
  _updatedAt: string
  _rev: string
}

// Slug interface
export interface Slug {
  current: string
  _type: 'slug'
}

// Image interface
export interface SanityImage {
  _type: 'image'
  asset: {
    _ref: string
    _type: 'reference'
  }
  hotspot?: {
    x: number
    y: number
    height: number
    width: number
  }
  crop?: {
    top: number
    bottom: number
    left: number
    right: number
  }
  alt?: string
}

// Reference interface
export interface Reference {
  _type: 'reference'
  _ref: string
}

// Blog Author interface
export interface BlogAuthor extends SanityDocument {
  _type: 'blogsAuthor'
  name: string
  slug: Slug
  image?: SanityImage
  bio?: string
  assignTo: string
}

// Category interface
export interface Category extends SanityDocument {
  _type: 'categories'
  title: string
  slug: Slug
  description?: string
  assignTo: string
}

// Tag interface
export interface Tag extends SanityDocument {
  _type: 'tags'
  title: string
  slug: Slug
  description?: string
}

// Page Section interface (simplified)
export interface PageSection {
  _type: 'pageSection'
  _key?: string
  sectionTitle?: string
  rows?: Array<{
    _type: 'row'
    _key?: string
    rowTitle?: string
    rowType?: 'full' | 'standard'
    backgroundColor?: 'none' | 'whiteYellow' | 'backgroundImage'
    bannerImage?: any
    sectionType?: string
    id?: string
    columns?: number
    showColumn1?: boolean
    showColumn2?: boolean
    showColumn3?: boolean
    column1?: unknown[]
    column2?: unknown[]
    column3?: unknown[]
  }>
}

// Blog interface
export interface Blog extends SanityDocument {
  _type: 'blogs'
  title: string
  slug: Slug
  resourceId: string
  excerpt: string
  mainImage?: SanityImage
  blogsAuthor: Reference
  mainContent?: PageSection
  content?: PageSection
  isSticky?: boolean
  featuredBlog?: boolean
  publishDate: string
}

// Event interface
export interface Event extends SanityDocument {
  _type: 'events'
  title: string
  slug: Slug
  excerpt?: string
  mainImage?: SanityImage
  startDate: string
  endDate?: string
  mainContent?: PageSection
  isSticky?: boolean
  featuredEvent?: boolean
  eventDate?: string
  eventTime?: string
  isVirtual?: boolean
  location?: string
  registrationLink?: string
}

// News interface
export interface News extends SanityDocument {
  _type: 'news'
  title: string
  slug: Slug
  category: Reference
  excerpt?: string
  mainImage?: SanityImage
  mainContent?: PageSection
  isSticky?: boolean
  featuredNews?: boolean
}

// Page interface
export interface Page extends SanityDocument {
  _type: 'page'
  title: string
  slug: Slug
  heroSection?: unknown
  mainContent?: PageSection
  seo?: SEOFields
  showSocialShare?: boolean
  noIndex?: boolean
  include_in_sitemap?: boolean
}

// SEO Fields interface
export interface SEOFields {
  _type: 'seoFields'
  metaTitle?: string
  metaDescription?: string
  metaKeywords?: string
  openGraphImage?: SanityImage
  twitterCard?: string
}

// Site Settings interface
export interface SiteSettings extends SanityDocument {
  _type: 'siteSettings'
  title: string
  description: string
  siteLogo?: SanityImage
  footerLogo?: SanityImage
  copyright: string
  footerButton?: {
    footerButtonText: string
    footerButtonLink: string
  }
  footerSubscribeForm?: string
  address: string
  phone: string
  email: string
  linkedInLink?: string
  twitterLink?: string
  facebookLink?: string
  instagramLink?: string
  noIndex?: boolean
  robotsTxt?: string
  sitemapXml?: string
}

// Navigation Menu interface
export interface NavigationMenu extends SanityDocument {
  _type: 'navigationMenu'
  title: string
  menuItems?: Array<{
    _type: 'navItem'
    title: string
    link?: string
    page?: Reference
    subNavItems?: Array<{
      _type: 'subNavItem'
      title: string
      link?: string
      page?: Reference
    }>
  }>
}

// Resource Section interface for resourceSection schema
export interface ResourceSectionType {
  _type: 'resourceSection'
  title: string
  items: ResourceItemType[]
  backgroundColor?: 'light-cyan' | 'white' | 'gray-50'
  layout?: '2-columns' | '3-columns' | '4-columns'
}

// Resource Item interface
export interface ResourceItemType {
  _type: 'resourceItem'
  title: string
  description: string
  image?: SanityImage
  category?: string
  link?: {
    url: string
    openInNewTab?: boolean
  }
}



// Button interface for button schema
export interface ButtonType {
  _type: 'button'
  text?: string
  url?: string
  openInNewTab?: boolean
  style?: 'primaryBtn' | 'secondaryBtn' | 'tertiarybtn'
}

// Banner interface for banner schema
export interface BannerType {
  _type: 'banner'
  heading: string
  subheading?: string
  content?: any[] // Rich text content
  button?: ButtonType[]
}

// FAQ interface
export interface FAQ extends SanityDocument {
  _type: 'faqs'
  question: string
  answer: unknown[] // Rich text content
  category?: Reference
  isSticky?: boolean
  featuredFaq?: boolean
}

// FAQ Category interface
export interface FAQCategory extends SanityDocument {
  _type: 'faqCategories'
  title: string
  slug: Slug
  description?: string
}






// ─────────────────────────────────────────────────────────────────────────────
// Hero Portfolio Types
// Add these inside src/types/sanity.ts
// ─────────────────────────────────────────────────────────────────────────────

// Social platform options matching the Sanity schema
export type SocialPlatform =
  | 'github'
  | 'linkedin'
  | 'twitter'
  | 'instagram'
  | 'youtube'
  | 'other'

// Individual social link
export interface HeroSocialLink {
  platform: SocialPlatform
  url: string
  label?: string
}

// Hero Portfolio block type
export interface HeroPortfolioType {
  _type: 'heroPortfolio'

  // Left side
  greeting: string                  // e.g. "Hi!, I'm a"
  name: string                      // e.g. "Software Developer"
  description: string               // Short bio, max 300 chars
  buttons?: ButtonType[]            // Reuses existing ButtonType from sanity.ts

  // Right side
  profileImage: SanityImage         // Reuses existing SanityImage from sanity.ts
  profileImageAlt?: string

  // Social links
  socialLinks?: HeroSocialLink[]    // Max 5
}


// ─────────────────────────────────────────────────────────────────────────────
// About Me Types
// Add these inside src/types/sanity.ts
// ─────────────────────────────────────────────────────────────────────────────

// About Me block type
export interface AboutMeType {
  _type: 'aboutMe'

  // Section label & heading
  sectionLabel?: string               // e.g. "About Me"
  heading: string                     // e.g. "Who I Am"

  // Image
  profileImage?: SanityImage          // Reuses existing SanityImage from sanity.ts
  profileImageAlt?: string

  // Content
  shortBio: string                    // max 300 chars
  yearsOfExperience?: number
  location?: string                   // e.g. "Nagpur, India"

  // CTA
  knowMoreButton?: ButtonType         // Reuses existing ButtonType from sanity.ts
}

// ─────────────────────────────────────────────────────────────────────────────
// Experience Section Types
// Add these inside src/types/sanity.ts
// ─────────────────────────────────────────────────────────────────────────────

// Single experience entry
export interface ExperienceEntry {
  jobTitle: string
  companyName: string
  companyLogo?: SanityImage        // Reuses existing SanityImage from sanity.ts
  employmentType?: string          // e.g. "Full Time", "Internship", "Contract"
  startDate: string                // e.g. "Sep 2025"
  endDate?: string                 // e.g. "Present" or "Apr 2025"
  description?: any[]              // Portable Text blocks
}

// Experience Section block type
export interface ExperienceSectionType {
  _type: 'experienceSection'
  sectionLabel?: string            // e.g. "My Journey"
  heading: string                  // e.g. "Work Experience"
  experiences?: ExperienceEntry[]  // Array of experience entries, latest first
}

// Populated interfaces (with resolved references)
export interface PopulatedBlog extends Omit<Blog, 'blogsAuthor'> {
  blogsAuthor: BlogAuthor
}

export interface PopulatedNews extends Omit<News, 'category'> {
  category: Category
}

export interface PopulatedFAQ extends Omit<FAQ, 'category'> {
  category?: FAQCategory
}
