// Import the necessary type for validation from '@sanity/types'
import type {Rule} from '@sanity/types'
// Importing an icon from 'react-icons' for visual representation in the CMS.
import {ImSection} from 'react-icons/im'

/**
 * Defines a schema for the 'headerSection' within Sanity Studio.
 * This schema allows users to build out a header section with customizable inner blocks, such as buttons.
 */
const headerSection = {
  name: 'headerSection', // Unique identifier for the schema within Sanity.
  type: 'object', // Specifies that this schema defines an object type.
  title: 'Header Section', // Human-readable title for the schema as it appears in Sanity Studio.
  icon: ImSection, // Sets an icon for this document type from react-icons.

  // Define the fields within the 'headerSection' object.
  fields: [
    {
      name: 'innerBlocks',
      type: 'array', // Specifies that this field is an array to hold multiple entries.
      title: 'Inner Blocks', // Display title for the field.
      of: [{type: 'button'}], // Defines the types of objects that this array can contain.
      // Validation function to ensure that at least one inner block is always provided.
      validation: (Rule: Rule) => Rule.required().error('At least one inner block is required'),
    },
  ],
}

// Export the 'headerSection' schema to make it available for use in Sanity Studio.
export default headerSection
