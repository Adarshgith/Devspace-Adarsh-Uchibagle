import { BsFillPersonLinesFill } from 'react-icons/bs';
import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'faqscategories',
  title: 'FAQ Categories',
  type: 'document',
  icon: BsFillPersonLinesFill ,
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required().error('A title is required for the FAQ category.'),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required().error('A slug is required and is generated from the title.'),
    }),
    defineField({
      name: 'assignTo',
      title: 'Assign To',
      type: 'string',
      options: {
        list: [
          { title: 'FAQs', value: 'faqs' },
        ],
      },
      validation: (Rule) => Rule.required().error('Assignment type is required.'),
    }),
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'assignTo',
    },
    prepare(selection) {
      const { title, subtitle } = selection;
      return {
        title: title,
        subtitle: subtitle ? `Assign to: ${subtitle.charAt(0).toUpperCase() + subtitle.slice(1)}` : undefined,
      };
    },
  },
});
