// Document schemas - Main content types
import blockContent from '../blockContent'
import blogs from './blogs'
import blogsAuthor from './blogsAuthor'
import categories from './categories'
import events from './events'
import news from './news'
import navigationMenu from './navigationMenu'
import page from './page'
import blocks from './blocks'
import siteSettings from './siteSettings'
import tags from './tags'
import faqs from './faqs'
import faqCategories from './faqCategories'

export const documentSchemas = [
  page,
  navigationMenu,
  siteSettings,
  blogs,
  blogsAuthor,
  events,
  news,
  categories,
  tags,
  blocks,
  faqs,
  faqCategories,
  blockContent,
]