// Importing Rule type for use in field validations from '@sanity/types'.

/**
 * Defines a schema for 'seoFields', an object type in Sanity that structures SEO-related
 * data for content, including focus keywords, SEO titles, and descriptions.
 */
const seoCategory = {
  name: 'seoCategory', // Unique identifier for the schema within Sanity.
  type: 'object', // Specifies that this schema defines an object type.

  // Fields defining the structure and content of the SEO data.
  fields: [
    {
      name: 'parentPage',
      title: 'Parent Page',
      type: 'reference',
      to: [{type: 'page'}, {type: 'blocks'}], // Allows referencing both 'page' and 'block' types.
      options: {
        disableNew: true,
      },
      description: 'Reference to another page that acts as a parent to the current page.',
    },
    {
      name: 'pagePath',
      type: 'string',
      title: 'Page Path',
      description: 'The URL path for the page, automatically generated upon publishing.',
    },
    {
      name: 'focusKeyword',
      title: 'Focus Keyword',
      type: 'string', // Data type for the focus keyword.
      description:
        'Set this word or phrase to get a good analysis of your content on the SEO pane.',
      //validation: (Rule: Rule) => Rule.required().error('A focus keyword is required'), // Ensures a focus keyword is always provided.
    },
    {
      name: 'focusSynonyms',
      title: 'Focus Synonyms',
      type: 'string', // Data type for synonyms related to the focus keyword.
      description: 'A comma delimited list of other focus keywords.',
      //validation: (Rule: Rule) => Rule.required().min(1).error('At least one synonym is required'), // Ensures at least one synonym is provided.
    },
    {
      name: 'seoTitle',
      title: 'SEO Title',
      type: 'string', // Data type for the SEO title.
      description: 'Use this field to override the title of this content in search results.',
      //validation: (Rule: Rule) => Rule.required().error('An SEO title is required'), // Ensures an SEO title is provided.
    },
    {
      name: 'seoDescription',
      title: 'SEO Description',
      type: 'text', // Data type for the SEO description.
      description: 'Use this field to create a meta description for SEO.',
      //validation: (Rule: Rule) =>
        //Rule.required().min(50).max(160).error('An SEO description must be 50-160 characters long'), // Ensures a valid SEO description is provided.
    },
    {
      name: 'canonicalUrl',
      title: 'Canonical URL',
      type: 'string',
    },
  ],
}

// Export the 'seoCategory' schema to make it available for use in Sanity Studio.
export default seoCategory
