// Import necessary icon for visual representation in the CMS
import { GiHamburgerMenu } from 'react-icons/gi'

/**
 * Defines the schema for the 'navigationMenu' document in a content management system.
 * This schema helps in structuring the navigation menu of a website.
 */

const navigationMenu = {
  name: 'navigationMenu',
  title: 'Navigation Menu',
  type: 'document',
  icon: GiHamburgerMenu, // Icon representing the navigation menu in the CMS

  // Fields defining the properties and content of the navigation menu
  fields: [
    {
      name: 'title',
      type: 'string',
      title: 'Title',
    },
    {
      name: 'slug',
      type: 'docSlug',// Custom slug type to generate URL-friendly identifier from the title
    },
    {
      name: 'items',
      type: 'array',
      title: 'Navigation items',
      of: [{type: 'navigationItem'}],// Array of navigation items, each of type 'navigationItem'
    },
    {
      name: 'include_in_sitemap',
      title: 'Include in Sitemap',
      type: 'boolean',
      description: 'Whether to include this navigation menu in the sitemap.',
      initialValue: true,
    },
  ],
}
// Export the navigation menu schema as the default export to make it available for use in Sanity Studio
export default navigationMenu
