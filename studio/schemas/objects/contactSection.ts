import { defineField, defineType } from 'sanity'
import { MdContactMail } from 'react-icons/md'

export default defineType({
  name: 'contactSection',
  title: 'Contact Section',
  type: 'object',
  icon: MdContactMail,

  fields: [
    defineField({
      name: 'subheading',
      title: 'Sub Heading',
      type: 'string',
      initialValue: 'Get In Touch',
    }),

    defineField({
      name: 'heading',
      title: 'Heading',
      type: 'string',
      initialValue: "Let's Connect",
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      description: 'Short text below heading',
      initialValue: "I'm currently open to full-time roles and freelance projects. Whether you have a question, opportunity, or just want to say hi — my inbox is always open!",
    }),

    defineField({
      name: 'email',
      title: 'Email',
      type: 'string',
    }),

    defineField({
      name: 'phone',
      title: 'Phone',
      type: 'string',
    }),

    defineField({
      name: 'location',
      title: 'Location',
      type: 'string',
    }),
  ],

  preview: {
    select: { title: 'heading' },
    prepare({ title }) {
      return {
        title: title || 'Contact Section',
      }
    },
  },
})