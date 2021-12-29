export const WebImageSchema = {
  title: 'Web image',
  name: 'webImage',
  type: 'image',
  fields: [
    {
      title: 'Alternative Text',
      description: 'A textual description of the image for visually-impaired users',
      name: 'alt',
      type: 'string',
      options: {
        isHighlighted: true,
      },
    },
  ],
}
