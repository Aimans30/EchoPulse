import { defineType, defineField } from 'sanity';

export const imageUrl = defineType({
  name: 'imageUrl',
  title: 'Image URL',
  type: 'object',
  fields: [
    defineField({
      name: 'url',
      title: 'Image URL',
      type: 'url',
      validation: (Rule) => Rule.required().uri({
        scheme: ['http', 'https']
      }),
    }),
    defineField({
      name: 'alt',
      title: 'Alt Text',
      type: 'string',
      description: 'Alternative text for accessibility',
    }),
    defineField({
      name: 'caption',
      title: 'Caption',
      type: 'string',
      description: 'Optional caption for the image',
    }),
  ],
  preview: {
    select: {
      url: 'url',
      alt: 'alt',
    },
    prepare({ url, alt }) {
      return {
        title: alt || 'Image from URL',
        subtitle: url,
        media: undefined,
      };
    },
  },
});
