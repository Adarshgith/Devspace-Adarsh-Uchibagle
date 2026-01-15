/**
 * Schema definition for 'link', an object type in Sanity that manages both internal and external links.
 * This helps in creating navigational links within the site or to external resources.
 */
const linkSchema = {
  name: 'link', // Unique identifier for the schema within Sanity.
  type: 'object', // Specifies that this schema defines an object type.
  title: 'Link', // Human-readable title for the schema as it appears in Sanity Studio.

  // Define the fields within the 'link' object.
  fields: [
    {
      title: 'Internal Link',
      name: 'internalLink',
      description: 'Select pages for navigation',
      type: 'reference', // Specifies that this field references another document type within Sanity.
      to: [{type: 'page'}, {type: 'blocks'}], // Defines the document type this reference is linked to.
    },
    {
      name: 'externalUrl',
      title: 'External URL',
      description: 'Enter a valid external URL (e.g., https://example.com). Use fully qualified URLs starting with http:// or https://',
      type: 'url', // Changed to url type for better validation
      validation: (Rule: any) => Rule.uri({
        scheme: ['http', 'https'],
        allowRelative: false
      }).error('Please enter a valid URL starting with http:// or https://'),
    },
    {
      name: 'openInNewTab',
      title: 'Open in New Tab',
      description: 'Check to open the link in a new tab',
      type: 'boolean',
      initialValue: false,
    }
  ],
}

// Export the 'link' schema to make it available for use in Sanity Studio.
export default linkSchema
