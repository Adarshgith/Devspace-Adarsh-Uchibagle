// Import the Rule type from '@sanity/types' for use in validation functions.
import type {Rule} from '@sanity/types'

/**
 * Defines a schema for the 'homeHeroSection', an object type in Sanity that structures
 * the hero section typically found at the top of homepages.
 */
const homeHeroSection = {
  name: 'homeHeroSection', // Unique identifier for the schema within Sanity.
  title: 'Hero Section', // Human-readable title for the schema as it appears in Sanity Studio.
  type: 'object', // Specifies that this schema defines an object type.

  // Fields defining the structure and content of the hero section.
  fields: [
    {
      name: 'heroImage',
      title: 'Hero Image',
      type: 'image', // Specifies the field type as image.
      options: {
        hotspot: true, // Enables hotspot for precise image cropping and positioning.
      },
      validation: (Rule: Rule) => Rule.required().error('A hero image is required'), // Ensures an image is always provided.
    },
    {
      name: 'heroText',
      title: 'Hero Text',
      type: 'text', // Specifies the field type as text.
      validation: (Rule: Rule) =>
        Rule.required().min(10).error('Hero text must be at least 10 characters'), // Ensures text is provided and meets minimum length.
    },
    {
      name: 'subheader',
      title: 'Sub Heading',
      type: 'text', // Specifies the field type as text.
      validation: (Rule: Rule) => Rule.required().error('A subheading is required'), // Ensures a subheading is always provided.
    },
    {
      name: 'description',
      title: 'Description',
      type: 'text', // Specifies the field type as text.
      validation: (Rule: Rule) => Rule.required().error('A description is required'), // Ensures a description is always provided.
    },
    // Additional fields can be added here as needed with appropriate types and validations.
  ],
}

// Export the 'homeHeroSection' schema to make it available for use in Sanity Studio.
export default homeHeroSection
