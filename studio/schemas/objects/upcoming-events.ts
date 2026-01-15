import { defineField, defineType } from 'sanity';
import { MdEvent } from 'react-icons/md'; // Example: Material Design event icon

// Define the Upcoming Event schema
export default defineType({
  name: 'upcomingEvent',
  title: 'Upcoming Event',
  type: 'object',
  icon: MdEvent, // React icon added here
  fields: [
    defineField({
      name: 'eventTitle',
      title: 'Event Title',
      type: 'string',
      description: 'The title of the upcoming event module.',
      validation: (Rule) => Rule.required().error('A module title is required.'),
    }),
    defineField({
      name: 'event',
      title: 'Select Event',
      type: 'reference',
      to: [{ type: 'events' }], // Reference to the `events` document
      validation: (Rule) => Rule.required().error('You must select an event.'),
      description: 'Select a single event to display as the upcoming event.',
    }),
  ],
});
