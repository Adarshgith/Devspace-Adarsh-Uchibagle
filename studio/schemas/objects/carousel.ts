// schemas/carousel.ts

import { FaImages } from 'react-icons/fa'; // Importing an icon from react-icons
import { defineField, defineType } from 'sanity';

// Define the carousel schema as an object type
export default defineType({
  name: 'carousel', // The internal name of the schema
  type: 'object', // Specifies that this is an object type
  title: 'Carousel', // The display name for the schema in the Sanity Studio
  icon: FaImages, // Adding the imported icon to represent this schema in the Sanity Studio
  fields: [
    // Define the title field
    defineField({
      name: 'title', // The internal name of the field
      type: 'string', // Specifies that this field is of type string
      title: 'Title', // The display name for the field
      description: 'Title of the carousel', // A description of the field's purpose
      validation: Rule => Rule.required(), // Validation rule to make the field required
    }),
    // Define the description field
    defineField({
      name: 'description', // The internal name of the field
      type: 'text', // Specifies that this field is of type text
      title: 'Description', // The display name for the field
      description: 'Description of the carousel', // A description of the field's purpose
      validation: Rule => Rule.required(), // Validation rule to make the field required
    }),
    // Define the images field
    defineField({
      name: 'images', // The internal name of the field
      type: 'array', // Specifies that this field is an array
      title: 'Images', // The display name for the field
      description: 'Images in the carousel', // A description of the field's purpose
      of: [
        // Define the type of items in the array
        defineField({
          name: 'image', // The internal name of the field
          type: 'image', // Specifies that this field is of type image
          options: {
            hotspot: true, // Enables hotspot selection for the images
          },
        })
      ],
      validation: Rule => Rule.required().min(3).error('At least 3 images are required'), // Validation rule to make the field required and ensure at least 3 images
    }),
  ],
});
