// schemas/skillsSection.ts

import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'skillsSection',
  title: 'Skills Section',
  type: 'object',
  fields: [
    defineField({
      name: 'sectionTitle',
      title: 'Section Title',
      type: 'string',
      initialValue: 'Technical Skills',
    }),
    defineField({
      name: 'sectionSubtitle',
      title: 'Section Subtitle',
      type: 'string',
      initialValue: 'Technologies I work with',
    }),
    defineField({
      name: 'categories',
      title: 'Skill Categories',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'skillCategory',
          title: 'Skill Category',
          fields: [
            defineField({
              name: 'categoryName',
              title: 'Category Name',
              type: 'string',
              // e.g. "Frontend", "Backend", "DevOps"
            }),
            defineField({
              name: 'categoryIcon',
              title: 'Category Icon (emoji)',
              type: 'string',
              // e.g. "🎨" for Frontend, "⚙️" for Backend
            }),
            defineField({
              name: 'skills',
              title: 'Skills',
              type: 'array',
              of: [
                {
                  type: 'object',
                  name: 'skill',
                  title: 'Skill',
                  fields: [
                    defineField({
                      name: 'name',
                      title: 'Skill Name',
                      type: 'string',
                    }),
                    defineField({
                      name: 'logo',
                      title: 'Skill Logo',
                      type: 'image',
                      options: { hotspot: false },
                      description: 'Upload skill logo/icon (SVG or PNG recommended)',
                    }),
                  ],
                  preview: {
                    select: {
                      title: 'name',
                      media: 'logo',
                      subtitle: 'proficiency',
                    },
                  },
                },
              ],
            }),
          ],
          preview: {
            select: {
              title: 'categoryName',
              subtitle: 'categoryIcon',
            },
          },
        },
      ],
    }),
  ],
  preview: {
    select: { title: 'sectionTitle' },
  },
})