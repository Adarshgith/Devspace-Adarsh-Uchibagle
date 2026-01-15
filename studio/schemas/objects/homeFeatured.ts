import type { Rule } from '@sanity/types'
import { MdFeaturedPlayList } from 'react-icons/md'

const homeFeatured = {
  name: 'homeFeatured',
  title: 'Home Featured Section',
  icon: MdFeaturedPlayList,
  type: 'object',

  fields: [
    {
      name: 'mainHeading',
      title: 'Main Heading',
      type: 'string',
      validation: (Rule: Rule) => Rule.required(),
    },
    {
      name: 'subHeading',
      title: 'Sub Heading',
      type: 'string',
    },
    {
      name: 'featuredItems',
      title: 'Featured Items',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'title',
              title: 'Title',
              type: 'string',
              validation: (Rule: Rule) => Rule.required(),
            },
            {
              name: 'image',
              title: 'Image',
              type: 'image',
              options: {
                hotspot: true,
              },
              fields: [
                {
                  name: 'alt',
                  title: 'Alt Text',
                  type: 'string',
                  validation: (Rule: Rule) => Rule.required(),
                }
              ],
              validation: (Rule: Rule) => Rule.required(),
            },
            {
              name: 'link',
              title: 'Link',
              type: 'url',
              description: 'Optional link when clicking the featured item',
            },
            {
              name: 'description',
              title: 'Description',
              type: 'text',
              rows: 2,
            }
          ]
        }
      ],
      validation: (Rule: Rule) => Rule.required().min(1).max(4),
    },
    {
      name: 'backgroundColor',
      title: 'Background Color',
      type: 'string',
      options: {
        list: [
          {title: 'White', value: 'bg-white'},
          {title: 'Light Gray', value: 'bg-gray-50'},
          {title: 'Dark', value: 'bg-gray-900'},
        ]
      }
    }
  ]
}

export default homeFeatured