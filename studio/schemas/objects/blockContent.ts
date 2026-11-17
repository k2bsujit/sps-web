import {defineArrayMember, defineType} from 'sanity'

export default defineType({
  name: 'blockContent',
  title: 'Rich text',
  type: 'array',
  of: [
    defineArrayMember({
      type: 'block',
      styles: [
        {title: 'Normal', value: 'normal'},
        {title: 'Heading', value: 'h2'},
        {title: 'Sub-heading', value: 'h3'},
        {title: 'Quote', value: 'blockquote'},
      ],
      marks: {
        decorators: [
          {title: 'Bold', value: 'strong'},
          {title: 'Italic', value: 'em'},
        ],
        annotations: [
          {
            name: 'link',
            type: 'object',
            title: 'Link',
            fields: [{name: 'href', type: 'url', title: 'URL', validation: (r) => r.uri({allowRelative: true, scheme: ['http', 'https', 'tel', 'mailto']})}],
          },
        ],
      },
    }),
    defineArrayMember({type: 'imageWithAlt'}),
  ],
})
