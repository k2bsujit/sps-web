import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'testimonial',
  title: 'Customer review',
  type: 'document',
  description: 'Only add real reviews from real customers, with their permission.',
  fields: [
    defineField({name: 'name', title: 'Customer name', type: 'string', validation: (r) => r.required()}),
    defineField({name: 'place', title: 'Village / town', type: 'string'}),
    defineField({name: 'quote', title: 'What they said', type: 'text', rows: 4, validation: (r) => r.required()}),
    defineField({name: 'rating', type: 'number', options: {list: [5, 4, 3, 2, 1]}, initialValue: 5}),
    defineField({name: 'sizeKw', title: 'System size (kW)', type: 'number'}),
    defineField({name: 'photo', type: 'image'}),
    defineField({name: 'order', title: 'Display order', type: 'number', initialValue: 10}),
  ],
  preview: {select: {title: 'name', subtitle: 'quote', media: 'photo'}},
})
