import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'faq',
  title: 'FAQ',
  type: 'document',
  fields: [
    defineField({name: 'question', type: 'string', validation: (r) => r.required()}),
    defineField({name: 'answer', type: 'text', rows: 4, validation: (r) => r.required()}),
    defineField({name: 'order', title: 'Display order', type: 'number', initialValue: 10}),
    defineField({name: 'showOnHome', title: 'Show on home page', type: 'boolean', initialValue: true}),
  ],
  orderings: [{title: 'Display order', name: 'order', by: [{field: 'order', direction: 'asc'}]}],
  preview: {select: {title: 'question', subtitle: 'answer'}},
})
