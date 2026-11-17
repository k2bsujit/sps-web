import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'post',
  title: 'Blog post',
  type: 'document',
  fields: [
    defineField({name: 'title', type: 'string', validation: (r) => r.required()}),
    defineField({name: 'slug', title: 'Web address', type: 'slug', options: {source: 'title'}, validation: (r) => r.required()}),
    defineField({name: 'publishedAt', title: 'Published on', type: 'datetime', initialValue: () => new Date().toISOString()}),
    defineField({name: 'excerpt', title: 'Short summary', type: 'text', rows: 3, validation: (r) => r.max(220)}),
    defineField({name: 'cover', title: 'Cover photo', type: 'imageWithAlt'}),
    defineField({name: 'body', title: 'Article', type: 'blockContent'}),
    defineField({name: 'seo', title: 'SEO', type: 'seo'}),
  ],
  orderings: [{title: 'Newest', name: 'newest', by: [{field: 'publishedAt', direction: 'desc'}]}],
  preview: {select: {title: 'title', subtitle: 'publishedAt', media: 'cover'}},
})
