import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'lead',
  title: 'Lead',
  type: 'document',
  description: 'Created automatically when someone submits the enquiry form.',
  fields: [
    defineField({
      name: 'status',
      type: 'string',
      options: {
        list: [
          {title: 'New', value: 'new'},
          {title: 'Contacted', value: 'contacted'},
          {title: 'Quoted', value: 'quoted'},
          {title: 'Won', value: 'won'},
          {title: 'Lost', value: 'lost'},
          {title: 'Spam', value: 'spam'},
        ],
        layout: 'radio',
        direction: 'horizontal',
      },
      initialValue: 'new',
    }),
    defineField({name: 'name', type: 'string', readOnly: true}),
    defineField({name: 'phone', type: 'string', readOnly: true}),
    defineField({name: 'place', title: 'Village / town', type: 'string', readOnly: true}),
    defineField({name: 'solarFor', title: 'Solar for', type: 'string', readOnly: true}),
    defineField({name: 'bill', title: 'Monthly bill', type: 'string', readOnly: true}),
    defineField({name: 'message', type: 'text', readOnly: true}),
    defineField({name: 'page', title: 'Submitted from page', type: 'string', readOnly: true}),
    defineField({name: 'submittedAt', type: 'datetime', readOnly: true}),
    defineField({name: 'notes', title: 'Your notes', type: 'text', rows: 4}),
  ],
  orderings: [{title: 'Newest', name: 'newest', by: [{field: 'submittedAt', direction: 'desc'}]}],
  preview: {
    select: {name: 'name', phone: 'phone', place: 'place', status: 'status'},
    prepare: ({name, phone, place, status}) => ({title: `${name || 'Unknown'} · ${phone || ''}`, subtitle: `${(status || 'new').toUpperCase()} · ${place || ''}`}),
  },
})
