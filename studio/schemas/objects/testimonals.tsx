import type { Rule } from '@sanity/types';
import { BiMessageRoundedDots } from 'react-icons/bi';
import { MdNotes, MdFormatAlignCenter, MdAlignHorizontalLeft, MdFormatAlignRight } from "react-icons/md";

export  const TextAlign = (props: any) => {
    return (
        <div style={{textAlign: props.value ? props.value : 'left', width: '100%'}}>
            {props.children}
        </div>
    )
}

const testimonials = {
  name: 'testimonial', 
  title: 'Testimonial Section', 
  type: 'object', 
  icon: BiMessageRoundedDots, 

  fields: [
    {
      name: 'sectionTitle',
      title: 'Section Title',
      type: 'string', 
      description: 'Title for the testimonial section, e.g., "What Our Clients Say"',
    },
    // {
    //   name: 'description',
    //   title: 'Description',
    //   type: 'text', 
    //   description: 'Optional description for the testimonial section.',
    // },
     {
        name: 'description',
        title: 'Description',
        type: 'array',
        of: [
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
                    decorators: [
                        { title: 'Strong', 'value': 'strong' },
                        { title: 'Emphasis', 'value': 'em' },
                        { title: 'Code', 'value': 'code' },
                        { title: 'Underline', 'value': 'underline' },
                        { title: 'Strike', 'value': 'strike-through' },
                        {
                            title: 'Sup',
                            value: 'sup',
                            icon: () => <div>x<sup>2</sup></div>,
                            component: ({ children }: any) => <sup>{children}</sup>
                        },
                        {
                            title: 'Sub',
                            value: 'sub',
                            icon: () => <div>x<sub>2</sub></div>,
                            component: ({ children }: any) => <sub>{children}</sub>
                        },
                        {title: 'Left', value: 'left', icon: MdAlignHorizontalLeft, component: (props: any) => TextAlign(props)},
                        {title: 'Center', value: 'center', icon: MdFormatAlignCenter, component: (props: any) => TextAlign(props)},
                        {title: 'Right', value: 'right', icon: MdFormatAlignRight, component: (props: any) => TextAlign(props)},
                    ]
                },
                styles: [
                    { title: 'Normal', value: 'normal' },
                    { title: 'Heading 1', value: 'h1' },
                    { title: 'Heading 2', value: 'h2' },
                    { title: 'Heading 3', value: 'h3' },
                    { title: 'Heading 4', value: 'h4' },
                    { title: 'Heading 5', value: 'h5' },
                    { title: 'Heading 6', value: 'h6' },
                    { title: 'Quote', value: 'blockquote' },
                    { title: 'Stamp', value: 'stamp' },
                ],
            },
            {
                type: 'object',
                name: 'button',
                title: 'Button',
                fields: [
                  {
                    name: 'text',
                    title: 'Text',
                    type: 'string',
                    description: 'The text displayed on the button',
                  },
                  {
                    name: 'url',
                    title: 'URL',
                    type: 'string',
                    description: 'The destination the button will link to',
                  },
                  {
                    name: 'style',
                    title: 'Style',
                    type: 'string',
                    description: 'The appearance style of the button',
                    options: {
                      list: [
                        { title: 'Primary', value: 'primaryBtn' },
                        { title: 'Secondary', value: 'secondaryBtn' },
                        { title: 'Tertiary', value: 'tertiarybtn' },
                      ],
                      layout: 'radio',
                    },
                  },
                ],
            },
        ],
      },
    {
      name: 'testimonialData',
      title: 'Testimonial Data',
      type: 'array', 
      of: [
        {
          type: 'object',
          title: 'Testimonial Entry',
          fields: [
            {
              name: 'authorName',
              title: 'Author Name',
              type: 'string',
              description: 'Name of the person giving the testimonial',
              validation: (Rule: Rule) => Rule.required().error('Author name is required'),
            },
            {
              name: 'authorImage',
              title: 'Author Image',
              type: 'image', 
              options: {
                hotspot: true, 
              },
              description: 'Logo of the company the author represents',
            },
            {
              name: 'designation',
              title: 'Designation',
              type: 'string',
              description: 'Position or title of the author, e.g., "CEO of Sakura Clinic"',
            },
            {
              name: 'affiliation',
              title: 'Affiliation',
              type: 'string',
            },
            {
              name: 'quote',
              title: 'Quote',
              type: 'array',
              of: [
                {
                  type: 'block', 
                },
              ],
              description: 'Additional content or rich text blocks for more testimonial details.',
              validation: (Rule: Rule) => Rule.required().error('Testimonial quote is required'),
            },
            {
              name: 'companyLogo',
              title: 'Company Logo',
              type: 'image', 
              options: {
                hotspot: true, 
              },
              description: 'Logo of the company the author represents',
            },
            {
              name: 'button',
              title: 'Button',
              type: 'button',
            }
          ],
        },
      ],
    },
  ],
};

// Export the 'testimonials' schema to make it available for use in Sanity Studio.
export default testimonials;
