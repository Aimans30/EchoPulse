import { defineType, defineField } from 'sanity';

export const blog = defineType({
  name: 'blog',
  title: 'Blog',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'title', maxLength: 96 },
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: 'publishedAt',
      title: 'Published at',
      type: 'datetime',
    }),

    defineField({
      name: 'excerpt',
      title: 'Excerpt',
      type: 'text',
      rows: 3,
    }),

    defineField({
      name: 'author',
      title: 'Author',
      type: 'string',
      description: 'Name of the author',
    }),

    defineField({
      name: 'readTime',
      title: 'Read Time (minutes)',
      type: 'number',
      description: 'Estimated reading time in minutes',
    }),

    defineField({
      name: 'mainImage',
      title: 'Main Image',
      type: 'image',
      options: { hotspot: true },
    }),

    defineField({
      name: 'mainImageUrl',
      title: 'Main Image URL',
      type: 'url',
      description: 'Optional. Paste an image link instead of uploading a Main Image.',
    }),

    defineField({
      name: 'content',
      title: 'Content',
      type: 'array',
      of: [
        { type: 'block' },               // text + headings (for TOC)
        { type: 'image', options: { hotspot: true } }, // inline images
        { type: 'imageUrl' },            // image from URL
        { type: 'video' },               // ✅ embedded video block
      ],
    }),
  ],
});
