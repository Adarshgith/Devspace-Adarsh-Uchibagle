import { defineField, defineType } from 'sanity';
import { MdAnnouncement } from 'react-icons/md'; // Icon for news/announcement


// Define the Featured News Module schema
export default defineType({
  name: 'featuredNewsSelector',
  title: 'Featured News Selector',
  type: 'object',
  icon: MdAnnouncement,
  fields: [
    defineField({
      name: 'sectionTitle',
      title: 'Section Title',
      type: 'string',
      description: 'The title of the news module.',
      //validation: (Rule) => Rule.required().error('A module title is required.'),
    }),
    defineField({
      name: 'selectedNews',
      title: 'Select News',
      type: 'array',
      of: [
        {
          type: 'reference',
          to: [{ type: 'news' }], // Reference to the `news` document
        },
      ],
      validation: (Rule) => Rule.required().error('You must select an news.'),
      description: 'Select a news to display as the featured news.',
    }),
  ],
});
