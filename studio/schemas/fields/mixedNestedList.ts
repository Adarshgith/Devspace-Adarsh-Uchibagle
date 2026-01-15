// schemas/blocks/mixedNestedList.ts
export default {
    name: 'mixedNestedList',
    type: 'object',
    title: 'Mixed Nested List',
    fields: [
      {
        name: 'content',
        type: 'array',
        of: [
          {
            type: 'object',
            name: 'listSection',
            fields: [
              {
                name: 'type',
                type: 'string',
                options: { list: ['ul', 'ol'], layout: 'radio' },
              },
              {
                name: 'items',
                type: 'array',
                of: [
                  {
                    type: 'object',
                    name: 'listItem',
                    fields: [
                      { name: 'text', type: 'string' },
                      { name: 'content', type: 'array', of: [{ type: 'block' }] },
                      {
                        name: 'nestedList',
                        type: 'object',
                        fields: [
                          { name: 'type', type: 'string', options: { list: ['ul', 'ol'], layout: 'radio' } },
                          {
                            name: 'items',
                            type: 'array',
                            of: [
                              {
                                type: 'object',
                                name: 'nestedListItem',
                                fields: [
                                  { name: 'text', type: 'string' },
                                  { name: 'content', type: 'array', of: [{ type: 'block' }] }
                                ]
                              }
                            ]
                          }
                        ]
                      }
                    ]
                  }
                ]
              }
            ]
          }
        ]
      },
    ],
    preview: {
        prepare() {
          return {
            title: 'Mixed Nested List',
          };
        },
      },
  };
  