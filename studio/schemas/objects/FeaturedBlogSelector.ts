import { defineField, defineType } from 'sanity';
import { ImBlog } from 'react-icons/im';
// Define the Blog Module schema
export default defineType({
  name: 'featuredBlogSelector',
  title: 'Featured Blog Selector',
  type: 'object',
  icon: ImBlog,
  fields: [
    defineField({
      name: 'moduleTitle',
      title: 'Module Title',
      type: 'string',
      description: 'The title of the blog module.',
      validation: (Rule) => Rule.required().error('A module title is required.'),
    }),
    defineField({
      name: 'blogIds',
      title: 'Blog IDs',
      type: 'array',
      description: 'Select the blog posts to display in this module.',
      of: [{ type: 'reference', to: [{ type: 'blogs' }] }],
      validation: (Rule) => Rule.required().min(1).error('At least one blog ID is required.'),
    }),
    // Add a new field for layout type
    defineField({
      name: 'layoutType',
      title: 'Layout Type',
      type: 'string',
      description: 'Choose how the blogs should be displayed.',
      options: {
        list: [
          { title: 'Card', value: 'card' },
          { title: 'Slider', value: 'slider' },
        ],
        layout: 'dropdown',
      },
      initialValue: 'card', // Set a default value if necessary
      validation: (Rule) => Rule.required().error('Please select a layout type.'),
    }),
  ],
});
