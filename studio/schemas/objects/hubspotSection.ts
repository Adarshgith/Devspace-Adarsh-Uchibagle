import { defineField, defineType } from 'sanity';
import { MdMiscellaneousServices } from 'react-icons/md';

const hubspotSection = defineType({
  name: 'hubspotSection',
  title: 'HubSpot Section',
  type: 'object',
  icon: MdMiscellaneousServices,
  fields: [
    defineField({
      name: 'sectionTitle',
      title: 'Section Title',
      type: 'string',
      description: 'Enter the title for this section.',
    }),
    defineField({
      name: 'formId',
      title: 'Form ID',
      type: 'string',
      description: 'Enter the HubSpot form ID.',
      validation: (Rule) => 
        Rule.required().error('Form ID is required to render the HubSpot form'),
    }),
  ],
});

export default hubspotSection;
