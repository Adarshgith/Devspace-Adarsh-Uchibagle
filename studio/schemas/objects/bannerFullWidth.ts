import { MdOutlineWeb } from 'react-icons/md'; // Suitable icon for banners
import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'bannerFullWidth',
  title: 'Banner Full Width',
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
      name: 'description',
      title: 'Description',
      type: 'text',
      description: 'The subheading or description of the banner'
    }),
    defineField({
      name: 'image',
      title: 'Image',
      type: 'image',
    }),
    defineField({
      name: 'button',
      type: 'button',
      title: 'Button',
    }),
  ],
});
