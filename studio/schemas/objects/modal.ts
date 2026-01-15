import type { Rule } from '@sanity/types';
import { MdWeb } from 'react-icons/md';

/**
 * Defines a schema for a modal section with an associated button to trigger the modal.
 */
const modalWithButton = {
  name: 'modalWithButton',
  title: 'Modal with Button',
  type: 'object',
  icon: MdWeb, // Icon representing the modal section in Sanity Studio.

  // Fields within the 'modalWithButton' object.
  fields: [
    {
      name: 'sectionTitle',
      title: 'Section Title',
      type: 'string',
      validation: (Rule: Rule) => Rule.required().error('Section Title is required'),
    },
    {
      name: 'modalId',
      title: 'Modal ID',
      type: 'string',
      validation: (Rule: Rule) => Rule.required().min(3).error('Modal ID is required and must be at least 3 characters long'),
      description: 'This ID is used in the script to open the modal. Must be unique.',
    },
    {
      name: 'modalTitle',
      title: 'Modal Title',
      type: 'string',
      validation: (Rule: Rule) => Rule.required().error('Modal title is required'),
    },
    {
      name: 'modalContent',
      title: 'Modal Content',
      type: 'array',
      of: [
        { type: 'block' }, // Rich text
        { type: 'image' }, // Image
        {
          type: 'file',
          title: 'Video',
          options: {
            accept: 'video/*',
          },
        },
        {
          type: 'object',
          name: 'youtubeVideo',
          title: 'YouTube Video',
          fields: [
            {
              name: 'url',
              title: 'YouTube Video URL',
              type: 'url',
              validation: (Rule: Rule) => 
                Rule.uri({
                  scheme: ['http', 'https']
                })
                .regex(
                  /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.?be)\/.+$/,
                  {
                    name: 'YouTube URL', // Error message is "Does not match YouTube URL"
                    invert: false, // Boolean to allow any URLs except those that match the regex
                  }
                ).error('Must be a valid YouTube URL'),
              description: 'URL of the YouTube video to be displayed in the modal.',
            },
          ],
        },
      ],
      description: 'Content displayed inside the modal, supports text, images, videos, and YouTube links.',
    },
    {
      name: 'closeButtonLabel',
      title: 'Close Button Label',
      type: 'string',
      validation: (Rule: Rule) => Rule.required().error('Close button label is required'),
      description: 'Label for the close button inside the modal, typically an "X" or similar character.',
    },
    {
      name: 'openButtonLabel',
      title: 'Open Button Label',
      type: 'string',
      description: 'The text label for the button that opens the modal.',
      validation: (Rule: Rule) => Rule.required().error('Open button label is required'),
    },
  ],
};

// Export the 'modalWithButton' schema to make it available for use in Sanity Studio.
export default modalWithButton;
