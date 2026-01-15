// Import type for validation from '@sanity/types'.
import type {Rule} from '@sanity/types'

// Importing an icon for visual representation in the CMS.
import {BiMessageRoundedDots} from 'react-icons/bi'

// Interface to handle the visibility settings of advance options within the document.
interface AdvanceOptionsDocument {
  advanceOptions?: {
    visibility?: boolean // Optional boolean to control the visibility of certain fields.
  }
}

/**
 * Schema definition for 'advanceOptions', an object type in Sanity to manage advanced
 * settings and configurations for webpages. This includes visibility toggles and custom scripts.
 */
const advanceOptions = {
  name: 'advanceOptions',
  title: 'Advance Options',
  type: 'object',
  icon: BiMessageRoundedDots, // Use an icon to visually distinguish this type in the studio.

  // Fields defining the properties of the Advance Options section.
  fields: [
    {
      name: 'publishedAt',
      type: 'datetime',
      title: 'Published At',
      description: 'The date and time when the section was or will be published.',
      hidden: ({document}: {document: AdvanceOptionsDocument}) =>
        !document?.advanceOptions?.visibility, // Field visibility depends on a boolean flag.
    },
    {
      name: 'customScript',
      type: 'text',
      title: 'Custom Script',
      description: 'Custom JavaScript to be included in the section for extended functionality.',
      hidden: ({document}: {document: AdvanceOptionsDocument}) =>
        !document?.advanceOptions?.visibility, // Conditionally hides based on the visibility setting.
    },
    {
      name: 'visibility',
      type: 'boolean',
      title: 'Visible',
      description: 'Toggle whether the section is visible to the public or hidden.',
      initialValue: true,
    },
  ],
}

// Export the 'advanceOptions' schema to make it available for use in Sanity Studio.
export default advanceOptions
