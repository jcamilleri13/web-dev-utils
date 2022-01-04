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

  await copyTemplates(config)
  await replacePlaceholders(config)
  // await installDependencies(config)
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

  if (cms !== 'none') {
    config[0].dest = `${cwd}/web`

    config.push({
      ...baseConfig[cms],
      name: `${name}-cms`,
      dest: `${cwd}/cms`,
      template: cms,
    })
  }

  return config
}

initialise()
