// Importing the icon from 'react-icons' for visual representation in the CMS.
import { AiFillControl } from 'react-icons/ai';
import { MdFormatAlignCenter, MdAlignHorizontalLeft, MdFormatAlignRight } from "react-icons/md";

export  const TextAlign = (props: any) => {
    return (
        <div style={{textAlign: props.value ? props.value : 'left', width: '100%'}}>
            {props.children}
        </div>
    )
}

// Schema definition for 'faq', a document type that contains frequently asked questions.
const faq = {
  name: 'faq',
  title: 'FAQ Section',
  type: 'object',
  icon: AiFillControl, // Set an icon for this document type from react-icons.

  // Define the fields within the FAQ document.
  fields: [
    {
      name: 'title',
      title: 'Title',
      type: 'string',
      description: 'The title for the contact section."',
      
    },
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
      name: 'contactUs',
      title: 'Contact Us',
      type: 'object',
      fields: [
        {
          name: 'title',
          title: 'Title',
          type: 'string',
        },
        {
          name: 'button',
          title: 'Button',
          type: 'button',
        },
      ],
    },
  ],
};

// Export the 'faq' schema to make it available for use in Sanity Studio.
export default faq;
