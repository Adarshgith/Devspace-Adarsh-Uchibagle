import { defineType, defineField } from 'sanity';

export default defineType({
  name: 'jumpToSection',
  type: 'object',
  title: 'Jump To Section',
  fields: [
    defineField({
        name: 'title',
        title: 'Title',
        type: 'string',
    }),
    defineField({
      name: 'links',
      type: 'array',
      title: 'Links',
      of: [
        {
          type: 'object',
          title: 'Link List',
          fields: [
            defineField({
                name: 'linkTitle',
                type: 'string',
                title: 'Link Title',
            }),
            defineField({
              name: 'link',
              type: 'string',
              title: 'Link',
              description: 'Link for jump to section'
            }),
            defineField({
              name: 'content',
              title: 'Content',
              description: 'This is optional content',
              type: 'array',
              of: [{type: 'block'}]
            }),
          ],
        },
      ],
    }),
  ],
  preview: {
    select: {
      title: 'title'
    },
    prepare(selection) {
      const { title } = selection;
      return {
        title,
      };
    },
  },
});
