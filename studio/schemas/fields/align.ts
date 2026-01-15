// Import the Rule type from '@sanity/types' for validation purposes.

// Define the schema configuration for the 'align' field used in documents within Sanity Studio.
export default {
  name: 'align', // Unique identifier for the field, used in queries and referenced in the studio.
  type: 'string', // Specifies that the field data type is a string.
  title: 'Align', // Human-readable title for the field displayed in the Sanity studio.

  // Configuration for the field options, providing a dropdown selection in the CMS.
  options: {
    list: [
      // List of options that the user can select from.
      {title: 'Center', value: 'center'}, // Option for center alignment.
      {title: 'Left', value: 'left'}, // Option for left alignment.
      {title: 'Right', value: 'right'}, // Option for right alignment.
    ],
  },

  initialValue: 'center', // Sets 'center' as the initial value for the align field when a new instance is created.
  validation: (Rule: {required: () => any}) => Rule.required(),
}
