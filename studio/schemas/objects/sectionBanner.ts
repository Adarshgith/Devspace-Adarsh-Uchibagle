import { MdOutlineWeb } from 'react-icons/md'; // Suitable icon for banners
import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'sectionBanner',
  title: 'Section Banner',
  type: 'object',
  icon: MdOutlineWeb,  // Icon for representing the banner in Sanity Studio
  fields: [
    defineField({
      name: 'heading',
      title: 'Heading',
      type: 'string',
      description: 'The main heading of the banner',
      validation: (Rule) => Rule.required().max(100),
    }),
    defineField({
      name: 'bannerImage',
      title: 'Banner Image',
      type: 'image', 
      options: {
        hotspot: true, 
      },
      description: 'Upload an image to display in the banner background section.',
    }),
    defineField({
      name: 'subheading',
      title: 'Subheading',
      type: 'text',
      description: 'The subheading or description of the banner',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'button',
      type: 'button',
      title: 'Button',
    }),
    defineField({
      name: 'secondButton',
      type: 'button',
      title: 'second Button',
    }),
  ],
});
