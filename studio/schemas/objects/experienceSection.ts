    import { defineField, defineType } from 'sanity'
import { MdWorkOutline } from 'react-icons/md'

/**
 * Experience Section Schema
 * _type: 'experienceSection'
 * Used as an embedded block inside a page row via PageContent / RenderBlock.
 * Displays a horizontal timeline of work experiences, latest first.
 */
export default defineType({
  name: 'experienceSection',
  title: 'Experience Section',
  type: 'object',
  icon: MdWorkOutline,

  fields: [
    // ── Section header ─────────────────────────────────────────────
    defineField({
      name: 'sectionLabel',
      title: 'Section Label',
      type: 'string',
      description: 'Small label above heading, e.g. "My Journey"',
      initialValue: 'My Journey',
    }),

    defineField({
      name: 'heading',
      title: 'Heading',
      type: 'string',
      description: 'Main heading, e.g. "Work Experience"',
      initialValue: 'Work Experience',
      validation: (Rule) => Rule.required(),
    }),

    // ── Experience entries ─────────────────────────────────────────
    defineField({
      name: 'experiences',
      title: 'Experience Entries',
      type: 'array',
      description: 'Add your work experiences. They will be displayed latest first.',
      of: [
        {
          type: 'object',
          title: 'Experience',
          fields: [
            defineField({
              name: 'jobTitle',
              title: 'Job Title',
              type: 'string',
              description: 'e.g. "Frontend Engineer"',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'companyName',
              title: 'Company Name',
              type: 'string',
              description: 'e.g. "Keychain"',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'companyLogo',
              title: 'Company Logo',
              type: 'image',
              options: { hotspot: true },
              description: 'Company logo image.',
            }),
            defineField({
              name: 'employmentType',
              title: 'Employment Type',
              type: 'string',
              description: 'e.g. "Full Time", "Internship", "Contract"',
              initialValue: 'Full Time',
            }),
            defineField({
              name: 'startDate',
              title: 'Start Date',
              type: 'string',
              description: 'e.g. "Sep 2025"',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'endDate',
              title: 'End Date',
              type: 'string',
              description: 'e.g. "Present" or "Apr 2025"',
              initialValue: 'Present',
            }),
            defineField({
              name: 'description',
              title: 'Job Description',
              type: 'array',
              description: 'Rich text description of your role and responsibilities.',
              of: [{ type: 'block' }],
            }),
          ],
          preview: {
            select: {
              title: 'jobTitle',
              subtitle: 'companyName',
              media: 'companyLogo',
            },
            prepare({ title, subtitle, media }) {
              return {
                title: title || 'Experience',
                subtitle: subtitle || '',
                media,
              }
            },
          },
        },
      ],
    }),
  ],

  preview: {
    select: {
      title: 'heading',
      subtitle: 'sectionLabel',
    },
    prepare({ title, subtitle }) {
      return {
        title: title || 'Experience Section',
        subtitle: subtitle || '',
      }
    },
  },
})