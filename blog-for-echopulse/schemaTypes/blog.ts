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
      name: 'category',
      title: 'Category',
      type: 'string',
      description: 'Short topic label shown as a pill (e.g. Finance, Marketing, Strategy).',
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
      name: 'postType',
      title: 'Post type',
      type: 'string',
      options: { list: [{ title: 'Asset (evergreen)', value: 'asset' }, { title: 'Trending (rewrite by updateBy)', value: 'trending' }] },
      initialValue: 'asset',
    }),

    defineField({
      name: 'updateBy',
      title: 'Update by',
      type: 'datetime',
      description: 'Trending posts only: the date by which the engine rewrites this into an evergreen asset.',
    }),

    defineField({
      name: 'icp',
      title: 'Audience (ICP key)',
      type: 'string',
      description: 'real-estate | founders | coaches | dtc | business-owners | saas | home-services',
    }),

    defineField({
      name: 'service',
      title: 'Service slug',
      type: 'string',
      description: 'video-editing | linkedin-ghostwriting | blog-production | ad-creatives | websites-funnels | automations | apps-software',
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
        { type: 'table' },               // pipe tables from the markdown publisher
      ],
    }),
  ],
});
