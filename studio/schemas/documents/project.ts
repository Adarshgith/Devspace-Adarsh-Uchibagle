import { defineField, defineType } from 'sanity'
import { MdOutlineRocketLaunch } from 'react-icons/md'

/**
 * Project Document Schema
 * _type: 'project'
 * Standalone document — editors create projects here.
 * Referenced by the projectsSection block component.
 */
export default defineType({
  name: 'project',
  title: 'Project',
  type: 'document',
  icon: MdOutlineRocketLaunch,

  fields: [
    // ── Basic info ─────────────────────────────────────────────────
    defineField({
      name: 'name',
      title: 'Project Name',
      type: 'string',
      description: 'e.g. "ENGG.SPACE"',
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'name', maxLength: 96 },
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: 'date',
      title: 'Date',
      type: 'string',
      description: 'e.g. "FEB 2026" or "AUG 2025"',
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: 'isWIP',
      title: 'Work In Progress (WIP)',
      type: 'boolean',
      description: 'Show WIP badge on this project.',
      initialValue: false,
    }),

    // ── Image ──────────────────────────────────────────────────────
    defineField({
      name: 'image',
      title: 'Project Screenshot / Image',
      type: 'image',
      options: { hotspot: true },
      description: 'Screenshot or preview image of the project.',
    }),

    // ── Description ────────────────────────────────────────────────
    defineField({
      name: 'description',
      title: 'Short Description',
      type: 'text',
      rows: 3,
      description: 'Brief description shown on the card (max 150 chars).',
      validation: (Rule) => Rule.required().max(150),
    }),

    // ── Tech stack ─────────────────────────────────────────────────
    defineField({
      name: 'techStack',
      title: 'Tech Stack Tags',
      type: 'array',
      description: 'Add technologies used, e.g. "Next.js", "TypeScript".',
      of: [
        {
          type: 'object',
          title: 'Tech Tag',
          fields: [
            defineField({
              name: 'name',
              title: 'Technology Name',
              type: 'string',
              description: 'e.g. "Next.js", "TypeScript", "MongoDB"',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'icon',
              title: 'Icon Image (optional)',
              type: 'image',
              description: 'Small icon for this technology.',
              options: { hotspot: false },
            }),
          ],
          preview: {
            select: { title: 'name' },
          },
        },
      ],
    }),

    // ── Links ──────────────────────────────────────────────────────
    defineField({
      name: 'liveLink',
      title: 'Live Link',
      type: 'url',
      description: 'URL to the live project.',
    }),

    defineField({
      name: 'githubLink',
      title: 'GitHub Link',
      type: 'url',
      description: 'URL to the GitHub repository.',
    }),

    // ── Order ──────────────────────────────────────────────────────
    defineField({
      name: 'order',
      title: 'Display Order',
      type: 'number',
      description: 'Lower number = shown first. e.g. 1, 2, 3...',
      initialValue: 99,
    }),
  ],

  preview: {
    select: {
      title: 'name',
      subtitle: 'date',
      media: 'image',
    },
    prepare({ title, subtitle, media }) {
      return {
        title: title || 'Project',
        subtitle: subtitle || '',
        media,
      }
    },
  },

  orderings: [
    {
      title: 'Display Order',
      name: 'orderAsc',
      by: [{ field: 'order', direction: 'asc' }],
    },
    {
      title: 'Date, Latest First',
      name: 'dateDesc',
      by: [{ field: 'date', direction: 'desc' }],
    },
  ],
})