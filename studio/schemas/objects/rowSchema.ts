import type { Rule } from '@sanity/types';


// Define the type for parent object
interface ParentType {
  columns?: number;
}
// Utility function to create column blocks with conditional visibility
const createColumnBlocks = (columnNumber: number) => ({
  name: `column${columnNumber}`,
  type: 'array',
  title: `Column ${columnNumber} Blocks`,
  of: [
    { type: 'infoBox' },
    { type: 'richText' },
    { type: 'faq' },
    { type: 'testimonial' },
    { type: 'card' },
    { type: 'banner' },
    { type: 'sectionBanner' },
    { type: 'tab' },
    { type: 'singleImage' },
    { type: 'imageTextBlock' },
    { type: 'contentBlock' },
    { type: 'featuredBlogSelector' },
    { type: 'featuredNewsSelector' },
    { type: 'upcomingEvent' },
    { type: 'hubspotSection' },
    { type: 'googleMap' },
    { type: 'trackRecord' },
    { type: 'imageGrid' },
    { type: 'jumpToSection' },
    // { type: 'tableComponent' },
    { type: 'bannerFullWidth' },
    { type: 'availablePositions' },
    { type: 'FAQSection' },
    { type: 'contentSnippet' },
    { type: 'infoBanner' },
    { type: 'advancedTable' },
    { type: 'homeFeatured' },
    { type: 'blogsListing' },
    { type: 'heroPortfolio' },
  ],
  hidden: ({ parent }: { parent?: { columns?: number, showColumn1?: boolean, showColumn2?: boolean, showColumn3?: boolean } }) => {
    if (!parent || typeof parent.columns === 'undefined') return true;

    const showColumnField = `showColumn${columnNumber}` as 'showColumn1' | 'showColumn2' | 'showColumn3';

    // Only show columns if they are enabled and within the selected column range
    return parent.columns < columnNumber || parent[showColumnField] === false;
  },
  validation: (Rule: Rule) =>
    Rule.custom((blocks: any[], context) => {
      const parent = context.parent as { columns?: number } | undefined;

      // Only validate if the current column should be visible
      if (parent && typeof parent.columns === 'number' && parent.columns >= columnNumber) {
        return Array.isArray(blocks) && blocks.length > 0
          ? true
          : `At least 1 block is required for Column ${columnNumber}`;
      }

      // If the column is hidden, skip validation
      return true;
    }),
});

