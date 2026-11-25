import { defineType, defineField } from 'sanity';

export const blog = defineType({
  name: 'blog',
  title: 'Blog',
  type: 'document',
  fieldsets: [{ name: 'engine', title: 'Engine fields', options: { collapsible: true, collapsed: true } }],
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
      name: 'targetQuery',
      title: 'Target query',
      type: 'string',
      description: 'The one search query this post answers.',
      fieldset: 'engine',
    }),

    defineField({
      name: 'moneyPage',
      title: 'Money page',
      type: 'string',
      description: 'The site page this post links to for the sale, e.g. /founders/video-editing.',
      fieldset: 'engine',
    }),

    defineField({
      name: 'whatsNew',
      title: 'What is new',
      type: 'string',
      description: 'One sentence naming the original data in the post, with its count and date.',
      fieldset: 'engine',
    }),

    defineField({
      name: 'lastChecked',
      title: 'Last checked',
      type: 'string',
      description: 'Date (YYYY-MM-DD) the facts were last checked. Set by the publisher.',
      fieldset: 'engine',
    }),

    defineField({
      name: 'coverText',
      title: 'Cover text',
      type: 'string',
      description: 'Text printed on the cover image. Set by the publisher.',
      fieldset: 'engine',
    }),

    defineField({
      name: 'chartColumn',
      title: 'Chart column',
      type: 'string',
      description: 'The table column the publisher draws as a bar chart, with its unit and date.',
      fieldset: 'engine',
    }),

    defineField({
      name: 'chartLabel',
      title: 'Chart label column',
      type: 'string',
      description: 'The table column used for the bar labels.',
      fieldset: 'engine',
    }),

    defineField({
      name: 'chartSource',
      title: 'Chart source',
      type: 'string',
      description: 'Source line printed under the chart (max 80 characters).',
      validation: (Rule) => Rule.max(80),
      fieldset: 'engine',
    }),

    defineField({
      name: 'featured',
      title: 'Featured',
      type: 'boolean',
      description: 'Legacy flag from older posts. Not used by the site.',
      hidden: ({ value }) => value === undefined,
    }),

    defineField({
      name: 'imageAlt',
      title: 'Cover image alt text',
      type: 'string',
      description: 'Describes the cover image for screen readers.',
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
