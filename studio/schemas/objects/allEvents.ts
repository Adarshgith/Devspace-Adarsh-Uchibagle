// Import the necessary icon for the CMS interface.
import type { Rule } from '@sanity/types'; // Import type for Rule if using Sanity types for validation.
import { TfiLayoutMediaCenter } from 'react-icons/tfi';

/**
 * Schema definition for 'allEvents', an object type in Sanity that groups together event-related information.
 */
const allEvents = {
  name: 'allEvents',
  title: 'All Events',
  type: 'object',
  icon: TfiLayoutMediaCenter, // Use an icon for better identification in the CMS.

  // Define the fields within the allEvents object.
  fields: [
    {
      name: 'heading',
      title: 'Heading',
      type: 'string',
      validation: (Rule: Rule) => Rule.required().error('The heading is required'), // Ensure the heading is always provided.
    },
    {
      name: 'eventsData',
      title: 'Events Data',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'image',
              title: 'Image',
              type: 'image', // Define the field type as image.
            },
            {
              name: 'title',
              title: 'Title',
              type: 'string',
              validation: (Rule: Rule) =>
                Rule.required().error('A title for each event is required'), // Ensure every event has a title.
            },
            {
              name: 'author',
              title: 'Author name',
              type: 'string', // Author's name field.
            },
            {
              name: 'date',
              title: 'Date',
              type: 'date',
              options: {
                dateFormat: 'MMMM DD, YYYY', // Specify the format for the date.
              },
            },
            {
              name: 'category',
              title: 'Category',
              type: 'string',
              options: {
                list: [
                  'Unscheduled Events',
                  'Live TV Events',
                  'Sports',
                  'Festivals',
                  'Expos',
                  'Conferences',
                ],
                layout: 'radio', // Categories will be presented as radio buttons.
              },
              description: 'Specify the Events Category.',
              validation: (Rule: Rule) => Rule.required().error('Selecting a category is required'),
            },
            {
              name: 'resource',
              title: 'Resource',
              type: 'string',
              options: {
                list: ['Unschts', 'Lints', 'Sps', 'Fes', 'Eos', 'Conces'],
                layout: 'radio',
              },
              description: 'Specify the resource type associated with the event.',
            },
            {
              name: 'technology',
              title: 'Technology',
              type: 'string',
              options: {
                list: ['Events', 'Live TV', 'Sp', 'Fivals', 'Exp', 'rences'],
                layout: 'radio',
              },
              description: 'Specify the technology used in the event.',
            },
          ],
          preview: {
            select: {
              title: 'title', // Use the title for preview in the CMS.
            },
            prepare(selection: {title: string}) {
              // Provide better type safety for selection.
              return {
                title: selection.title || 'No title', // Fallback to 'No title' if undefined.
              }
            },
          },
        },
      ],
    },
  ],

}

export default allEvents
