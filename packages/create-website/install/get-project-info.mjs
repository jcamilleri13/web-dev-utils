import sanityPrompts from '@james-camilleri/sanity-schema-setup/prompts.mjs'
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
      type: 'input',
      name: 'url',
      message: 'Website URL (front-end):',
    },
    {
      type: 'input',
      name: 'EMAIL',
      message: 'Contact email address:',
      default: (answers) => (answers.url ? `info@${url}` : undefined),
    },
    {
      type: 'list',
      name: 'cms',
      message: 'Content management system:',
      choices: ['sanity', 'none'],
      default: 'sanity',
    },
    ...sanityPrompts.map((prompt) => ({
      ...prompt,
      when: ({ cms }) => cms === 'sanity',
    })),
    {
      type: 'input',
      name: 'MAILJET_API_KEY',
      message: 'Mailjet API key:',
    },
    {
      type: 'input',
      name: 'MAILJET_SECRET_KEY',
      message: 'Mailjet secret key:',
    },
    {
      type: 'input',
      name: 'CLOUDINARY_URL',
      message: 'Cloudinary URL:',
    },
    {
      type: 'confirm',
      name: 'initGit',
      message: 'Initialise git repository:',
    },
    {
      type: 'confirm',
      name: 'pushToGitHub',
      message: 'Push project to GitHub:',
      when: ({ initGit }) => initGit,
    },
    {
      type: 'confirm',
      name: 'configNetlify',
      message: 'Configure Netlify:',
      when: ({ pushToGitHub }) => pushToGitHub,
    },
  ])
}
