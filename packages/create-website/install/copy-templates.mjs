import degit from 'degit'

import { copyDir, deleteFiles } from '../utils/file.mjs'

export async function copyTemplates(config) {
  await Promise.all(
    config.map(async (config) => {
      const { dest, githubSrc, remove, template } = config

      if (githubSrc) {
        await degit(githubSrc, { force: true }).clone(dest)
      }

      // TODO: Enable overwrites.
      await copyDir(`./templates/${template}`, dest)
      await deleteFiles(remove, dest)
    }),
  )
}
