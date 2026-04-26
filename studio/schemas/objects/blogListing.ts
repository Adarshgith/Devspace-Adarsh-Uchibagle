import { MdViewList } from 'react-icons/md';
import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'blogsListing',
  title: 'Blogs Listing',
  type: 'object',
  icon: MdViewList,
  fields: [
    defineField({
      name: 'sectionTitle',
      title: 'Section Title',
      type: 'string',
      description: 'The title of the blogs section.',
      initialValue: 'Our Blog',
    }),
    defineField({
      name: 'sectionDescription',
      title: 'Section Description',
      type: 'array',
      of: [
        {
          type: 'block',
        },
      ],
      description: 'The description of the blogs section.',
    }),
    defineField({
      name: 'selectedBlogs',
      title: 'Select Blogs',
      type: 'array',
      of: [
        {
          type: 'reference',
          to: [{ type: 'blocks' }],
        },
      ],
      validation: (Rule) => Rule.min(1).error('You must select at least one blog.'),
      description: 'Select blogs to display. If none selected, all blogs will be shown.',
    }),
    defineField({
      name: 'layout',
      title: 'Layout Style',
      type: 'string',
      options: {
        list: [
          { title: 'Grid', value: 'grid' },
          { title: 'List', value: 'list' },
        ],
        layout: 'radio',
      },
      initialValue: 'grid',
      description: 'Choose how blogs should be displayed.',
    }),
    defineField({
      name: 'showExcerpt',
      title: 'Show Excerpt',
      type: 'boolean',
      initialValue: true,
      description: 'Display blog excerpt/summary.',
    }),
    defineField({
      name: 'showAuthor',
      title: 'Show Author',
      type: 'boolean',
      initialValue: true,
      description: 'Display blog author information.',
    }),
    defineField({
      name: 'showDate',
      title: 'Show Published Date',
      type: 'boolean',
      initialValue: true,
      description: 'Display blog published date.',
    }),
    defineField({
      name: 'showCategories',
      title: 'Show Categories',
      type: 'boolean',
      initialValue: true,
      description: 'Display blog categories/tags.',
    }),
    defineField({
      name: 'numberOfBlogs',
      title: 'Number of Blogs to Display',
      type: 'number',
      description: 'Limit the number of blogs shown. Leave empty to show all selected blogs.',
      validation: (Rule) => Rule.min(1).max(50),
    }),
    defineField({
      name: 'CTA',
      title: 'Call to Action Button',
      type: 'array',
      of: [
        {
          type: 'button',
        },
      ],
      description: 'Optional CTA button below the blogs listing (e.g., "View All Blogs").',
      validation: (Rule) => Rule.max(1),
    }),
  ],
  preview: {
    select: {
      title: 'sectionTitle',
      selectedBlogs: 'selectedBlogs',
      layout: 'layout',
    },
    prepare({ title, selectedBlogs, layout }) {
      const blogCount = selectedBlogs?.length || 0;
      return {
        title: title || 'Blogs Listing',
        subtitle: `${blogCount} blog${blogCount !== 1 ? 's' : ''} selected | ${layout || 'grid'} layout`,
      };
    },
  },
});