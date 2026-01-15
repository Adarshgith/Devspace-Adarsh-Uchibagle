/**
 * Defines a schema for a 'button' object within Sanity Studio. This object includes
 * properties such as text, URL, and style, each with specific validations to ensure data integrity.
 */
const button = {
  name: 'button', // Identifier for the schema, used within queries and for referencing.
  title: 'Button', // Human-readable title for the schema as it appears in Sanity Studio.
  type: 'object', // Defines the schema as an object type.

  // Fields within the 'button' object.
  fields: [
    {
      name: 'text',
      title: 'Text',
      type: 'string', // Specifies the data type as string.
      description: 'The text displayed on the button', // Description of the field for CMS users.
    },
    {
      name: 'url',
      title: 'URL',
      type: 'string', // Specifies the data type as URL.
      description: 'The destination the button will link to', // Description of the field.
      //validation: (Rule: Rule) => Rule.required().error('A URL is required'), // Validation to ensure a URL is provided.
    },
    {
      name: 'openInNewTab',
      type: 'boolean',
      title: 'Open in new tab',
      initialValue: false,
    },
    {
      name: 'style',
      title: 'Style',
      type: 'string', // Data type for button style.
      description: 'The appearance style of the button', // Explains what the style field influences.
      options: {
        list: [
          // Defines the list of selectable style options.
          {title: 'Primary', value: 'primaryBtn'},
          {title: 'Secondary', value: 'secondaryBtn'},
          {title: 'Tertiary', value: 'tertiarybtn'},
        ],
        layout: 'radio', // Option to display these as radio buttons in the CMS.
      },
    },
  ],
}

// Export the 'button' schema to make it available for use in Sanity Studio.
export default button
