import { FaQuestionCircle } from "react-icons/fa";
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
  name: 'faqs',
  title: 'FAQs',
  type: 'document',
  icon: FaQuestionCircle,
  preview: {
    select: {
      title: 'question',
      subtitle: 'faqIds',
    },
    prepare(selection) {
      const { title, subtitle } = selection;
      return {
        title: title || 'Untitled FAQ',
        subtitle: subtitle ? `FAQ ID: ${subtitle}` : undefined,
      };
    },
  },
  fields: [
    defineField({
      name: 'faqIds',
      title: 'FAQ IDs',
      type: 'string',
      description: 'Enter the IDs of the FAQs you want to include in this document. It should be FAQ101, FAQ102, etc.',
      validation: (Rule) =>
        Rule.custom(async (faqIds, context) => {
            if (!faqIds || faqIds.trim() === '') {
                return 'The FAQs is required.';
            }
            
            if (!context?.document) {
                return 'Validation context is missing the document.';
            }
    
            const client = context.getClient({ apiVersion: '2025-02-14' }); /* Use appropriate API version */
            const currentDocId = context.document._id.replace(/^drafts\./, ''); /* Remove 'drafts.' prefix if present */
            const existingDoc = await client.fetch(
              `*[_type == "faqs" && faqIds == $faqIds && _id != $currentDocId && !(_id in path("drafts.**"))][0]`, /* Exclude drafts */
              { faqIds, currentDocId }
            );
    
            if (existingDoc) {
              return 'FAQs must be unique. This value already exists in another published document.';
            }
    
            return true;
          }),
    }),    
    defineField({
      name: 'question', 
      title: 'Question',
      type: 'string',
      description: 'Clear, concise question. Keep under 100 characters for better readability.',
      validation: (Rule) => Rule.required().min(10).max(100).error('Question must be 10-100 characters for optimal readability.'),
    }),
    defineField({
        name: 'answer',
        title: 'Answer',
        type: 'array',
        description: 'Comprehensive answer to the question. Aim for 50-300 words for clarity.',
        validation: (Rule) => Rule.required().min(1).error('Answer is required for the FAQ.'),
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
    }),
    defineField({
      name: 'isProductSpecific', 
      title: 'Is Product Specific',
      type: 'boolean',
      initialValue: false,
      description: 'If true, the FAQ will only be shown for the selected product group',
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'reference',
      to: [{ type: 'faqscategories' }],
      description: 'The category this FAQ belongs to',
    }),
  ],
})