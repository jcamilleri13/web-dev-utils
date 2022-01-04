import inquirer from 'inquirer'

export function getProjectInfo(defaults) {
  return inquirer.prompt([
    {
      type: 'input',
      name: 'name',
      message: 'Website/client name (use the correct case & punctuation):',
      default: defaults.name,
    },
    {
      type: 'list',
      name: 'cms',
      message: 'Content management system:',
      choices: ['sanity', 'none'],
      default: 'sanity',
    },
    {
      type: 'input',
      name: 'sanityProjectId',
      message: 'Sanity project ID:',
      when: ({ cms }) => cms === 'sanity',
    },
  ])
}
