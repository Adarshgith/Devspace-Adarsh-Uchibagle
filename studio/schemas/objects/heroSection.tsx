import type { Rule } from '@sanity/types'
import React from 'react';
import { defineType, defineField } from 'sanity';
import { MdFormatAlignCenter, MdAlignHorizontalLeft, MdFormatAlignRight } from "react-icons/md";
export  const TextAlign = (props: any) => {
  return (
      <div style={{textAlign: props.value ? props.value : 'left', width: '100%'}}>
          {props.children}
      </div>
  )
}

interface HeroSectionDocument {
  heroSection?: {
    visible?: boolean
  }
}

interface BackgroundType {
  heroSection: any
  backgroundType?: string
}

const heroSection = {
  name: 'heroSection',
  title: 'Hero Section',
  type: 'object',
  fields: [
    {
      name: 'visible',
      type: 'boolean',
      title: 'Visible',
      description: 'Toggle whether the hero section is visible on the page.',
      initialValue: true,
      validation: (Rule: Rule) => Rule.required().error('Visibility setting must be specified.'),
    },
    {
      name: 'backgroundType',
      type: 'string',
      options: {
        list: [
          { value: 'homeherobg', title: 'Home Page Banner' },
          { value: 'hero-banner', title: 'Hero Banner' },
          { value: 'category-banner', title: 'Category Banner' },
          { value: 'about-banner', title: 'About Banner' },
          { value: 'services-banner', title: 'Services Banner' },
        ],
      },
      initialValue: 'hero-banner',
      hidden: ({document}: {document: HeroSectionDocument}) => !document?.heroSection?.visible,
    },
    {
      name: 'isBreadcrumb',
      title: 'Breadcrumb',
      type: 'boolean',
      initialValue: false,
      hidden: ({document}: {document: HeroSectionDocument}) => !document?.heroSection?.visible,
    },
    {
      name: 'heroImage',
      type: 'image',
      title: 'Hero Image',
      description: 'Upload an image to display in the hero section.',
      hidden: ({document}: {document: HeroSectionDocument}) => !document?.heroSection?.visible,
    },
    {
      name: 'mobileHeroImage',
      type: 'image',
      title: 'Mobile Hero Image',
      description: 'Upload an image to display in the hero section.',
      hidden: ({document}: {document: HeroSectionDocument}) => !document?.heroSection?.visible,
    },
    {
      name: 'heroText',
      type: 'text',
      title: 'Hero Text',
      description:
        'Enter the main text for the hero section. This text is typically bold and concise.',
      hidden: ({document}: {document: HeroSectionDocument}) => !document?.heroSection?.visible,
    },
    {
      name: 'subheader',
      type: 'text',
      title: 'Sub Heading',
      description: 'A subheading to provide additional context or information in the hero section.',
      hidden: ({document}: {document: HeroSectionDocument}) => !document?.heroSection?.visible,
    },
    {
      name: 'titlePrefix',
      type: 'string',
      title: 'Title Prefix',
      description:
        'Enter the Title Prefix for the hero section.',
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
      description: 'A brief description or supplementary text for the hero section.',
      hidden: ({document}: {document: HeroSectionDocument}) => !document?.heroSection?.visible,
    },
    {
      name: 'trackRecord',
      title: 'Track Record',
      type: 'array',
      of: [{type: 'object',
        fields: [
          {name: 'count', type: 'string'},
          {name: 'title', type: 'string'},
        ],
      }],
      initialValue: false,
      hidden: ({document}: {document: BackgroundType}) => document?.heroSection?.backgroundType !== 'about-banner',
    },
  ],
}

export default heroSection
