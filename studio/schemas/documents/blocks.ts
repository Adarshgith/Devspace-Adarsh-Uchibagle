import type { Rule } from '@sanity/types';

import { BiGlobe } from 'react-icons/bi';

const blocks = {
  name: 'blocks',
  title: 'Blocks',
  type: 'document',
  icon: BiGlobe,
  groups: [
    {
      name: 'mainContent',
      title: 'Main Content',
      default: true,
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
        maxLength: 200,
      },
      group: 'mainContent',
    },
    // {
    //   name: 'identifier',
    //   type: 'string',
    //   title: 'Identifier',
    //   description: 'The identifier should match the title but exclude any special characters. for example: "Small G-protein Activators & Inhibitors" should be "small-g-protein-activators-inhibitors".',
    //   validation: (Rule: Rule) => Rule.required().error('The Identifier is required'),
    //   group: 'mainContent',
    // },
    {
      name: 'mainContent',
      title: 'Main Content',
      type: 'pageSection',
      group: 'mainContent',
    },
  ],
}

export default blocks
