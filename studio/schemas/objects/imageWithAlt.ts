import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'imageWithAlt',
  title: 'Image',
  type: 'image',
  options: {hotspot: true},
  fields: [
    defineField({
      name: 'alt',
      title: 'Describe the photo',
      type: 'string',
      description: 'For Google and blind visitors, e.g. "3 kW rooftop solar on a house in Soro".',
      validation: (r) => r.required().warning('Add a short description — it helps SEO'),
    }),
    defineField({name: 'caption', title: 'Caption (optional)', type: 'string'}),
  ],
})
