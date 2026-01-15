import { defineType, defineField } from 'sanity';
import { GrTextWrap } from 'react-icons/gr';

export default defineType({
  name: 'imageTextBlock',
  title: 'Image Text Block',
  type: 'object',
  icon: GrTextWrap,
  fields: [
    defineField({
      name: 'imagePosition',
      title: 'Image Position',
      type: 'string',
      options: {
        list: [
          { title: 'Image on left', value: 'left' },
          { title: 'Image on right', value: 'right' },
        ],
      },
      initialValue: 'left',
      validation: (Rule) => Rule.required().error('This is required for the Image position.'),
    }),
    defineField({
      name: 'image',
      title: 'Image',
      type: 'image',
      options: {
        hotspot: true,
      },
      description: 'Upload high-quality images. Recommended: 800x600px minimum, under 1MB for optimal performance.',
      validation: (Rule) => Rule.custom((image) => {
        if (!image) return 'Image is required for this block.';
        
        // Note: Actual file size and dimension validation would need server-side implementation
        // This provides user guidance through validation messages
        return true;
      }).warning('Ensure image is under 1MB and at least 600px wide for best quality.'),
    }),
    defineField({
        name: 'title',
        title: 'Title',
        type: 'string',
        description: 'Title for the content section',
    }),
    defineField({
        name: 'contentDetails',
        title: 'content Details',
        type: 'array',
        of: [
            {
            type: 'block'
            }
        ],
        description: 'Content details for video section.',
    }),
    defineField({
        name: 'contentList',
        title: 'Content List',
        type: 'array',
        of: [
            {
                type: 'object',
                fields: [
                    {
                        name: 'content',
                        title: 'Content', 
                        type: 'array',
                        of:[
                          {
                            type: 'block',
                            marks: {
                              annotations: [
                                  {
                                      name: 'link',
                                      type: 'object',
                                      title: 'link',
                                      fields: [
                                      {
                                          name: 'href',
                                          type: 'string',
                                          title: 'URL'
                                      },
                                      {
                                          title: 'Open in new tab',
                                          name: 'blank',
                                          type: 'boolean'
                                      }
                                      ]
                                  },
                              ],
                            }
                          }
                        ]
                    },
                ],
            },
        ],
    }),
    defineField({
        name: 'ctaForContent',
        title: 'CTA For Content',
        type: 'button',
    }),
  ],
  preview: {
    select: {
      media: 'image',
    },
    prepare(selection) {
      const { media } = selection;
      return {
        media,
      };
    },
  },
});
