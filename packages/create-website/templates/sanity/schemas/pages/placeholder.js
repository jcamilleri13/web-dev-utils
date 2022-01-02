export default {
  name: 'pagePlaceholder',
  type: 'document',
  title: 'Placeholder',
  // Uncomment this after the first data has been input
  // to disallow creation of additional page documents.
  // __experimental_actions: ['update', 'publish'],
  fields: [{
    name: 'content',
    type: 'array',
    of: [{ type: 'block' }],
    title: 'Content',
    description: 'Main text to be displayed on the "Placeholder" page',
  }]
}
