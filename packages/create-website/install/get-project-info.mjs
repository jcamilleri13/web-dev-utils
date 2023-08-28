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
      default: defaults.name,
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
