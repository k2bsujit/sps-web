import {defineArrayMember, defineField, defineType} from 'sanity'

export default defineType({
  name: 'subsidy',
  title: 'Subsidy rates & guide',
  type: 'document',
  fields: [
    defineField({
      name: 'rows',
      title: 'Subsidy by system size',
      type: 'array',
      description: 'Used by the calculator on every page. Update here when government rates change.',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'subsidyRow',
          fields: [
            defineField({name: 'label', title: 'Button label', type: 'string', description: 'e.g. 3 kW & above'}),
            defineField({name: 'central', title: 'Central subsidy (₹)', type: 'number', validation: (r) => r.min(0)}),
            defineField({name: 'state', title: 'Odisha state subsidy (₹)', type: 'number', validation: (r) => r.min(0)}),
            defineField({name: 'units', title: 'Units per month (text)', type: 'string', description: 'e.g. ≈ 300–360'}),
            defineField({name: 'isDefault', title: 'Selected by default', type: 'boolean'}),
          ],
          preview: {
            select: {title: 'label', c: 'central', s: 'state'},
            prepare: ({title, c, s}) => ({title, subtitle: `₹${(c || 0) + (s || 0)} total`}),
          },
        }),
      ],
    }),
    defineField({name: 'lastChecked', title: 'Rates last checked on', type: 'date'}),
    defineField({name: 'pageTitle', title: 'Subsidy page heading', type: 'string'}),
    defineField({name: 'pageIntro', title: 'Subsidy page intro', type: 'text', rows: 3}),
    defineField({name: 'body', title: 'Subsidy guide (full article)', type: 'blockContent'}),
    defineField({name: 'seo', title: 'SEO', type: 'seo'}),
  ],
  preview: {prepare: () => ({title: 'Subsidy rates & guide'})},
})
