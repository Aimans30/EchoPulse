import { defineType, defineField } from 'sanity';

export const video = defineType({
  name: 'video',
  title: 'Video',
  type: 'object',
  fields: [
    defineField({
      name: 'url',
      title: 'Video URL',
      type: 'url',
      validation: (Rule) =>
        Rule.required().uri({
          scheme: ['http', 'https'],
        }),
    }),

    defineField({
      name: 'caption',
      title: 'Caption',
      type: 'string',
    }),
  ],
});
