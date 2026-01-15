import { BsCardImage } from 'react-icons/bs';
import { defineType, defineField } from 'sanity';

export default defineType({
  name: 'availablePositions',
  title: 'Available Positions',
  icon: BsCardImage,
  type: 'object',

  fields: [
    defineField({
      name: 'sectionTitle',
      title: 'Section Title',
      type: 'string',
      description: 'Main heading for this section.',
    }),
    defineField({
      name: 'mainDescription',
      title: 'Main Description',
      type: 'array',
      of: [{ type: 'block' }],
    }),
    defineField({
      name: 'positions',
      title: 'Positions',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'position',
          title: 'Position',
          fields: [
            {
              name: 'title',
              title: 'Position Title',
              type: 'string',
              validation: Rule => Rule.required(),
            },
            {
              name: 'type',
              title: 'Job Type',
              type: 'string',
              options: {
                list: [
                  { title: 'Full Time', value: 'full time' },
                  { title: 'Part Time', value: 'part time' },
                ],
                layout: 'radio',
              },
            },
            {
              name: 'description',
              title: 'Job Description',
              type: 'array',
              of: [{ type: 'block' }],
            },
            defineField({
              name: 'button',
              type: 'button',
              title: 'Button',
            }),
          ],
        },
      ],
    }),
    defineField({
      name: 'noPositionsContent',
      title: 'No Positions Content',
      type: 'array',
      of: [{ type: 'block' }],
    }),
  ],
});
