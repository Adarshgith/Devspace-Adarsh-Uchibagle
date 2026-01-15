// Define the schema configuration for a 'docSlug' field used in documents within Sanity Studio.
export default {
  name: 'docSlug', // Unique identifier for the schema, used to reference this field in queries.
  title: 'Slug', // Human-readable title of the field as it will appear in Sanity Studio.
  type: 'slug', // Specifies that the field is a slug, used for creating SEO-friendly URLs.

  // Configuration for the field options, providing specific settings for the slug generation.
  options: {
    source: 'title', // Specifies which field should be used as the source of the slug's value.
    maxLength: 200, // Limits the maximum length of the slug to ensure URLs are not overly long.
  },

  // Set an initial value for the slug to ensure there's a default setting when creating new instances.
  initialValue: 'center',

  // Add a validation function to ensure the slug is always set for documents using this schema.
  validation: (Rule: {required: () => any}) => Rule.required(), // Ensures a slug is always provided.
}
