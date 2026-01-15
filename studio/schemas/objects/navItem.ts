// Import type for validation from '@sanity/types'.

/**
 * Schema definition for 'navigationItem', an object type in Sanity used to manage
 * individual navigation items, potentially including nested submenus.
 */
export default {
  name: 'navigationItem', // Unique identifier for the schema within Sanity.
  title: 'Navigation Item', // Human-readable title for the schema as it appears in Sanity Studio.
  type: 'object', // Specifies that this schema defines an object type.

  // Fields defining the structure and content of the navigation item.
  fields: [
    {
      name: 'text',
      type: 'string',
      title: 'Navigation Text',
      validation: (Rule: {required: () => any}) => Rule.required(),
    },
    {
      name: 'navigationItemUrl',
      type: 'link', // Assuming 'link' is a custom defined type within your Sanity schemas.
      title: 'Navigation Item URL',
    },
    {
      name: 'subNavigationItems',
      type: 'array',
      title: 'Submenu',
      of: [{type: 'subNavigationItem'}], // Allows nested navigation items within the submenu.
    },
  ],
}
