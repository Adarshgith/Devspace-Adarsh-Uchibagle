import type { Rule } from '@sanity/types'
import { BsFillBoxFill } from 'react-icons/bs'

const infoBox = {
  name: 'infoBox',
  title: 'Info Box',
  icon: BsFillBoxFill,
  type: 'object',

  fields: [
    {
      name: 'title',
      title: 'Title',
      type: 'string',
    },
    {
      name: 'image',
      title: 'Image',
      type: 'image',
      options: {
        hotspot: true,
      },
    },
    {
      name: 'imagePosition',
      title: 'Image Position',
      type: 'string',
      options: {
        list: [
          {title: 'Top', value: 'top'},
          {title: 'Bottom', value: 'bottom'},
          {title: 'Right', value: 'right'},
          {title: 'Left', value: 'left'},
        ],
        layout: 'dropdown', 
      },
    },
    {
      name: 'video',
      title: 'Video URL',
      type: 'url',
      description: 'Enter the URL of the video (e.g., YouTube or Vimeo link)',
    },
    {
      name: 'textSectionPadding',
      title: 'Text Box Padding',
      type: 'string',
    },
    {
      name: 'sectionTitle',
      title: 'Section Title',
      type: 'string',
    },
    {
      name: 'content',
      title: 'Content',
      type: 'array',
      of: [
        {
          type: 'block'
        },
        {
          type: 'image'
        },
      ],
    },
    {
      name: 'button',
      type: 'button',
      title: 'Button',
    },
  ],
}

export default infoBox
