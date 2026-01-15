import { BiBookContent, BiNews } from 'react-icons/bi';
import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'news',
  title: 'News',
  type: 'document',
  icon: BiNews,
  // Define the fields associated with the 'post' document.
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      icon: BiBookContent,
      // Validation to ensure the title is not empty.
      validation: (Rule) => Rule.required().error('A title is required for the news article.'),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title', // Automatically generates the slug from the post title.
        maxLength: 200, // Sets a maximum length to the slug for URL optimization.
      },
      // Validation to ensure a slug is created.
      validation: (Rule) => Rule.required().error('A slug is required for the news article.'),
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'reference',
      to: [{ type: 'category' }],
      options: {
        filter: 'assignTo == $assignTo',
        filterParams: { assignTo: 'news' },
        disableNew: true,
      },
      validation: (Rule) => Rule.required().error('A category is required for the news article.'),
    }),
    defineField({
      name: 'excerpt',
      title: 'Excerpt',
      type: 'text',
      description: 'Brief summary of the news article content.',
    }),
    defineField({
      name: 'mainImage',
      title: 'Main image',
      type: 'image',
      options: {
        hotspot: true, // Enables image hotspot functionality.
      },
      description: 'Featured image for the news article.',
    }),
    defineField({
      name: 'mainContent',
      title: 'Main Content',
      type: 'pageSection',
      description: 'Detailed content and information for the news article.',
    }),
    defineField({
      name: 'isSticky',
      title: 'Sticky section',
      type: 'boolean',
      description: 'Pin this news article to the top of the news list.',
      initialValue: false,
    }),
    defineField({
      name: 'featuredNews',
      title: 'Featured News',
      type: 'boolean',
      description: 'Mark this news article as featured content.',
      initialValue: false,
    }),
  ],


});
