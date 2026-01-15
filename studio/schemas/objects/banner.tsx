import React from 'react';
import { MdOutlineWeb } from 'react-icons/md'; // Suitable icon for banners
import { defineField, defineType } from 'sanity';
import { MdFormatAlignCenter, MdAlignHorizontalLeft, MdFormatAlignRight } from "react-icons/md";

export  const TextAlign = (props: any) => {
    return (
        <div style={{textAlign: props.value ? props.value : 'left', width: '100%'}}>
            {props.children}
        </div>
    )
}

export default defineType({
  name: 'banner',
  title: 'Banner',
  type: 'object',
  icon: MdOutlineWeb,  // Icon for representing the banner in Sanity Studio
  fields: [
    defineField({
      name: 'heading',
      title: 'Heading',
      type: 'string',
      description: 'The main heading of the banner',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'subheading',
      title: 'Subheading',
      type: 'text',
      description: 'The subheading or description of the banner',
    }),
     defineField({
        name: 'content',
        title: 'Content',
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
            }
        ],
    }),
    defineField({
        name: 'button',
        type: 'array',
        title: 'Button',
        of: [
            {
                type: 'button',
            }
        ],
        validation: (Rule) => Rule.max(2).error('Only two button is allowed.'),
    }),
  ],
});
