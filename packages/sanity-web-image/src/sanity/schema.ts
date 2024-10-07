import { defineType } from 'sanity'

export const WebImageSchema = defineType({
  title: 'Web image',
  name: 'webImage',
  type: 'image',
  fields: [
    {
      title: 'Alternative Text',
      description: 'A textual description of the image for visually-impaired users',
      name: 'alt',
      type: 'string',
      validation: (Rule) => Rule.required(),
    },
  ],
  options: {
    hotspot: true,
  },
})
