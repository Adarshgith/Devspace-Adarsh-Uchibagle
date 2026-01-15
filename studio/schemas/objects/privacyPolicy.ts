// Importing Rule type for use in field validations from '@sanity/types'.
import type {Rule} from '@sanity/types'

// Importing icons from 'react-icons' for visual representation in the CMS.
import {TfiLayoutCtaBtnLeft} from 'react-icons/tfi'

/**
 * Defines a schema for 'privacyPolicy', an object type in Sanity that structures
 * content specifically for privacy policy pages, including headings, text, and styling.
 */
const privacyPolicy = {
  name: 'privacyPolicy', // Unique identifier for the schema within Sanity.
  title: 'Privacy Policy Content', // Human-readable title for the schema as it appears in Sanity Studio.
  type: 'object', // Specifies that this schema defines an object type.
  icon: TfiLayoutCtaBtnLeft, // Sets an icon for this document type from react-icons.

  // Fields defining the structure and content of the privacy policy.
  fields: [
    {
      name: 'heading',
      title: 'Heading',
      type: 'string', // Data type for the heading.
      validation: (Rule: Rule) => Rule.required().error('A heading is required'), // Ensures a heading is always provided.
    },
    {
      name: 'headStyle',
      title: 'Heading Style',
      type: 'string', // Data type for the heading style.
      options: {
        list: ['h2', 'h3', 'h4', 'h5', 'h6'], // Defines possible heading styles.
        layout: 'dropdown', // Presents these options as a dropdown in the CMS.
      },
      defaultValue: 'h2', // Sets a default heading style.
      validation: (Rule: Rule) => Rule.required().error('Heading style is required'), // Ensures a heading style is selected.
    },
    {
      name: 'privacyData',
      title: 'Privacy Data',
      type: 'string', // Data type for the main privacy policy text.
      //validation: (Rule: Rule) => Rule.required().min(50).error('Privacy data must be at least 50 characters'), // Ensures privacy data is provided and sufficiently detailed.
    },
  ],
}

// Export the 'privacyPolicy' schema to make it available for use in Sanity Studio.
export default privacyPolicy
