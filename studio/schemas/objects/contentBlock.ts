import { defineType, defineField } from 'sanity';
import { RiTextBlock } from 'react-icons/ri';

export default defineType({
  name: 'contentBlock',
  title: 'Content Block',
  type: 'object',
  icon: RiTextBlock,
  fields: [
    defineField({
      name: 'title',
      title: 'title',
      type: 'string',
    }),
    defineField({
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
    }),
  ],
});
