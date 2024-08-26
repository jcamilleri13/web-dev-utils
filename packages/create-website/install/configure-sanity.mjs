import { promises as fs } from 'fs'
import stripAnsi from 'strip-ansi'

import { generate } from '@james-camilleri/sanity-schema-setup/generate/index.mjs'

import { replacePlaceholdersInFile } from '../utils/file.mjs'
import { spawn, exec } from '../utils/process.mjs'

export async function configureSanity(config, projectInfo) {
  const { name, dest } = config[2]

  await spawn(
    'pnpm',
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
    dest,
  )

  // `sanity init` seems to be auto-creating a git repository and screwing a
  // bunch of things up. Delete the `.git` folder.
  try {
    await fs.rm(`${dest}/.git`, { recursive: true, force: true })
  } catch {
    // Don't worry if the git repository hasn't actually been created.
  }

  // Also delete the "schemaTypes" folder it's creating.
  try {
    await fs.rm(`${dest}/schemaTypes`, { recursive: true, force: true })
  } catch {}

  let sanityConfig
  try {
    sanityConfig = await fs.readFile(`${dest}/sanity.config.ts`, 'utf8')
  } catch (e) {
    console.error('Could not read sanity.config.ts')
    return
  }

  const [_, projectId] = sanityConfig.match(
    /export default defineConfig\({[\s\S]+projectId:\s+'(.*)',/m,
  )

  const sanityInfo = stripAnsi(await exec('pnpm exec sanity debug --secrets', dest))
  const [, sanityAuthToken] = sanityInfo.match(/Auth token:\s+'(.*)'/)

  const sanityApiVersion = new Date().toISOString().slice(0, 8) + '01'

  const headers = {
    Authorization: `Bearer ${sanityAuthToken}`,
    'Content-Type': 'application/json',
  }

  console.log('Creating Sanity.io API key.')
  const sanityApiKey = await fetch(
    `https://api.sanity.io/v${sanityApiVersion}/projects/${projectId}/tokens`,
    {
      method: 'POST',
      headers,
      body: JSON.stringify({
        label: 'website',
        roleName: 'editor',
      }),
    },
  )
    .then((response) => response.json())
    .then(({ key }) => key)

  console.log()
  console.log('Adding Sanity.io CORS origins:')
  const corsOrigins = [
    'http://sveltekit-prerender',
    `https://${projectInfo.url}`,
    // TODO: Add Cloudflare origins.
    `https://${projectInfo.sanityUrl}`,
    `https://*--${name}.netlify.app`,
    `https://*--${name}-cms.netlify.app`,
  ]

  await Promise.all(
    corsOrigins?.map(async (origin) => {
      console.log('>', origin)
      return fetch(`https://api.sanity.io/v${sanityApiVersion}/projects/${projectId}/cors`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ origin }),
      })
    }),
  )

  const dictionary = {
    sanityProjectId: projectId,
    sanityApiVersion,
    sanityApiKey,
  }

  await Promise.all(
    config.map(async (config) => {
      const { dest, replace = [] } = config

      await Promise.all(
        replace.map(async (file) => {
          const filePath = `${dest}/${file}`
          await replacePlaceholdersInFile(filePath, dictionary)
        }),
      )
    }),
  )

  console.log()
  console.log('Updating sanity.config.ts')
  await fs.writeFile(
    `${dest}/sanity.config.ts`,
    `import { visionTool } from '@sanity/vision'
import { defineConfig } from 'sanity'
import { presentationTool } from 'sanity/presentation'
import { structureTool } from 'sanity/structure'

import { schemaTypes } from './schemas'
import { structure } from './structure'

const SANITY_STUDIO_PREVIEW_URL =
  process.env.PUBLIC_SANITY_STUDIO_PREVIEW_URL || 'http://localhost:5173'

const dev = process.env.MODE === 'development'

export default defineConfig({
  name: 'default',
  title: '${name}',

  projectId: '${projectId}',
  dataset: 'production',

  plugins: [
    structureTool({ structure }),
    presentationTool({
      previewUrl: {
        origin: SANITY_STUDIO_PREVIEW_URL,
        previewMode: {
          enable: '/preview/enable',
          disable: '/preview/disable',
        },
      },
    }),
    ...(dev ? [visionTool()] : []),
  ],

  schema: {
    types: schemaTypes,
  },

  document: {
    newDocumentOptions: (prev, context) =>
      prev.filter(({ templateId }) => {
        return templateId !== 'global' && !templateId.startsWith('page')
      }),
  },
})`,
  )

  console.log()
  console.log('Generating Sanity schema.')
  await generate(dest, projectInfo, sanityApiKey)

  console.log()
  console.log('Generating Sanity types.')
  await spawn('pnpm', ['typegen'], dest)

  return dictionary
}
