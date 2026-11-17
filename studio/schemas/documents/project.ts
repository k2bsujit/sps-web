import {defineArrayMember, defineField, defineType} from 'sanity'

export default defineType({
  name: 'project',
  title: 'Project',
  type: 'document',
  fields: [
    defineField({name: 'title', type: 'string', description: 'e.g. 3 kW home system, Soro', validation: (r) => r.required()}),
    defineField({name: 'slug', title: 'Web address', type: 'slug', options: {source: 'title'}, validation: (r) => r.required()}),
    defineField({name: 'area', title: 'Area', type: 'reference', to: [{type: 'area'}]}),
    defineField({name: 'village', title: 'Village / locality', type: 'string'}),
    defineField({name: 'sizeKw', title: 'System size (kW)', type: 'number'}),
    defineField({
      name: 'category',
      type: 'string',
      options: {list: ['Home on-grid', 'Hybrid / battery', 'Commercial', 'Institutional', 'Service / AMC']},
    }),
    defineField({name: 'completedOn', title: 'Completed on', type: 'date'}),
    defineField({name: 'featured', title: 'Show on home page gallery', type: 'boolean', initialValue: false}),
    defineField({name: 'mainImage', title: 'Main photo', type: 'imageWithAlt', validation: (r) => r.required()}),
    defineField({name: 'photos', title: 'More photos', type: 'array', of: [defineArrayMember({type: 'imageWithAlt'})]}),
    defineField({name: 'summary', title: 'Short summary', type: 'text', rows: 3}),
    defineField({name: 'body', title: 'Full story', type: 'blockContent'}),
    defineField({name: 'seo', title: 'SEO', type: 'seo'}),
  ],
  orderings: [{title: 'Newest', name: 'newest', by: [{field: 'completedOn', direction: 'desc'}]}],
  preview: {select: {title: 'title', subtitle: 'village', media: 'mainImage'}},
})
