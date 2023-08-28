import { promises as fs } from 'fs'
import stripAnsi from 'strip-ansi'

import { generate } from '@james-camilleri/sanity-schema-setup/generate/index.mjs'

import { replacePlaceholdersInFile } from '../utils/file.mjs'
import { crossPlatform, spawn } from '../utils/process.mjs'

export async function configureSanity(config, projectInfo) {
  const { name, dest } = config[1]

  await spawn(
    crossPlatform('pnpm'),
    [
      'create',
      'sanity@latest',
      '-y',
      '--create-project',
      name,
      '--dataset',
      'production',
      '--output-path',
      '.',
      '--typescript',
    ],
    dest
  )

  // `sanity init` seems to be auto-creating a git repository and screwing a
  // bunch of things up. Delete the `.git` folder.
  try {
    await fs.rm(`${dest}/.git`, { recursive: true, force: true })
  } catch {
    // Don't worry if the git repository hasn't actually been created.
  }

  let sanityConfig
  try {
    sanityConfig = await fs.readFile(`${dest}/sanity.config.ts`, 'utf8')
  } catch (e) {
    console.error('Could not read sanity.config.ts')
    return
  }

  const [_, projectId] = sanityConfig.match(/export default defineConfig\({[\s\S]+projectId:\s+'(.*)',/m)

  const sanityInfo = stripAnsi(await exec(crossPlatform('sanity debug --secrets'), dest))
  const [, sanityAuthToken] = sanityInfo.match(/Auth token:\s+'(.*)'/)

  const sanityApiVersion = new Date().toISOString().slice(0, 8) + '01'

  const headers = {
    Authorization: `Bearer ${sanityAuthToken}`,
    'Content-Type': 'application/json',
  }

  console.log('Creating Sanity.io API key.')
  const sanityApiKey = await fetch(`https://api.sanity.io/v${sanityApiVersion}/projects/${projectId}/tokens`, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      label: 'website',
      roleName: 'editor',
    }),
  })
    .then((response) => response.json())
    .then(({ key }) => key)

  console.log('Adding Sanity.io CORS origins:')
  const corsOrigins = ['http://sveltekit-prerender', `https://${projectInfo.url}`, `https://${projectInfo.sanityUrl}`]

  await Promise.all(
    corsOrigins?.map(async (origin) => {
      console.log('>', origin)
      return fetch(`https://api.sanity.io/v${sanityApiVersion}/projects/${projectId}/cors`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ origin }),
      })
    })
  )

  const dictionary = {
    sanityProjectId: projectId,
    sanityApiVersion,
    sanityApiKey,
  }

  await Promise.all(
    config.map(async (config) => {
      const { dest, replace } = config

      await Promise.all(
        replace.map(async (file) => {
          const filePath = `${dest}/${file}`
          await replacePlaceholdersInFile(filePath, dictionary)
        })
      )
    })
  )

  console.log('Updating sanity.config.ts')
  await fs.writeFile(
    `${dest}/sanity.config.ts`,
    `import { visionTool } from '@sanity/vision'
import { createConfig } from 'sanity'
import { deskTool } from 'sanity/desk'

import { schemaTypes } from './schemas'
import { structure } from './structure'

export default createConfig({
  name: 'default',
  title: '${name}',

  projectId: '${projectId}',
  dataset: 'production',

  plugins: [deskTool({ structure }), visionTool()],

  schema: {
    types: schemaTypes,
  },
})`
  )

  console.log('Generating Sanity schema.')
  await generate(dest, projectInfo, sanityApiKey)
}
