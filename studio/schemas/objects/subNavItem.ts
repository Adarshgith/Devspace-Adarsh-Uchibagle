// Import type for validation purposes, assuming these are used for custom validation logic.

/**
 * Schema for 'subNavigationItem', an object type in Sanity to manage
 * individual items within a broader navigation structure.
 * This schema includes potential for nested submenus, allowing for deep navigation hierarchies.
 */
export default {
  name: 'subNavigationItem', // Unique identifier for the schema within Sanity.
  title: 'Submenu Item', // Human-readable title for the schema as it appears in Sanity Studio.
  type: 'object', // Specifies that this schema defines an object type.

  // Fields define the structure and content of the submenu item.
  fields: [
    {
      name: 'text', // Unique identifier for the field within the document.
      type: 'string', // Data type of the field, which is a simple text string in this case.
      title: 'Navigation Text', // Title of the field that appears in Sanity Studio.
      //validation: (Rule: { required: () => any }) => Rule.required(), // Ensures that the navigation text is always provided.
      // Comment: Validation rule to make sure that this field is never left empty.
    },
    {
      name: 'isMegaMenu',
      type: 'boolean',
      title: 'Enable Mega Menu',
      description: 'Check to enable mega menu and enter HTML content.',
      initialValue: false, // Default to unchecked
      // hidden: ({ document, parent }: any) => {
      //   // Hide if the document title is not `HeaderMenu` or if there is a parent (nested item)
      //   return document?.title !== 'HeaderMenu' || !!parent;
      // },
    },
    {
      name: 'navigationItemUrl', // Field for storing the URL associated with the navigation item.
      type: 'link', // Data type changed from 'link' to 'url' for direct URL storage.
      title: 'Navigation Item URL', // Title of the field in the CMS.
      // Comment: This field is intended to store direct URLs, simplifying the data structure.
    },
    {
      name: 'subNavigationItems', // Field for nested navigation items, allowing recursive submenu structures.
      type: 'array', // Data type of the field, an array to hold multiple sub-navigation items.
      title: 'Sub Submenu', // Descriptive title for the field as it appears in Sanity Studio.
      of: [{ type: 'subNavigationItem' }], // Specifies the type of objects this array can contain.
      // Comment: Allows the nesting of submenu items to any depth.
    },
    {
      name: 'icon',
      type: 'image',
      title: 'Menu Icon',
      description: 'Upload an icon for the mega menu item.',
      //hidden: ({ parent }: any) => !parent?.isMegaMenu, // Only show if mega menu is enabled
      options: {
        hotspot: true, // Enable hotspot for better control of focal point
      },
    },
    {
      name: 'hoverIcon',
      type: 'image',
      title: 'Hover Icon',
      description: 'Upload an icon to display on hover for the mega menu item.',
      //hidden: ({ parent }: any) => !parent?.isMegaMenu, // Only show if mega menu is enabled
      options: {
        hotspot: true,
      },
    },
  ],
}
