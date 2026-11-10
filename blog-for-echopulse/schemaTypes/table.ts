import { defineType, defineField, defineArrayMember } from 'sanity';

/**
 * Simple table block for blog content. Written by scripts/publish-blog.mjs
 * from markdown pipe tables and rendered by components/BlogContent.tsx.
 *
 * Shape:
 *   { _type: 'table', hasHeader: true, rows: [{ _type: 'tableRow', cells: ['a', 'b'] }] }
 */
export const tableRow = defineType({
  name: 'tableRow',
  title: 'Table row',
  type: 'object',
  fields: [
    defineField({
      name: 'cells',
      title: 'Cells',
      type: 'array',
      of: [defineArrayMember({ type: 'string' })],
    }),
  ],
  preview: {
    select: { cells: 'cells' },
    prepare({ cells }: { cells?: string[] }) {
      return { title: (cells ?? []).join(' | ') || '(empty row)' };
    },
  },
});

export const table = defineType({
  name: 'table',
  title: 'Table',
  type: 'object',
  fields: [
    defineField({
      name: 'hasHeader',
      title: 'First row is a header',
      type: 'boolean',
      initialValue: true,
    }),
    defineField({
      name: 'rows',
      title: 'Rows',
      type: 'array',
      of: [defineArrayMember({ type: 'tableRow' })],
      validation: (Rule) => Rule.required().min(1),
    }),
  ],
  preview: {
    select: { rows: 'rows' },
    prepare({ rows }: { rows?: Array<{ cells?: string[] }> }) {
      const first = rows?.[0]?.cells?.join(' | ') ?? '';
      return {
        title: `Table (${rows?.length ?? 0} rows)`,
        subtitle: first,
      };
    },
  },
});
