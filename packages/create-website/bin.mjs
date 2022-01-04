#!/usr/bin/env node

import baseConfig from './config.mjs'
import {
  configureGit,
  copyTemplates,
  createProjectDir,
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

  console.log('Installing dependencies.')
  await installDependencies(config)
  // await updatePackageJson()
  // await configureGit(config)
  // await configureNetlify() ?
}

function processConfig(baseConfig, projectInfo, cwd) {
  const { name, cms } = projectInfo

  const config = [
    {
      ...baseConfig['svelte-kit'],
      name,
      dest: cwd,
      template: 'svelte-kit',
    },
  ]

  if (cms === 'sanity') {
    config[0].dest = `${cwd}/web`

    config.push({
      ...baseConfig[cms],
      name: `${name}-cms`,
      dest: `${cwd}/cms`,
      template: cms,
      sanityProjectId: projectInfo.sanityProjectId,
    })

    // The front-end also needs the Sanity details if we're using a CMS.
    config[0].sanityProjectId = projectInfo.sanityProjectId
  }

  return config
}

initialise()
