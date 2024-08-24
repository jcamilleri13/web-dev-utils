import { replacePlaceholdersInFile } from '../utils/file.mjs'

export async function replacePlaceholders(config) {
  await Promise.all(
    config.map(async (config) => {
      const { adapter, dest, name, packageName, replace = [] } = config
      const dictionary = { adapter, name, packageName }

      await Promise.all(
        replace.map(async (file) => {
          const filePath = `${dest}/${file}`
          await replacePlaceholdersInFile(filePath, dictionary)
        }),
      )
    }),
  )
}
