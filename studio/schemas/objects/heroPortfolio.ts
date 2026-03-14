import { defineField, defineType } from 'sanity'
import { RiUserStarLine } from 'react-icons/ri'

/**
 * Hero Portfolio Section Schema
 * _type: 'heroPortfolio'
 * Used as an embedded block inside a page row via PageContent / RenderBlock.
 */
export default defineType({
  name: 'heroPortfolio',
  title: 'Hero — Portfolio',
  type: 'object',
  icon: RiUserStarLine,

  fields: [
    // ── Left side ─────────────────────────────────────────────────
    defineField({
      name: 'greeting',
      title: 'Greeting Text',
      type: 'string',
      description: "Small label above your name, e.g. \"Hi!, I'm a\"",
      initialValue: "Hi!, I'm a",
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: 'name',
      title: 'Name / Title',
      type: 'string',
      description: 'Your name or role, e.g. "Software Developer"',
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: 'description',
      title: 'Short Bio / Description',
      type: 'text',
      rows: 4,
      description: 'A short paragraph about yourself shown below your title.',
      validation: (Rule) => Rule.required().max(300),
    }),

    defineField({
      name: 'buttons',
      title: 'CTA Buttons',
      type: 'array',
      description: 'Add up to 2 call-to-action buttons.',
      of: [{ type: 'button' }],
      validation: (Rule) => Rule.max(2).error('Only 2 buttons are allowed.'),
    }),

    // ── Right side — Profile image ─────────────────────────────────
    defineField({
      name: 'profileImage',
      title: 'Profile Image',
      type: 'image',
      description: 'Your profile photo. Recommended: square, min 600×600px.',
      options: { hotspot: true },
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: 'profileImageAlt',
      title: 'Profile Image Alt Text',
      type: 'string',
      description: 'Accessible description, e.g. "John Doe smiling".',
      initialValue: 'Profile photo',
    }),

    // ── Social links ───────────────────────────────────────────────
    defineField({
      name: 'socialLinks',
      title: 'Social Media Links',
      type: 'array',
      description: 'Optional social icons shown in the hero (max 5).',
      of: [
        {
          type: 'object',
          title: 'Social Link',
          fields: [
            defineField({
              name: 'platform',
              title: 'Platform',
              type: 'string',
              options: {
                list: [
                  { title: 'GitHub', value: 'github' },
                  { title: 'LinkedIn', value: 'linkedin' },
                  { title: 'Twitter / X', value: 'twitter' },
                  { title: 'Instagram', value: 'instagram' },
                  { title: 'YouTube', value: 'youtube' },
                  { title: 'Other', value: 'other' },
                ],
              },
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'url',
              title: 'Profile URL',
              type: 'url',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'label',
              title: 'Label (accessibility)',
              type: 'string',
              description: 'Screen reader label, e.g. "Visit my GitHub profile".',
            }),
          ],
          preview: {
            select: { title: 'platform', subtitle: 'url' },
          },
        },
      ],
      validation: (Rule) => Rule.max(5),
    }),
  ],

  preview: {
    select: {
      title: 'name',
      subtitle: 'greeting',
      media: 'profileImage',
    },
    prepare({ title, subtitle, media }) {
      return {
        title: title || 'Hero Section',
        subtitle: subtitle || 'Portfolio hero',
        media,
      }
    },
  },
})