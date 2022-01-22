#!/usr/bin/env node

import baseConfig from './config.mjs'
import {
  configureGit,
  configureNetlify,
  configureSanity,
  copyTemplates,
  createProjectDir,
  generateReadme,
  getProjectInfo,
  installDependencies,
  replacePlaceholders,
} from './install/index.mjs'

async function initialise() {
  const defaults = { name: process.argv[2] }
  const cwd = defaults.name || '.'

  await createProjectDir(cwd)

  const projectInfo = await getProjectInfo(defaults)
  const config = processConfig(baseConfig, projectInfo, cwd)

  console.log()
  console.log('Copying templates.')
  await copyTemplates(config)
  await replacePlaceholders(config)

  console.log()
  console.log('Installing dependencies.')
  await installDependencies(config)

  if (projectInfo.cms === 'sanity') {
    console.log()
    console.log('Initialising Sanity project.')
    await configureSanity(config)
  }

  if (projectInfo.initGit) {
    console.log()
    console.log('Initialising git repository.')
    await configureGit(cwd, projectInfo.pushToGitHub, config[0].packageName)
  }

  if (projectInfo.configNetlify) {
    console.log()
    console.log('Configuring Netlify.')
    await configureNetlify(config)
  }

  generateReadme(projectInfo, cwd)
}

function processConfig(baseConfig, projectInfo, cwd) {
  const { name, cms } = projectInfo
  const packageName = name
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/^[._]/, '')
    .replace(/[^a-z0-9~.-]+/g, '')

  const config = [
    {
      ...baseConfig['svelte-kit'],
      name,
      packageName,
      dest: cwd,
      template: 'svelte-kit',
    },
  ]

  if (cms === 'sanity') {
    config[0].dest = `${cwd}/web`

    config.push({
      ...baseConfig[cms],
      name,
      packageName: `${packageName}-cms`,
      dest: `${cwd}/cms`,
      template: cms,
    })

    // The front-end also needs the Sanity details if we're using a CMS.
    config[0].sanityProjectId = projectInfo.sanityProjectId
  }

  return config
}

initialise()
