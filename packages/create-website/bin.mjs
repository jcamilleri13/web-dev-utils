#!/usr/bin/env node

import baseConfig from './config.mjs'
import {
  configureGit,
  configureNetlify,
  configureSanity,
  configureWorkspace,
  copyTemplates,
  createProjectDir,
  generateReadme,
  getProjectInfo,
  installDependencies,
  populateEnvFile,
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

  if (projectInfo.cms) {
    console.log()
    console.log('Setting up monorepo.')
    await configureWorkspace(cwd)
  }

  console.log()
  console.log('Installing dependencies.')
  await installDependencies(config)

  let sanityConfig
  if (projectInfo.cms === 'sanity') {
    console.log()
    console.log('Initialising Sanity project.')
    sanityConfig = await configureSanity(config, projectInfo)
  }

  if (projectInfo.initGit) {
    console.log()
    console.log('Initialising git repository.')
    await configureGit(cwd, projectInfo.pushToGitHub, config[0].packageName)
  }

  console.log()
  console.log('Writing environment variables to .env file.')
  const environmentVariables = {
    ...Object.entries(projectInfo)
      .filter(([key]) => key[0] === key[0].toUpperCase())
      .reduce((envVariables, [key, value]) => ({ ...envVariables, [key]: value }), []),

    ORGANISATION_NAME: projectInfo.name,
    FRONT_END_URL: projectInfo.sveltekitUrl,
    SANITY_STUDIO_API_KEY: sanityConfig.sanityApiKey,
    SANITY_STUDIO_API_VERSION: sanityConfig.sanityApiVersion,
    SANITY_STUDIO_PROJECT_ID: sanityConfig.sanityProjectId,
    SANITY_STUDIO_DATASET: 'production',
    LOG_LEVEL: 'debug',
  }

  await populateEnvFile(`${cwd}/sites/web/.env`, environmentVariables)
  if (projectInfo.cms === 'sanity') {
    await populateEnvFile(`${cwd}/sites/cms/.env`, environmentVariables)
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
    config[0].dest = `${cwd}/sites/web`

    // Add sanity-specific dependencies for SvelteKit
    config[0].devDependencies.push('@sanity/image-url')
    config[0].dependencies.push('@sanity/svelte-loader', '@sanity/client', '@sanity/visual-editing')

    config.push({
      ...baseConfig[cms],
      name,
      packageName: `${packageName}-cms`,
      dest: `${cwd}/sites/cms`,
      template: cms,
    })

    // The front-end also needs the Sanity details if we're using a CMS.
    config[0].sanityProjectId = projectInfo.sanityProjectId

    // Add _shared package
    config.unshift({
      dest: `${cwd}/sites/_shared`,
      template: '_shared',
    })
  }

  return config
}

initialise()
