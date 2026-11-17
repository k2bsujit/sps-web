import {defineArrayMember, defineField, defineType} from 'sanity'

const ICONS = [
  {title: 'Map pin', value: 'pin'},
  {title: 'Document check', value: 'doc'},
  {title: 'Wind', value: 'wind'},
  {title: 'Wrench', value: 'wrench'},
  {title: 'Shield', value: 'shield'},
  {title: 'Sun', value: 'sun'},
  {title: 'Rupee', value: 'rupee'},
  {title: 'Battery', value: 'battery'},
]

export default defineType({
  name: 'homePage',
  title: 'Home page',
  type: 'document',
  groups: [
    {name: 'hero', title: 'Top banner', default: true},
    {name: 'why', title: 'Why us'},
    {name: 'compare', title: 'Comparison'},
    {name: 'process', title: 'How it works'},
    {name: 'other', title: 'Other sections'},
    {name: 'seo', title: 'SEO'},
  ],
  fields: [
    defineField({name: 'heroBadge', title: 'Small badge text', type: 'string', group: 'hero'}),
    defineField({name: 'heroTitle', title: 'Main heading (before highlight)', type: 'string', group: 'hero'}),
    defineField({name: 'heroHighlight', title: 'Highlighted words (orange)', type: 'string', group: 'hero'}),
    defineField({name: 'heroTitleEnd', title: 'Main heading (after highlight)', type: 'string', group: 'hero'}),
    defineField({name: 'heroText', title: 'Paragraph', type: 'text', rows: 3, group: 'hero'}),
    defineField({name: 'heroImage', title: 'Background photo', type: 'imageWithAlt', group: 'hero'}),
    defineField({name: 'primaryCta', title: 'Main button text', type: 'string', group: 'hero'}),
    defineField({name: 'secondaryCta', title: 'Second button text', type: 'string', group: 'hero'}),
    defineField({
      name: 'stats',
      title: 'Number boxes',
      type: 'array',
      group: 'hero',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'stat',
          fields: [
            defineField({name: 'value', title: 'Number', type: 'string', description: 'e.g. ₹1,38,000 or 90+'}),
            defineField({name: 'label', title: 'Label', type: 'string'}),
            defineField({name: 'accent', title: 'Show in orange', type: 'boolean'}),
          ],
          preview: {select: {title: 'value', subtitle: 'label'}},
        }),
      ],
      validation: (r) => r.max(4),
    }),

    defineField({name: 'whyEyebrow', title: 'Small label', type: 'string', group: 'why'}),
    defineField({name: 'whyTitle', title: 'Heading', type: 'string', group: 'why'}),
    defineField({
      name: 'whyItems',
      title: 'Reasons',
      type: 'array',
      group: 'why',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'whyItem',
          fields: [
            defineField({name: 'icon', type: 'string', options: {list: ICONS}}),
            defineField({name: 'title', type: 'string'}),
            defineField({name: 'text', type: 'text', rows: 3}),
          ],
          preview: {select: {title: 'title', subtitle: 'text'}},
        }),
      ],
    }),

    defineField({name: 'compareTitle', title: 'Heading', type: 'string', group: 'compare'}),
    defineField({name: 'compareThem', title: '"Typical installer" points', type: 'array', of: [defineArrayMember({type: 'string'})], group: 'compare'}),
    defineField({name: 'compareUs', title: '"SP Surya" points', type: 'array', of: [defineArrayMember({type: 'string'})], group: 'compare'}),

    defineField({name: 'processTitle', title: 'Heading', type: 'string', group: 'process'}),
    defineField({
      name: 'processSteps',
      title: 'Steps',
      type: 'array',
      group: 'process',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'step',
          fields: [defineField({name: 'title', type: 'string'}), defineField({name: 'text', type: 'text', rows: 2})],
          preview: {select: {title: 'title', subtitle: 'text'}},
        }),
      ],
    }),

    defineField({name: 'servicesTitle', title: 'Services heading', type: 'string', group: 'other'}),
    defineField({name: 'galleryTitle', title: 'Gallery heading', type: 'string', group: 'other'}),
    defineField({
      name: 'fact',
      title: 'Fact box (in gallery)',
      type: 'object',
      group: 'other',
      fields: [
        defineField({name: 'value', type: 'string'}),
        defineField({name: 'text', type: 'string'}),
        defineField({name: 'source', type: 'string'}),
      ],
    }),
    defineField({name: 'enquiryTitle', title: 'Enquiry form heading', type: 'string', group: 'other'}),
    defineField({name: 'ctaTitle', title: 'Footer call-to-action heading', type: 'string', group: 'other'}),

    defineField({name: 'seo', title: 'SEO', type: 'seo', group: 'seo'}),
  ],
  preview: {prepare: () => ({title: 'Home page'})},
})
