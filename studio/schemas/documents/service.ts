import {defineArrayMember, defineField, defineType} from 'sanity'

export default defineType({
  name: 'service',
  title: 'Service',
  type: 'document',
  fields: [
    defineField({name: 'title', type: 'string', validation: (r) => r.required()}),
    defineField({name: 'slug', title: 'Web address', type: 'slug', options: {source: 'title'}, validation: (r) => r.required()}),
    defineField({name: 'order', title: 'Display order', type: 'number', initialValue: 10}),
    defineField({name: 'summary', title: 'Short description (card)', type: 'text', rows: 3, validation: (r) => r.max(220)}),
    defineField({name: 'priceText', title: 'Price line', type: 'string', description: 'e.g. From ₹1,20,000 after subsidy'}),
    defineField({name: 'image', title: 'Photo', type: 'imageWithAlt'}),
    defineField({name: 'features', title: 'Key points', type: 'array', of: [defineArrayMember({type: 'string'})]}),
    defineField({name: 'body', title: 'Full page content', type: 'blockContent'}),
    defineField({name: 'seo', title: 'SEO', type: 'seo'}),
  ],
  orderings: [{title: 'Display order', name: 'order', by: [{field: 'order', direction: 'asc'}]}],
  preview: {select: {title: 'title', subtitle: 'priceText', media: 'image'}},
})
