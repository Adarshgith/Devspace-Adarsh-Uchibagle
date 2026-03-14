import { defineField, defineType } from 'sanity'
import { MdOutlineApps } from 'react-icons/md'

/**
 * Projects Section Block Schema
 * _type: 'projectsSection'
 * Used as an embedded block inside a page row via PageContent / RenderBlock.
 * Editor selects which project documents to show and in what order.
 */
export default defineType({
  name: 'projectsSection',
  title: 'Projects Section',
  type: 'object',
  icon: MdOutlineApps,

  fields: [
    // ── Section header ─────────────────────────────────────────────
    defineField({
      name: 'heading',
      title: 'Heading',
      type: 'string',
      description: 'Main heading, e.g. "PROJECTS"',
      initialValue: 'PROJECTS',
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: 'subheading',
      title: 'Subheading (Optional)',
      type: 'string',
      description: 'Optional subtitle below heading.',
    }),

    // ── Project references ─────────────────────────────────────────
    defineField({
      name: 'projects',
      title: 'Projects',
      type: 'array',
      description: 'Select and order the projects to display in this section.',
      of: [
        {
          type: 'reference',
          to: [{ type: 'project' }],
        },
      ],
      validation: (Rule) => Rule.required().min(1).error('Add at least one project.'),
    }),
  ],

  preview: {
    select: {
      title: 'heading',
      subtitle: 'subheading',
    },
    prepare({ title, subtitle }) {
      return {
        title: title || 'Projects Section',
        subtitle: subtitle || 'Displays selected projects',
      }
    },
  },
})