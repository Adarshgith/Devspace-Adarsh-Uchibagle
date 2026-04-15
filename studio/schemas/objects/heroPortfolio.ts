import { defineField, defineType } from 'sanity'
import { RiUserStarLine } from 'react-icons/ri'

export default defineType({
  name: 'heroPortfolio',
  title: 'Hero — Portfolio',
  type: 'object',
  icon: RiUserStarLine,

  fields: [
    // ── Availability badge ─────────────────────────────────────────
    defineField({
      name: 'availableForWork',
      title: 'Available for Work?',
      type: 'boolean',
      description: 'Show "Available for opportunities" badge.',
      initialValue: true,
    }),

    // ── Main content ───────────────────────────────────────────────
    defineField({
      name: 'greeting',
      title: 'Role / Sub-title',
      type: 'string',
      description: 'Shown below your name, e.g. "Full Stack Developer"',
      initialValue: 'Full Stack Developer',
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
      description: 'Your full name',
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: 'description',
      title: 'Professional Summary',
      type: 'array',
      description: 'Short professional summary shown in hero.',
      of: [{ type: 'block' }],
    }),

    // ── Stats ──────────────────────────────────────────────────────
    defineField({
      name: 'yearsOfExperience',
      title: 'Years of Experience',
      type: 'number',
      description: 'e.g. 3',
      initialValue: 3,
    }),

    defineField({
      name: 'projectsCount',
      title: 'Projects Count',
      type: 'number',
      description: 'e.g. 15',
      initialValue: 15,
    }),

    // ── Tech tags ──────────────────────────────────────────────────
    defineField({
      name: 'techTags',
      title: 'Tech Stack Tags',
      type: 'array',
      description: 'e.g. Next.js, TypeScript, React',
      of: [{ type: 'string' }],
    }),

    // ── Resume ─────────────────────────────────────────────────────
    defineField({
      name: 'resumeUrl',
      title: 'Resume / CV URL',
      type: 'file',
      description: 'Upload your resume PDF directly.',
      options: {
        accept: '.pdf,.doc,.docx'
      },
    }),

    defineField({
      name: 'buttons',
      title: 'CTA Buttons',
      type: 'array',
      description: 'Add up to 2 call-to-action buttons (e.g. Get in Touch).',
      of: [{ type: 'button' }],
      validation: (Rule) => Rule.max(2).error('Only 2 buttons are allowed.'),
    }),

    // ── Social links ───────────────────────────────────────────────
    defineField({
      name: 'socialLinks',
      title: 'Social Media Links',
      type: 'array',
      description: 'Social icons shown in the hero (max 5).',
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
    },
    prepare({ title, subtitle }) {
      return {
        title: title || 'Hero Section',
        subtitle: subtitle || 'Portfolio hero',
      }
    },
  },
})