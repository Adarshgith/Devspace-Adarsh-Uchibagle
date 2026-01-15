import { FaMapMarkerAlt } from 'react-icons/fa';
import { defineType, defineField } from 'sanity';

export default defineType({
  name: 'googleMap',
  title: 'Google Map',
  type: 'object',
  icon: FaMapMarkerAlt,
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      description: 'Title for the map section',
    }),
    defineField({
      name: 'jsonInput',
      title: 'JSON Input',
      type: 'text',
    }),
    defineField({
      name: 'locationDetails',
      title: 'Location Details',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            defineField({
              name: 'locationName',
              title: 'Location Name',
              type: 'string',
            }),
            defineField({
              name: 'longitude',
              title: 'Longitude',
              type: 'number',
              description: 'Longitude coordinate of the location',
            }),
            defineField({
              name: 'latitude',
              title: 'Latitude',
              type: 'number',
              description: 'Latitude coordinate of the location',
            }),
          ]
        }
      ]
    }),
  ],
});
