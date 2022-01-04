import { promises as fs } from 'fs'
import { fileURLToPath } from 'url'

import degit from 'degit'

import { copyDir, deleteFiles } from '../utils/file.mjs'

export async function copyTemplates(config) {
  await Promise.all(
    config.map(async (config) => {
      const { dest, githubSrc, remove, template } = config

      if (githubSrc) {
        await degit(githubSrc, { force: true }).clone(dest)
      }

      await copyDir(
        fileURLToPath(
          new URL(`../templates/${template}`, import.meta.url).href,
        ),
        dest,
      )

      await deleteFiles(remove, dest)

      // npm won't publish .gitignore, so we need to save
      // it under a different name and then rename it.
      await fs.rename(`${dest}/gitignore`, `${dest}/.gitignore`)
    }),
  )
}
