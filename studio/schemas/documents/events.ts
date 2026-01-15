import { BiBookContent, BiCalendarEvent } from 'react-icons/bi';
import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'events',
  title: 'Events',
  type: 'document',
  icon: BiCalendarEvent,
  // Define the fields associated with the 'post' document.
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      icon: BiBookContent,
      description: 'SEO-critical: Keep between 30-60 characters for optimal search results.',
      // Validation to ensure the title is not empty.
      validation: (Rule) => Rule.required().min(10).max(60).error('Event title must be 10-60 characters for SEO optimization.'),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title', // Automatically generates the slug from the post title.
        maxLength: 200, // Sets a maximum length to the slug for URL optimization.
      },
      // Validation to ensure a slug is created.
      validation: (Rule) => Rule.required().error('A slug is required for the event.'),
    }),
    defineField({
      name: 'excerpt',
      title: 'Excerpt',
      type: 'text',
      description: 'SEO meta description: Keep between 120-160 characters for optimal search results.',
      validation: (Rule) => Rule.min(120).max(160).error('Meta description should be 120-160 characters for SEO.'),
    }),
    defineField({
      name: 'mainImage',
      title: 'Main image',
      type: 'image',
      options: {
        hotspot: true,
      },
      description: 'Featured image for the event.',
    }),
    defineField({
      name: 'startDate',
      title: 'Event Start Date',
      type: 'date',
      description: 'The date when the event is scheduled to happen.',
      options: {
        dateFormat: 'DD MMMM YYYY',
      },
      validation: (Rule) => Rule.required().error('The date of the event is required.'),
    }),
    defineField({
      name: 'endDate',
      title: 'Event End Date',
      type: 'date',
      description: 'The date when the event ends (optional for single-day events).',
      options: {
        dateFormat: 'DD MMMM YYYY',
      },
      validation: (Rule) => Rule.custom((endDate, context) => {
        const startDate = context.document?.startDate;
        if (endDate && startDate && typeof endDate === 'string' && typeof startDate === 'string') {
          if (new Date(endDate) < new Date(startDate)) {
            return 'End date must be after the start date.';
          }
        }
        return true;
      }),
    }),
    defineField({
      name: 'mainContent',
      title: 'Main Content',
      type: 'pageSection',
      description: 'Detailed content and information for the event.',
    }),
    defineField({
      name: 'isSticky',
      title: 'Sticky section',
      type: 'boolean',
      description: 'Pin this event to the top of the events list.',
      initialValue: false,
    }),
    defineField({
      name: 'featuredEvent',
      title: 'Featured Event',
      type: 'boolean',
      description: 'Mark this event as featured content.',
      initialValue: false,
    }),
    defineField({
      name: 'eventDate',
      title: 'Event Date',
      type: 'date',
      description: 'The specific date of the event (legacy field).',
    }),
    defineField({
      name: 'eventTime',
      title: 'Event Time',
      type: 'string',
      description: 'The time when the event starts (e.g., "14:00").',
    }),
    defineField({
      name: 'isVirtual',
      title: 'Is Virtual Event',
      type: 'boolean',
      description: 'Whether this is a virtual/online event.',
      initialValue: false,
    }),
    defineField({
      name: 'location',
      title: 'Location',
      type: 'string',
      description: 'The location where the event takes place (or "Online" for virtual events).',
    }),
    defineField({
      name: 'registrationLink',
      title: 'Registration Link',
      type: 'url',
      description: 'Valid URL for event registration (e.g., https://example.com/register).',
      validation: (Rule) => Rule.uri({
        scheme: ['http', 'https'],
        allowRelative: false
      }).error('Please enter a valid URL starting with http:// or https://'),
    }),
  ],


});
