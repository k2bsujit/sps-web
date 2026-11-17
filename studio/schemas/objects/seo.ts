import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'seo',
  title: 'SEO (Google & sharing)',
  type: 'object',
  options: {collapsible: true, collapsed: true},
  fields: [
    defineField({
      name: 'title',
      title: 'Page title in Google',
      type: 'string',
      description: 'Aim for 50–60 characters. Put the main search phrase first, e.g. "Rooftop Solar in Balasore | SP Surya".',
      validation: (r) => r.max(70).warning('Google usually cuts titles longer than ~60 characters'),
    }),
    defineField({
      name: 'description',
      title: 'Description in Google',
      type: 'text',
      rows: 3,
      description: '120–160 characters. Say what the page offers and end with a call to action.',
      validation: (r) => r.max(170).warning('Google usually cuts descriptions longer than ~160 characters'),
    }),
    defineField({
      name: 'ogImage',
      title: 'Share image (WhatsApp, Facebook)',
      type: 'image',
      description: '1200 × 630 px works best.',
    }),
    defineField({
      name: 'noindex',
      title: 'Hide this page from Google',
      type: 'boolean',
      initialValue: false,
    }),
  ],
})
