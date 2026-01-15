import { defineType, defineField } from 'sanity';
import { BsImage } from 'react-icons/bs';

export default defineType({
  name: 'imageGrid',
  type: 'object',
  title: 'Image Grid',
  icon: BsImage,
  fields: [
    defineField({
        name: 'style',
        title: 'Style',
        type: 'string',
        options: {
          list: [
            { title: 'Horizontal Image Grid', value: 'horizontal' },
            { title: 'Vertical Image Grid', value: 'vertical' },
          ],
          layout: 'radio',
        },
        validation: Rule => Rule.required().error('This is required')
    }),
    defineField({
      name: 'columns',
      type: 'array',
      title: 'Image Columns',
      of: [
        {
          type: 'object',
          title: 'Image Column',
          fields: [
            defineField({
                name: 'imageTitle',
                type: 'string',
                title: 'Image Title',
            }),
            defineField({
              name: 'image',
              type: 'image',
              title: 'Image',
              options: {
                hotspot: true,
              },
              validation: Rule => Rule.required().error('Image is required'),
            }),
            defineField({
              name: 'link',
              type: 'string',
              title: 'Link',
              description: 'Link for image'
            }),
            defineField({
                title: 'Open in new tab',
                name: 'blank',
                type: 'boolean'
            }),
            defineField({
                name: 'imageCaption',
                title: 'Image Caption',
                type: 'string'
            }),
            defineField({
                name: 'imageDimensions',
                title: 'Image Dimensions',
                type: 'object',
                fields: [
                    defineField({
                        name: 'width',
                        title: 'Width',
                        type: 'number',
                    }),
                    defineField({
                        name: 'height',
                        title: 'Height',
                        type: 'number',
                    }),
                ]
            }),
            defineField({
                name: 'imageAlign',
                title: 'Image Alignment',
                type: 'string',
                options: {
                    list: [
                        {title: 'Left', value: 'left'},
                        {title: 'Right', value: 'right'},
                        {title: 'Center', value: 'center'},
                    ],
                    layout: 'dropdown', 
                },
            }),
          ],
        },
      ],
      validation: Rule => Rule.required().min(1).error('At least one image column is required'),
    }),
  ],
  preview: {
    select: {
      title: 'imageTitle'
    },
    prepare(selection) {
      const { title } = selection;
      return {
        title,
      };
    },
  },
});
