import { generate } from '@james-camilleri/sanity-schema-setup/generate/index.mjs'
import inquirer from 'inquirer'

import { replacePlaceholdersInFile } from '../utils/file.mjs'
import { readJson } from '../utils/file.mjs'
import { crossPlatform, spawn } from '../utils/process.mjs'

export async function configureSanity(config, projectInfo) {
  const { name, dest } = config[1]

  await spawn(
    crossPlatform('sanity'),
    [
      'init',
      '-y',
      '--create-project',
      name,
      '--dataset',
      'production',
      '--output-path',
      '.',
    ],
    dest,
  )

  const sanityConfig = await readJson(`${dest}/sanity.json`)
  const sanityApiKey = (
    await inquirer.prompt({
      type: 'input',
      name: 'key',
      message: 'Sanity read/write API key:',
    })
  ).key

  const dictionary = {
    sanityProjectId: sanityConfig.api.projectId,
    sanityApiVersion: new Date().toISOString().slice(0, 8) + '01',
    sanityApiKey,
  }

  await Promise.all(
    config.map(async (config) => {
      const { dest, replace } = config

      await Promise.all(
        replace.map(async (file) => {
          const filePath = `${dest}/${file}`
          await replacePlaceholdersInFile(filePath, dictionary)
        }),
      )
    }),
  )

  console.log('Generating Sanity schema.')
  await generate(dest, projectInfo, sanityApiKey)
}
