// Document schemas - Main content types
import blockContent from '../blockContent'
import blogsAuthor from './blogsAuthor'
import categories from './categories'
import navigationMenu from './navigationMenu'
import page from './page'
import blocks from './blocks'
import siteSettings from './siteSettings'
import tags from './tags'
import project from './project'

export const documentSchemas = [
  page,
  navigationMenu,
  siteSettings,
  blogsAuthor,
  categories,
  tags,
  blocks,
  blockContent,
  project,
]