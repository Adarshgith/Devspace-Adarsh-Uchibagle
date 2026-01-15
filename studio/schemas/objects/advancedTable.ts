import { defineType, defineField } from 'sanity';
import { CiViewTable } from "react-icons/ci";

export default defineType({
  name: 'advancedTable',
  title: 'Advanced Table',
  type: 'object',
  icon: CiViewTable,
  fields: [
    defineField({
      name: 'title',
      title: 'Table Title',
      type: 'string',
      validation: (Rule) => Rule.max(100).warning('Title should be under 100 characters'),
    }),
    defineField({
      name: 'description',
      title: 'Table Description',
      type: 'array',
      of: [
        {
          type: 'block',
          marks: {
            decorators: [
              { title: 'Strong', value: 'strong' },
              { title: 'Emphasis', value: 'em' },
              { title: 'Underline', value: 'underline' },
            ],
            annotations: [
              {
                name: 'link',
                type: 'object',
                title: 'Link',
                fields: [
                  {
                    name: 'href',
                    type: 'url',
                    title: 'URL',
                    validation: (Rule) => Rule.uri({
                      allowRelative: true,
                      scheme: ['http', 'https', 'mailto', 'tel']
                    })
                  },
                  {
                    name: 'openInNewTab',
                    type: 'boolean',
                    title: 'Open in new tab',
                    initialValue: false,
                  }
                ]
              }
            ]
          },
          styles: [],
          lists: [
            { title: 'Bullet', value: 'bullet' },
            { title: 'Number', value: 'number' },
          ],
        }
      ],
      description: 'Optional rich text description for the table',
    }),
    defineField({
      name: 'caption',
      title: 'Table Caption',
      type: 'text',
      description: 'Optional caption for the table',
    }),
    defineField({
      name: 'hasHeader',
      title: 'Has Header Row',
      type: 'boolean',
      initialValue: true,
      description: 'Whether the first row should be treated as headers',
    }),
    defineField({
      name: 'tableWidth',
      title: 'Table Width',
      type: 'string',
      options: {
        list: [
          { title: 'Fit with Content', value: 'fit-content' },
          { title: 'Full Width', value: 'full-width' },
        ],
        layout: 'radio',
      },
      initialValue: 'fit-content',
      description: 'Choose how the table should expand horizontally',
    }),
    defineField({
      name: 'tableRows',
      title: 'Table Rows',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'tableRow',
          title: 'Table Row',
          fields: [
            {
              name: 'cells',
              title: 'Cells',
              type: 'array',
              of: [
                {
                  type: 'object',
                  name: 'tableCell',
                  title: 'Table Cell',
                  fields: [
                    {
                      name: 'content',
                      title: 'Cell Content',
                      type: 'array',
                      of: [
                        {
                          type: 'block',
                          marks: {
                            decorators: [
                              { title: 'Strong', value: 'strong' },
                              { title: 'Emphasis', value: 'em' },
                              { title: 'Underline', value: 'underline' },
                            ],
                            annotations: [
                              {
                                name: 'link',
                                type: 'object',
                                title: 'Link',
                                fields: [
                                  {
                                    name: 'href',
                                    type: 'url',
                                    title: 'URL',
                                    validation: (Rule) => Rule.uri({
                                      allowRelative: true,
                                      scheme: ['http', 'https', 'mailto', 'tel']
                                    })
                                  },
                                  {
                                    name: 'openInNewTab',
                                    type: 'boolean',
                                    title: 'Open in new tab',
                                    initialValue: false,
                                  }
                                ]
                              }
                            ]
                          },
                          styles: [],
                          lists: [
                            { title: 'Bullet', value: 'bullet' },
                            { title: 'Number', value: 'number' },
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
                      description: 'Rich text content with link support',
                    },
                    {
                      name: 'rowSpan',
                      title: 'Row Span',
                      type: 'number',
                      initialValue: 1,
                      validation: (Rule) => Rule.min(1).max(20),
                      description: 'Number of rows this cell spans',
                    },
                    {
                      name: 'colSpan',
                      title: 'Column Span',
                      type: 'number',
                      initialValue: 1,
                      validation: (Rule) => Rule.min(1).max(20),
                      description: 'Number of columns this cell spans',
                    },
                    {
                      name: 'isHeader',
                      title: 'Is Header Cell',
                      type: 'boolean',
                      initialValue: false,
                      description: 'Render this cell as a header (th) instead of data cell (td)',
                    },
                    {
                      name: 'alignment',
                      title: 'Text Alignment',
                      type: 'string',
                      options: {
                        list: [
                          { title: 'Left', value: 'left' },
                          { title: 'Center', value: 'center' },
                          { title: 'Right', value: 'right' },
                        ],
                      },
                      initialValue: 'left',
                    },
                  ],
                  preview: {
                    select: {
                      content: 'content',
                      rowSpan: 'rowSpan',
                      colSpan: 'colSpan',
                    },
                    prepare({ content, rowSpan, colSpan }) {
                      let text = 'Empty cell';
                      
                      if (content && content.length > 0) {
                        const firstItem = content[0];
                        if (firstItem.children && firstItem.children[0]?.text) {
                          text = firstItem.children[0].text;
                        }
                        else if (firstItem._type === 'button' && firstItem.text) {
                          text = `Button: ${firstItem.text}`;
                        }
                        else if (firstItem._type === 'button') {
                          text = 'Button';
                        }
                      }
                      
                      const spans = [];
                      if (rowSpan > 1) spans.push(`R:${rowSpan}`);
                      if (colSpan > 1) spans.push(`C:${colSpan}`);
                      const spanText = spans.length > 0 ? ` (${spans.join(', ')})` : '';
                      
                      return {
                        title: `${text}${spanText}`,
                        subtitle: spans.length > 0 ? `Spans: ${spans.join(', ')}` : undefined,
                      };
                    },
                  },
                }
              ],
              validation: (Rule) => Rule.min(1).error('At least one cell is required per row'),
            }
          ],
          preview: {
            select: {
              cells: 'cells',
            },
            prepare({ cells }) {
              const cellCount = cells?.length || 0;
              const firstCellText = cells?.[0]?.content?.[0]?.children?.[0]?.text || 'Empty';
              
              return {
                title: `Row: ${firstCellText}${cellCount > 1 ? '...' : ''}`,
                subtitle: `${cellCount} cell${cellCount !== 1 ? 's' : ''}`,
              };
            },
          },
        }
      ],
      validation: (Rule) => Rule.min(1).error('At least one row is required'),
    }),
    defineField({
      name: 'additionalContent',
      title: 'Additional Content',
      type: 'array',
      of: [
        {
          type: 'block',
        }
      ],
      description: 'Optional content to display after the table',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      tableRows: 'tableRows',
    },
    prepare({ title, tableRows }) {
      const rowCount = tableRows?.length || 0;
      return {
        title: title || 'Advanced Table',
        subtitle: `${rowCount} row${rowCount !== 1 ? 's' : ''}`,
      };
    },
  },
});
