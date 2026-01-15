import type { Rule } from '@sanity/types';
import { PiClockCountdownBold } from "react-icons/pi";

const trackRecord = {
  name: 'trackRecord',
  title: 'Track Record',
  icon: PiClockCountdownBold, 
  type: 'object', 

  fields: [
    {
      name: 'sectionTitle',
      title: 'Section Title',
      type: 'string',
      description: 'A section title for the Track Record.',
    },
    {
      name: 'trackRecords',
      title: 'Track Records',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'title',
              title: 'Title',
              type: 'string',
              validation: (Rule: Rule) => Rule.required().error('A title is required'),
            },
            {
              name: 'description',
              title: 'Description',
              type: 'string',
            },
          ],
        },
      ],
    },
  ],  
}

export default trackRecord;
