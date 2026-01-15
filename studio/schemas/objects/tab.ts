// Import types for validation from '@sanity/types'
import type { Rule } from '@sanity/types';
// Importing an icon from 'react-icons' for visual representation in the CMS
import { BsFolder2Open } from 'react-icons/bs';

/**
 * Schema definition for 'new tab', a document type in Sanity to manage
 * new tab content displayed as tabs on desktop and an accordion on mobile.
 */
const tab = {
  name: 'tab',
  title: 'Tab Section',
  icon: BsFolder2Open, // Icon for easier identification in the CMS
  type: 'object',

  // Fields defining the structure and content of the new tab section
  fields: [
    {
      name: 'sectionTitle',
      title: 'Section Title',
      type: 'string',
      validation: (Rule: Rule) => Rule.required().error('A section title is required'),
    },
    {
      name: 'tabs',
      title: 'Tabs',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'title',
              title: 'Tab Title',
              type: 'string',
              validation: (Rule: Rule) => Rule.required().error('A tab title is required'),
            },
            {
              name: 'tabContent',
              title: 'Tab Content',
              type: 'array',
              of: [
                {
                  type: 'block'
                }
              ],
              description: 'Tab Content',
            },
            {
              name: 'tabImage',
              title: 'Tab Image',
              type: 'image',
              options: { hotspot: true },
              description: 'Image displayed on both desktop and mobile views for this tab',
            },
            {
              name: 'buttonLabel',
              title: 'Button Label',
              type: 'string',
            },
            {
              name: 'buttonLink',
              title: 'Button Link',
              type: 'string',
              description: 'URL that the button links to',
            },
          ],
          preview: {
            select: {
              title: 'title',
              subtitle: 'contentTitle',
            },
          },
        },
      ],
    },
  ],
};

export default tab;




