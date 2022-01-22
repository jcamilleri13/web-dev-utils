export default [
  {
    type: 'checkbox',
    name: 'features',
    message: 'Enable features:',
    choices: ['blog', 'portfolio', 'store'],
  },
  {
    type: 'input',
    name: 'pages',
    message: 'Fixed pages (semicolon-separated):',
  },
  {
    type: 'input',
    name: 'collections',
    message:
      'Multi-item collections, e.g. "people" or "hobbies" (semicolon-separated):',
  },
  {
    type: 'input',
    name: 'forms',
    message: 'Forms e.g. "contact" (semicolon-separated):',
  },
]
