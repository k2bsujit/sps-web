import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'area',
  title: 'Area / location',
  type: 'document',
  description: 'Each area gets its own page, e.g. /solar-installation/soro. Write real local details — Google ignores copy-paste pages.',
  fields: [
    defineField({name: 'name', title: 'Town / area name', type: 'string', validation: (r) => r.required()}),
    defineField({name: 'slug', title: 'Web address', type: 'slug', options: {source: 'name'}, validation: (r) => r.required()}),
    defineField({name: 'district', type: 'string'}),
    defineField({name: 'order', title: 'Display order', type: 'number', initialValue: 10}),
    defineField({
      name: 'publishPage',
      title: 'Publish a page for this area',
      type: 'boolean',
      initialValue: false,
      description: 'Turn on once the page has at least 2–3 paragraphs of real local content or a project.',
    }),
    defineField({name: 'intro', title: 'Intro paragraph', type: 'text', rows: 3}),
    defineField({name: 'body', title: 'Page content', type: 'blockContent'}),
    defineField({name: 'seo', title: 'SEO', type: 'seo'}),
  ],
  orderings: [{title: 'Display order', name: 'order', by: [{field: 'order', direction: 'asc'}]}],
  preview: {
    select: {title: 'name', d: 'district', p: 'publishPage'},
    prepare: ({title, d, p}) => ({title, subtitle: `${d || ''}${p ? ' · page live' : ' · no page yet'}`}),
  },
})
