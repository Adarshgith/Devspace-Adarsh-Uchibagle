import type { Rule } from '@sanity/types';

import { BiGlobe } from 'react-icons/bi';

const page = {
  name: 'page',
  title: 'Page',
  type: 'document',
  icon: BiGlobe,
  groups: [
    {
      name: 'mainContent',
      title: 'Main Content',
      default: true,
    },
    {
      name: 'advanced',
      title: 'Advanced Options',
    },
    {
      name: 'pageSettings',
      title: 'SEO + Page Settings',
    },
  ],
  fields: [
    {
      name: 'title',
      type: 'string',
      title: 'Title',
      validation: (Rule: Rule) => Rule.required().error('The page title is required'),
      group: 'mainContent',
    },
    {
      name: 'slug',
      type: 'slug',
      title: 'Slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: (Rule: Rule) => Rule.required().error('A slug for the page is required'),
      group: 'mainContent',
    },
    {
      name: 'heroSection',
      title: 'Hero Section',
      type: 'heroSection',
      group: 'mainContent',
    },
    {
      name: 'mainContent',
      title: 'Main Content',
      type: 'pageSection',
      group: 'mainContent',
    },
    {
      name: 'showSocialShare',
      type: 'boolean',
      title: 'Show Social Share',
      group: 'mainContent',
    },
     {
      name: 'noIndex',
      title: 'No-Index (Override Global Setting)',
      type: 'boolean',
      description: 'Set to true to noindex this page regardless of global settings.',
      group: 'pageSettings',
    },
    {
      name: 'include_in_sitemap',
      type: 'boolean',
      title: 'Include in sitemap',
      initialValue: false,
      group: 'pageSettings',
    },
  ],
}

export default page
