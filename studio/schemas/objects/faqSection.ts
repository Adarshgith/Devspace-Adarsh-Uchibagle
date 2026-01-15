import { FiBookOpen } from 'react-icons/fi';
import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'FAQSection',
  title: 'FAQ Section Selector',
  type: 'object',
  icon: FiBookOpen, 
  fields: [
    defineField({
      name: 'sectionTitle',
      title: 'Section Title',
      type: 'string',
      description: 'The title of the FAQ section.',
    }),
    {
      name: 'description',
      title: 'Description',
      type: 'text', 
      description: 'Optional description for the FAQ section.',
    },
    defineField({
      name: 'selectedFaqs',
      title: 'Select Faqs',
      type: 'array',
      of: [
        {
          type: 'reference',
          to: [{ type: 'faqs' }], 
        },
      ],
    }),
    
    defineField({
      name: 'button',
      type: 'button',
      title: 'Button',
    }),
  ],
});
