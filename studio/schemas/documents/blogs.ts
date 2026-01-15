import { BiBookContent, BiBook } from 'react-icons/bi';
import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'blogs',
  title: 'Blogs',
  type: 'document',
  icon: BiBook,

  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      icon: BiBookContent,
      description: 'SEO-critical: Keep between 30-60 characters for optimal search results.',
      validation: (Rule) =>
        Rule.required()
          .min(10)
          .max(60)
          .error('Title must be 10-60 characters for SEO optimization.'),
    }),

    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 200,
      },
      validation: (Rule) =>
        Rule.required().error('A slug is required for the post.'),
    }),

    defineField({
      name: 'resourceId',
      title: 'Resource ID',
      type: 'string',
      description: 'The ID of the resource (B1, B2, etc.)',

      initialValue: async (_, context) => {
        try {
          const client = context.getClient({ apiVersion: '2025-02-14' });

          const existingDocs = await client.fetch(
            `*[_type == "blogs" && defined(resourceId) && !(_id in path("drafts.**"))]
             | order(resourceId desc) { resourceId }`
          );

          if (existingDocs.length === 0) return 'B1';

          let maxNumber = 0;
          existingDocs.forEach((doc: { resourceId: string }) => {
            const match = doc.resourceId.match(/^B(\d+)$/);
            if (match) {
              const num = parseInt(match[1], 10);
              if (num > maxNumber) maxNumber = num;
            }
          });

          return `B${maxNumber + 1}`;
        } catch (error) {
          console.error('Error generating resource ID:', error);
          return 'B1';
        }
      },

      validation: (Rule) =>
        Rule.custom(async (resourceId, context) => {
          if (!resourceId || resourceId.trim() === '') {
            return 'The Resource ID is required.';
          }

          if (!context?.document) {
            return 'Validation context is missing the document.';
          }

          const client = context.getClient({ apiVersion: '2025-02-14' });
          const currentDocId = context.document._id.replace(/^drafts\./, '');

          const existingDoc = await client.fetch(
            `*[_type == "blogs" && resourceId == $resourceId && _id != $currentDocId
              && !(_id in path("drafts.**"))][0]`,
            { resourceId, currentDocId }
          );

          if (existingDoc) {
            return 'Resource ID must be unique.';
          }

          return true;
        }),
    }),

    defineField({
      name: 'excerpt',
      title: 'Excerpt',
      type: 'text',
      description: 'SEO meta description (120-160 characters).',
      validation: (Rule) =>
        Rule.required()
          .min(120)
          .max(160)
          .error('Meta description must be 120-160 characters.'),
    }),

    defineField({
      name: 'mainImage',
      title: 'Main Image',
      type: 'image',
      options: { hotspot: true },
      description: 'Featured image for the blog post.',
    }),

    defineField({
      name: 'blogsAuthor',
      title: 'Author',
      type: 'reference',
      to: [{ type: 'blogsAuthor' }],
      options: {
        filter: 'assignTo == $assignTo',
        filterParams: { assignTo: 'blog' },
        disableNew: true,
      },
      validation: (Rule) =>
        Rule.required().error('An author is required for the blog post.'),
    }),

    // 🔥 VALIDATION REMOVED HERE
    defineField({
      name: 'mainContent',
      title: 'Main Content',
      type: 'pageSection',
      description: 'Main blog content (no validation applied).',
    }),

    defineField({
      name: 'isSticky',
      title: 'Sticky Blog',
      type: 'boolean',
      description: 'Pin this blog post to the top.',
      initialValue: false,
    }),

    defineField({
      name: 'featuredBlog',
      title: 'Featured Blog',
      type: 'boolean',
      description: 'Mark this blog post as featured.',
      initialValue: false,
    }),

    defineField({
      name: 'publishDate',
      title: 'Publish Date',
      type: 'date',
      description: 'Blog publish date.',
      validation: (Rule) =>
        Rule.required().error('Publish date is required.'),
    }),

    defineField({
      name: 'content',
      title: 'Additional Content',
      type: 'pageSection',
      description: 'Optional additional content section.',
    }),
  ],
});
