import { BsFillPersonLinesFill } from 'react-icons/bs';
import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'blogsAuthor',
  title: 'Blogs Author',
  type: 'document',
  icon: BsFillPersonLinesFill ,
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required().error('A title is required for the author.'),
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
          { title: 'Blog', value: 'blog' },
        ],
      },
      validation: (Rule) => Rule.required().error('Assignment type is required.'),
    }),
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
      description: 'The full name of the author.',
    }),
    defineField({
      name: 'bio',
      title: 'Bio',
      type: 'text',
      description: 'A brief biography of the author.',
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
