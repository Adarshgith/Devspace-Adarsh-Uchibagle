import type { Rule } from '@sanity/types';
import { BsCardImage } from 'react-icons/bs';

const Card = {
  name: 'card',
  title: 'Card',
  icon: BsCardImage, 
  type: 'object', 

  fields: [
    {
      name: 'sectionTitle',
      title: 'Section Title',
      type: 'string',
      description: 'A section title for the card.',
    },
    {
      title: 'Enable Slider',
      name: 'enableSlider',
      type: 'boolean',
      initialValue: false,
      description: 'Toggle to enable slider',
    },
    {
      name: 'slidesToShowDesktop',
      title: 'Slides to Show (Desktop)',
      type: 'number',
      description: 'Number of cards shown on desktop screens (>=1136px)',
      initialValue: 3,
    },
    
    {
      name: 'slidesToShowIpad',
      title: 'Slides to Show (Tablet)',
      type: 'number',
      description: 'Number of cards shown on tablets (<1136px)',
      initialValue: 2,
    },
    
    {
      name: 'slidesToShowMobile',
      title: 'Slides to Show (Mobile)',
      type: 'number',
      description: 'Number of cards shown on mobile (<640px)',
      initialValue: 1,
    },
    {
      name: 'cards',
      title: 'Cards',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'title',
              title: 'Title',
              type: 'string',
              validation: (Rule: Rule) => Rule.required().error('A title is required'),
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
              name: 'description',
              title: 'Description',
              type: 'text',
            },
            {
              name: 'pageLink',
              title: 'Page Link',
              type: 'string',
              description: 'Add a link for service page.',
            },
          ],
        },
      ],
    },
  ],  
}

export default Card;
