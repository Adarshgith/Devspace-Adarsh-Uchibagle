import { defineType, defineField } from 'sanity';
import { BiImageAlt } from 'react-icons/bi';

export default defineType({
  name: 'singleImage',
  title: 'Image',
  type: 'object',
  icon: BiImageAlt,
    fields: [
        defineField({
        name: 'image',
        title: 'Image',
        type: 'image',
        description: 'Upload high-quality images. Recommended: 1200x800px minimum, under 2MB for optimal performance.',
        options: {
            hotspot: true,
        },
        validation: (Rule) => Rule.custom((image) => {
          if (!image) return true; // Allow empty if not required
          
          if (image.asset) {
            // Note: File size validation would need to be implemented server-side
            // This is a placeholder for client-side validation
            return true;
          }
          
          return true;
        }).warning('Ensure image is under 2MB and at least 800px wide for best quality.'),
        })
    ]
})