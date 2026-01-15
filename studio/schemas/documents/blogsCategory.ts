import { BiCategory } from 'react-icons/bi';
import { defineField, defineType } from 'sanity';

export default defineType({
    name: 'blogsCategory',
    title: 'Category',
    type: 'document',
    icon: BiCategory,
    // Define the fields associated with the 'post' document.
    fields: [
        defineField({
            name: 'title',
            title: 'Title',
            type: 'string',
            // Validation to ensure the title is not empty.
            validation: (Rule) => Rule.required().error('A title is required for the post.'),
        }),
        defineField({
            name: 'slug',
            title: 'Slug',
            type: 'slug',
            options: {
                source: 'title', // Automatically generates the slug from the post title.
                maxLength: 96, // Sets a maximum length to the slug for URL optimization.
            },
            // Validation to ensure a slug is created.
            validation: (Rule) =>
                Rule.required().error('A slug is required and is generated from the title.'),
        })
    ],

});
