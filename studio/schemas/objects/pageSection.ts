import { ImSection } from 'react-icons/im';
import rowSchema from './rowSchema'; // Keep this import

const pageSection = {
  name: 'pageSection',
  type: 'object',
  title: 'Page Section',
  icon: ImSection,
  fields: [
    {
      title: 'Section Title',
      name: 'sectionTitle',
      type: 'string',
      description: 'Display the following text as section title',
    },
    {
      title: 'Rows',
      name: 'rows',
      type: 'array',
      description: 'Add multiple rows to build the grid layout',
      of: [rowSchema], // Use rowSchema directly here
      options: {
        sortable: true, // Enable drag-and-drop reordering of rows
      },
    },
  ],
};

export default pageSection;
