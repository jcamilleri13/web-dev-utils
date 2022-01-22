import { replacePlaceholdersInFile } from '../utils/file.mjs'
import { readJson } from '../utils/file.mjs'
import { crossPlatform, spawn } from '../utils/process.mjs'

export async function configureSanity(config) {
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

  // Update Sanity ID.
  const sanityConfig = await readJson(`${dest}/sanity.json`)
  const dictionary = {
    sanityProjectId: sanityConfig.api.projectId,
    sanityApiVersion: new Date().toISOString().slice(0, 8) + '01',
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
}
