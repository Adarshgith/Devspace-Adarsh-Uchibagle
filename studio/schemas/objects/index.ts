// Object schemas - Complex object types and components
import FeaturedBlogSelector from './FeaturedBlogSelector'
import FeaturedNewsSelector from './FeaturedNewsSelector'
import homeFeatured from './homeFeatured'
import advanceOptions from './advanceOptions'
import advancedTable from './advancedTable'
import allEvents from './allEvents'
import availablePositions from './availablePositions'
import banner from './banner'
import bannerFullWidth from './bannerFullWidth'
import button from './button'
import Card from './cards'
import carousel from './carousel'
import contentBlock from './contentBlock'
import contentSnippet from './contentSnippet'
import faq from './faq'
import FAQSection from './faqSection'
import googleMap from './googleMap'
import headerSection from './headerSection'
import heroSection from './heroSection'
import homeHeroSection from './homeHeroSection'
import hubspotSection from './hubspotSection'
import imageGrid from './imageGrid'
import imageTextBlock from './imageTextBlock'
import infoBanner from './infoBanner'
import infoBox from './infoBox'
import jumpToSection from './jumpToSection'
import link from './link'
import modalWithButton from './modal'
import navItem from './navItem'
import pageSection from './pageSection'
import privacyPolicy from './privacyPolicy'
import sectionBanner from './sectionBanner'
import seo from './seo'
import seoCategory from './seoCategory'
import singleImage from './singleImage'
import subNavItem from './subNavItem'
import tab from './tab'
// import tableComponent from './table'
import testimonials from './testimonals'
import trackRecord from './trackRecord'
import upcomingEvents from './upcoming-events'
import blogListing from './blogListing'
import heroPortfolio from './heroPortfolio'

export const objectSchemas = [
  // Navigation and layout
  navItem,
  subNavItem,
  link,
  pageSection,

  // Content sections
  homeHeroSection,
  heroSection,
  headerSection,
  infoBox,
  homeFeatured,
  contentBlock,
  contentSnippet,

  // Interactive components
  button,
  modalWithButton,
  tab,

  // Media and visual
  banner,
  sectionBanner,
  bannerFullWidth,
  singleImage,
  imageTextBlock,
  imageGrid,
  carousel,

  // Content features
  FeaturedBlogSelector,
  FeaturedNewsSelector,
  testimonials,
  faq,
  FAQSection,

  // Events and dynamic content
  allEvents,
  upcomingEvents,

  // Specialized components
  googleMap,
  hubspotSection,
  trackRecord,
  // tableComponent,
  advancedTable,
  availablePositions,
  jumpToSection,

  // Utility and configuration
  Card,
  privacyPolicy,
  seo,
  seoCategory,
  advanceOptions,
  infoBanner,

  //Blog Listing

  blogListing,
  heroPortfolio,
]

