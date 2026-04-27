import type { Rule } from '@sanity/types';
import { IoSettingsSharp } from 'react-icons/io5'; // Icon for the document

// Define the type for the siteSettings document
interface SiteSettingsDocument {
  announcementBannerActive?: boolean;
  [key: string]: any; // Allow additional fields
}

// Schema definition for 'siteSettings' document in Sanity.
export const siteSettingsSchema = {
  name: 'siteSettings',
  title: 'General Settings',
  type: 'document',
  icon: IoSettingsSharp, // Icon representing the site settings
  // Grouping of fields to enhance the content management interface.
  groups: [
    {
      name: 'siteInfo',
      title: 'Site Info',
    },
    {
      name: 'footerSettings',
      title: 'Footer Settings',
    },
    {
      name: 'contactInfo',
      title: 'Contact Information',
    },
    {
      name: 'socialMedia',
      title: 'Social Media Links',
    },
  ],
  fields: [
    {
      name: 'footerTagline',
      title: 'Footer Tagline',
      type: 'string',
      group: 'footerSettings',
      description: 'e.g. Full Stack Developer',
    },
    {
      name: 'noIndex',
      title: 'No-Index (Disable Search Engine Crawling)',
      type: 'boolean',
      description: 'Enable to apply noindex to all pages.',
      group: 'siteInfo',
    },
    {
      name: 'robotsTxt',
      title: 'Custom Robots.txt Content',
      type: 'text',
      description: 'Optional custom content for robots.txt.',
      group: 'siteInfo',
    },
    {
      name: 'sitemapXml',
      title: 'Custom sitemap XML Content',
      type: 'text',
      description: 'Optional custom content for sitemap.xml.',
      group: 'siteInfo',
    },
    {
      name: 'title',
      title: 'Site Title',
      type: 'string',
      group: 'siteInfo',
      description: 'The main title of the site, used in headers or page titles.',
      validation: (Rule: Rule) => Rule.required().error('The site title is required.'),
      //  Title of the site
    },
    {
      name: 'description',
      title: 'Site Description',
      type: 'text',
      group: 'siteInfo',
      description: 'A brief description of the site, used in meta tags for SEO purposes.',
      validation: (Rule: Rule) =>
        Rule.required().min(50).error('The site description must be at least 50 characters.'),
      //  Description of the site for SEO
    },

    {
      name: 'footerLogo',
      title: 'Footer Logo',
      type: 'image',
      group: 'footerSettings',
      description: 'The logo image to be displayed in the footer.',
      options: {
        hotspot: true, // Enable hotspot for better image cropping
      },
      //  Logo displayed in the footer
    },
    {
      name: 'copyright',
      title: 'Copyright',
      type: 'text',
      group: 'footerSettings',
      description: 'Copyright information to be displayed in the footer.',
      validation: (Rule: Rule) => Rule.required().error('Copyright information is required.'),
      //  Copyright information
    },
    {
      name: 'footerButton',
      title: 'Footer Button',
      type: 'object',
      group: 'footerSettings',
      fields: [
        {
          name: 'footerButtonText',
          title: 'Footer Button Text',
          type: 'string',
          description: 'Text displayed on the footer button.',
          validation: (Rule: Rule) => Rule.required().error('Footer button text is required.'),
          //  Text label for the footer button
        },
        {
          name: 'footerButtonLink',
          title: 'Footer Button Link',
          type: 'url',
          description: 'URL the footer button will link to.',
          validation: (Rule: Rule) =>
            Rule.required()
              .uri({ scheme: ['http', 'https'] })
              .error('A valid URL for the footer button link is required.'),
          //  URL for the footer button link
        },
      ],
      //  Button in the footer with text and link
    },
    {
      name: 'footerSubscribeForm',
      title: 'Footer Subscribe Form',
      type: 'string',
      description: 'Jotform ID.',
      group: 'footerSettings',
    },
    {
      name: 'address',
      title: 'Address',
      type: 'text',
      group: 'contactInfo',
      description: 'The physical address of the organization or site.',
      validation: (Rule: Rule) => Rule.required().error('The address is required.'),
      //  Physical address of the organization or site
    },
    {
      name: 'phone',
      title: 'Phone Number',
      type: 'string',
      group: 'contactInfo',
      description: 'The contact phone number.',
      validation: (Rule: Rule) =>
        Rule.required().min(10).error('A valid phone number is required.'),
      //  Contact phone number
    },
    {
      name: 'email',
      title: 'Email Address',
      type: 'email',
      group: 'contactInfo',
      description: 'The contact email address.',
      validation: (Rule: Rule) =>
        Rule.required().email().error('A valid email address is required.'),
      //  Contact email address
    },
    {
      name: 'linkedInLink',
      title: 'LinkedIn Link',
      type: 'url',
      group: 'socialMedia',
      description: 'LinkedIn profile URL (e.g., https://linkedin.com/company/yourcompany).',
      validation: (Rule: Rule) =>
        Rule.uri({ scheme: ['http', 'https'] }).error(
          'Please enter a valid LinkedIn URL starting with http:// or https://'
        ),
      //  LinkedIn profile link
    },
    {
      name: 'twitterLink',
      title: 'Twitter Link',
      type: 'url',
      group: 'socialMedia',
      description: 'Twitter profile URL (e.g., https://twitter.com/yourhandle).',
      validation: (Rule: Rule) =>
        Rule.uri({ scheme: ['http', 'https'] }).error(
          'Please enter a valid Twitter URL starting with http:// or https://'
        ),
      //  Twitter profile link
    },
    {
      name: 'facebookLink',
      title: 'Facebook Link',
      type: 'url',
      group: 'socialMedia',
      description: 'Facebook page URL (e.g., https://facebook.com/yourpage).',
      validation: (Rule: Rule) =>
        Rule.uri({ scheme: ['http', 'https'] }).error(
          'Please enter a valid Facebook URL starting with http:// or https://'
        ),
      //  Facebook profile link
    },
    {
      name: 'instagramLink',
      title: 'Instagram Link',
      type: 'url',
      group: 'socialMedia',
      description: 'Instagram profile URL (e.g., https://instagram.com/youraccount).',
      validation: (Rule: Rule) =>
        Rule.uri({ scheme: ['http', 'https'] }).error(
          'Please enter a valid Instagram URL starting with http:// or https://'
        ),
      //  Instagram profile link
    },

    {
      name: 'githubLink',
      title: 'GitHub Link',
      type: 'url',
      group: 'socialMedia',
      description: 'GitHub profile URL (e.g., https://github.com/yourusername).',
      validation: (Rule: Rule) =>
        Rule.uri({ scheme: ['http', 'https'] }).error(
          'Please enter a valid GitHub URL starting with http:// or https://'
        ),
    },
    {
      name: 'youtubeLink',
      title: 'YouTube Link',
      type: 'url',
      group: 'socialMedia',
      description: 'YouTube channel URL (e.g., https://youtube.com/@yourchannel).',
      validation: (Rule: Rule) =>
        Rule.uri({ scheme: ['http', 'https'] }).error(
          'Please enter a valid YouTube URL starting with http:// or https://'
        ),
    },
    {
      name: 'privacyLinks',
      title: 'Privacy links',
      type: 'object',
      group: 'siteInfo',
      description: 'The Instagram profile link associated with the site.',
      fields: [
        {
          name: 'privacyLink',
          type: 'array',
          title: 'Privacy Link',
          of: [
            {
              type: 'object',
              fields: [
                {
                  name: 'linkTitle',
                  title: 'Link Title',
                  type: 'string',
                },
                {
                  name: 'link',
                  title: 'Link',
                  type: 'string',
                },
              ],
            },
          ],
        },
      ],
    },
    {
      name: 'announcementBannerActive',
      type: 'boolean',
      title: 'Turn on Announcement Banner?',
      initialValue: false,
      group: 'siteInfo',
    },
    {
      name: 'announcementBannerText',
      type: 'text',
      title: 'Announcement Banner Text',
      group: 'siteInfo',
      hidden: ({ document }: { document: SiteSettingsDocument }) =>
        !document?.announcementBannerActive,
    },
    {
      name: 'announcementBannerLink',
      type: 'text',
      title: 'Announcement Banner Link',
      description: 'Enter each link on a new line.',
      group: 'siteInfo',
      hidden: ({ document }: { document: SiteSettingsDocument }) =>
        !document?.announcementBannerActive,
    },
  ],
};

export default siteSettingsSchema;
