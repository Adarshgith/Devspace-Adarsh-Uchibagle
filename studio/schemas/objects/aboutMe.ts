import { defineField, defineType } from 'sanity'
import { RiUser3Line } from 'react-icons/ri'

/**
 * About Me Block Schema
 * _type: 'aboutMe'
 * Used as an embedded block inside a page row via PageContent / RenderBlock.
 * Shows a summary card — image left, content right, with a "Know More" button
 * that links to the full About Me page.
 */
export default defineType({
  name: 'aboutMe',
  title: 'About Me Block',
  type: 'object',
  icon: RiUser3Line,

  fields: [
    // ── Section label ──────────────────────────────────────────────
    defineField({
      name: 'sectionLabel',
      title: 'Section Label',
      type: 'string',
      description: 'Small label above the heading, e.g. "About Me"',
      initialValue: 'About Me',
    }),

    defineField({
      name: 'heading',
      title: 'Heading',
      type: 'string',
      description: 'Main heading, e.g. "Who I Am"',
      initialValue: 'Who I Am',
      validation: (Rule) => Rule.required(),
    }),

    // ── Profile image ──────────────────────────────────────────────
    defineField({
      name: 'profileImage',
      title: 'Profile Image',
      type: 'image',
      description: 'Photo shown on the left side of the block.',
      options: { hotspot: true },
    }),

    defineField({
      name: 'profileImageAlt',
      title: 'Profile Image Alt Text',
      type: 'string',
      initialValue: 'Profile photo',
    }),

    // ── Short bio ──────────────────────────────────────────────────
    defineField({
      name: 'shortBio',
      title: 'Short Bio',
      type: 'text',
      rows: 4,
      description: 'Brief description shown in the summary card (max 300 chars).',
      validation: (Rule) => Rule.required().max(300),
    }),

    // ── Stats ──────────────────────────────────────────────────────
    defineField({
      name: 'yearsOfExperience',
      title: 'Years of Experience',
      type: 'number',
      description: 'e.g. 5',
    }),

    defineField({
      name: 'location',
      title: 'Location',
      type: 'string',
      description: 'e.g. "Nagpur, India"',
    }),

    // ── Know More button — links to full About page ────────────────
    defineField({
      name: 'knowMoreButton',
      title: 'Know More Button',
      type: 'button',
      description: 'Button that links to your full About Me page.',
    }),
  ],

  preview: {
    select: {
      title: 'heading',
      subtitle: 'shortBio',
      media: 'profileImage',
    },
    prepare({ title, subtitle, media }) {
      return {
        title: title || 'About Me Block',
        subtitle: subtitle?.slice(0, 60) + '...' || '',
        media,
      }
    },
  },
})