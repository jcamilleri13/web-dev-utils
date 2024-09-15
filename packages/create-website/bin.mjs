#!/usr/bin/env node

import baseConfig from './config.mjs'
import {
  configureCloudflare,
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
  await copyTemplates(config, cwd)
  await replacePlaceholders(config)

  if (projectInfo.cms !== 'none') {
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

    FRONT_END_URL: projectInfo?.sveltekitUrl,
    LOG_LEVEL: 'debug',
    ORGANISATION_NAME: projectInfo?.name,
    CONTACT_FORM_EMAIL_ADDRESS: projectInfo?.email,
    PUBLIC_SANITY_API_VERSION: sanityConfig?.sanityApiVersion,
    PUBLIC_SANITY_DATASET: 'production',
    PUBLIC_SANITY_PROJECT_ID: sanityConfig?.sanityProjectId,
    PUBLIC_SANITY_STUDIO_URL: projectInfo?.sanityUrl,
    SANITY_API_KEY: sanityConfig?.sanityApiKey,
    SANITY_PREVIEW_URL: projectInfo?.sveltekitUrl?.replace('https://', 'https://edit.'),
  }

  const envFilePaths =
    projectInfo.cms === 'none' ?
      [`${cwd}/.env`]
    : [`${cwd}/sites/web/.env`, `${cwd}/sites/cms/.env`]
  for (const path of envFilePaths) {
    await populateEnvFile(path, environmentVariables)
  }

  if (projectInfo.platform === 'netlify') {
    console.log()
    console.log('Configuring Netlify.')
    await configureNetlify(config)
  }

  if (projectInfo.platform === 'cloudflare') {
    console.log()
    console.log('Configuring Cloudflare.')
    await configureCloudflare(config)
  }

  generateReadme(projectInfo, cwd)
}

function processConfig(baseConfig, projectInfo, cwd) {
  const { name, cms, platform } = projectInfo
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

  // Add corresponding SvelteKit adapter
  const adapter =
    platform === 'netlify' ? '@sveltejs/adapter-netlify'
    : platform === 'cloudflare' ? '@sveltejs/adapter-cloudflare'
    : '@sveltejs/adapter-auto'

  config[0].devDependencies.push(adapter)
  config[0].adapter = adapter

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
