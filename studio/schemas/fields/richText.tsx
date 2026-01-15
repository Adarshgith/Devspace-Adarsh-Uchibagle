import { ReactNode } from 'react';
import { BiEdit } from 'react-icons/bi';
import { MdFormatAlignCenter, MdAlignHorizontalLeft, MdFormatAlignRight } from "react-icons/md";
import { HiHashtag } from 'react-icons/hi';
import { brandColors } from '../globals';

export const TextAlign = (props: any) => {
    return (
        <div style={{textAlign: props.value ? props.value : 'left', width: '100%'}}>
            {props.children}
        </div>
    )
}

interface StyleProps {
  children: ReactNode;
}

interface PreviewSelector {
  block0?: any;
  block1?: any;
  block2?: any;
  block3?: any;
}

const Callout = ({ children }: StyleProps) => (
  <span
    style={{
      fontSize: '28px',
      lineHeight: '32px',
      fontWeight: '700',
      color: '#616C76',
    }}
  >
    {children}
  </span>
);

const SmallStyle = ({ children }: StyleProps) => (
  <span style={{ fontSize: '14px', lineHeight: '16px' }}>{children}</span>
);

interface BlockRenderProps {
  children: ReactNode;
}

const richText = {
  name: 'richText',
  type: 'object',
  title: 'Rich Content',
  icon: BiEdit,
  fields: [
    {
      name: 'width',
      type: 'width',
    },
    {
      name: 'align',
      type: 'align',
      title: 'Body Text Align',
    },
    {
      name: 'content',
      type: 'array',
      title: 'Content',
      of: [
        {
          type: 'block', // Allows rich text blocks within the content array.
          marks: {
            annotations: [
              {
                name: 'link',
                type: 'object',
                title: 'link',
                fields: [
                  {
                    name: 'href',
                    type: 'url',
                    title: 'URL',
                    validation: (Rule: any) => Rule.uri({
                      scheme: ['http', 'https', 'mailto', 'tel']
                    }),
                  },
                  {
                    title: 'Open in new tab',
                    name: 'blank',
                    type: 'boolean'
                  }
                ]
              } ],
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
          type: 'image',
          fields: [
            {
              name: 'caption',
              type: 'string',
              title: 'Caption',
              description: 'Optional caption to display below the image'
            },
            {
              name: 'link',
              type: 'url'
            },
            {
              title: 'Open in new tab',
              name: 'blank',
              type: 'boolean'
            }
          ]
        },
      ],
    },
  ],
  preview: {
    select: {
      block0: 'content.0',
      block1: 'content.1',
      block2: 'content.2',
      block3: 'content.3',
    },
    prepare: ({ block0, block1, block2, block3 }: PreviewSelector) => {
      const blocks = [block0, block1, block2, block3].filter(Boolean);
      const haveText =
        blocks.length > 0
          ? blocks.filter((block) => block._type === 'block' && block.children[0].text.length > 0)
          : [];
      const isImage = blocks.length > 0 ? blocks.filter((block) => block._type === 'image') : [];
      const image = isImage.length > 0 ? isImage[0]['asset'] : '';
      const title = haveText.length > 0 ? haveText[0].children[0].text : '';
      return {
        title: title ? `${title}...` : 'Rich Text',
        subtitle: !title ? 'This block contains no content.' : undefined,
        media: image,
      };
    },
  },
};

export default richText;