// Schema for each row
const rowSchema = {
  name: 'row',
  type: 'object',
  title: 'Row',
  fields: [
    {
      title: 'Row Title',
      name: 'rowTitle',
      type: 'string',
      description: 'Give a title to this row (optional).',
      validation: (Rule: Rule) => Rule.max(100).warning('Row title should be under 100 characters.'),
    },
    {
      title: 'Row Type',
      name: 'rowType',
      type: 'string',
      description: 'Select whether the row is full-width or standard.',
      options: {
        list: [
          { title: 'Full Width', value: 'full' },
          { title: 'Standard Width', value: 'standard' },
        ],
        layout: 'radio',
      },
      validation: (Rule: Rule) => Rule.required(),
    },
    {
      title: 'Background',
      name: 'backgroundColor',
      type: 'string',
      options: {
        list: [
          { value: 'none', title: 'None' },
          { value: 'whiteYellow', title: 'White Yellow' },
          { value: 'backgroundImage', title: 'Background Image' },
          { value: 'hero-gradient', title: 'Hero Gradient (Indigo → Purple)' },
        ],
      },
      initialValue: 'none',
      validation: (Rule: Rule) => Rule.required(),
    },
    {
      name: 'bannerImage',
      type: 'image',
      title: 'Banner Background Image',
      description: 'Upload an image to display in the banner background section.',
      hidden: ({ parent }: any) => parent?.backgroundColor !== 'backgroundImage',
    },
    {
      name: 'sectionType',
      type: 'string',
      options: {
        list: [
          { value: 'custom-services', title: 'Custom services' },
          { value: 'stats-section', title: 'Stats section' },
          { value: 'tab-section', title: 'Tab section' },
          { value: 'home-featured-block', title: 'Home featured block' },
          { value: 'homepage-video-sec', title: 'Homepage video sec' },
          { value: 'blog-spacing', title: 'Blog spacing' },
          { value: 'compact-row', title: 'Compact Row' },
          { value: 'edge-top-section', title: 'Edge Top Section' },
          { value: 'category-banner', title: 'Category Banner' },
          { value: 'related-category', title: 'Related category' },
          { value: 'map-section', title: 'Map Section' },
          { value: 'form-section', title: 'Form Section' },
          { value: 'edge-top-section', title: 'Edge Top Section' },
          { value: 'edge-bottom-section', title: 'Edge bottom Section' },
          { value: 'products-slider-section', title: 'Products Slider Section' },
          { value: 'info-banner-section', title: 'Info Banner Section' },
          { value: 'testimonial-section', title: 'Testimonial Section' },
          { value: 'protocol-content-sidebar', title: 'Protocol Content Sidebar' },
          { value: 'resource-section', title: 'Resource Section' },
          { value: 'full-width-banner', title: 'Full width banner' },
          { value: 'single-page-spacing', title: 'Single Page Spacing' },
          { value: 'single-page-top-spacing', title: 'Single Page Top Spacing' },
          { value: 'single-page-bottom-spacing', title: 'Single Page Bottom Spacing' },
          { value: 'who-we-are-row', title: 'Who We Are Row' },
          { value: 'available-position-row', title: 'Available Position Row' },
          { value: 'career-banner-row', title: 'Career-Banner Row' },
          { value: 'featured-products-row', title: 'Featured Products and Applications' },
          { value: 'testimonial-section-single', title: 'Testimonial Section Single' },
          { value: 'our-mission-and-vision', title: 'Our Mission and Vision' },
          { value: 'about-company-row', title: 'About Company Row' },
          { value: 'about-testimonial-section', title: 'About Testimonial Section' },
          { value: 'service-overview-row', title: 'Service Overview Row' },
          { value: 'why-choose-us-row', title: 'Why Choose Us Row' },
          { value: 'deliverable-table-row', title: 'Deliverable Table Row' },
          { value: 'service-testimonial-section', title: 'Service Testimonial Section' },
          { value: 'case-studies-section', title: 'Case Studies Section' },
          { value: 'our-clients-section', title: 'Our Clients Section' },
          { value: 'banner-info-section', title: 'Banner Info Section' },
          { value: 'contact-us-banner', title: 'Contact Us Banner Section' },
          { value: 'category-faqs-section', title: 'Category FAQs Section' },
          { value: 'resource-hub-section', title: 'Resource Hub Section' },
          { value: 'faqs-page-section', title: 'Faqs Page Section' },
          { value: 'distributor-section', title: 'Distributor Section' },
          { value: 'datasheet-msds-section', title: 'Datasheets & MSDS Section'},
          { value: 'case-studies-section-space-top', title: 'Case Studies Section Space Top' },
          { value: 'category-algolia', title: 'Category Algolia' },

        ],
      },
      initialValue: '',
    },
    {
      title: 'id (optional)',
      name: 'id',
      type: 'string',
      description: 'Add ID for jump to section.',
    },
    {
      title: 'Number of Columns',
      name: 'columns',
      type: 'number',
      description: 'Select the number of columns in this row.',
      options: {
        list: [
          { title: '1 Column', value: 1 },
          { title: '2 Columns', value: 2 },
          { title: '3 Columns', value: 3 },
        ],
        layout: 'dropdown',
      },
      validation: (Rule: Rule) => Rule.required().min(1).max(3),
    },
    {
      title: 'Show Column 1',
      name: 'showColumn1',
      type: 'boolean',
      initialValue: true,
      description: 'Toggle visibility of Column 1',
    },
    {
      title: 'Show Column 2',
      name: 'showColumn2',
      type: 'boolean',
      initialValue: true,
      description: 'Toggle visibility of Column 2',
      hidden: ({ parent }: { parent: ParentType }) => (parent?.columns ?? 0) < 2, // Handle undefined columns
    },
    {
      title: 'Show Column 3',
      name: 'showColumn3',
      type: 'boolean',
      initialValue: true,
      description: 'Toggle visibility of Column 3',
      hidden: ({ parent }: { parent: ParentType }) => (parent?.columns ?? 0) < 3, // Handle undefined columns
    },
    {
      name: 'columnWidth',
      title: 'Column Width',
      type: 'string',
      options: {
        list: [
          { value: '1fr_11fr', title: '1fr - 11fr' },
          { value: '2fr_10fr', title: '2fr - 10fr' },
          { value: '3fr_9fr', title: '3fr - 9fr' },
          { value: '4fr_8fr', title: '4fr - 8fr' },
          { value: '5fr_7fr', title: '5fr - 7fr' },
          { value: '6fr_6fr', title: '6fr - 6fr' },
          { value: '7fr_5fr', title: '7fr - 5fr' },
          { value: '8fr_4fr', title: '8fr - 4fr' },
          { value: '9fr_3fr', title: '9fr - 3fr' },
          { value: '10fr_2fr', title: '10fr - 2fr' },
          { value: '11fr_1fr', title: '11fr - 1fr' },
        ],
      },
      initialValue: '',
      hidden: ({ parent }: { parent: ParentType }) => (parent?.columns ?? 0) < 2,
    },
    // Create columns dynamically based on the number of columns selected
    createColumnBlocks(1),
    createColumnBlocks(2),
    createColumnBlocks(3),
  ],
};

export default rowSchema;
