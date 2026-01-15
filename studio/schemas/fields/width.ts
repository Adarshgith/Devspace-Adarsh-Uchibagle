/**
 * Defines a schema for the 'width' field within documents.
 * This schema allows selection from predefined width options.
 */
export default {
  name: 'width', // Unique identifier for the field used in queries and scripts.
  type: 'string', // Specifies that the field data type is a string.
  title: 'Width', // Human-readable title for the field displayed in the Sanity studio.

  // Configuration for the field options, providing a dropdown selection in the CMS.
  options: {
    list: [
      // List of predefined options for width selection.
      {title: 'Default', value: 'default'}, // Default width option.
      {title: 'Wide', value: 'wide'}, // Wide width option.
      {title: 'Narrow', value: 'narrow'}, // Narrow width option.
    ],
    layout: 'radio', // Optionally uncomment this to display the options as radio buttons.
  },

  initialValue: 'default', // Sets 'default' as the initial value when a new instance is created.

  // Defines validation rules to ensure the width field always has a value.
  validation: (Rule: any) => Rule.required().error('Width is required'), // Ensures a value is always selected.
}
