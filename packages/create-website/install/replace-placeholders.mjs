import { promises as fs } from 'fs'

export async function replacePlaceholders(config) {
  await Promise.all(
    config.map(async (config) => {
      const { dest, name, packageName, replace } = config
      const dictionary = { name, packageName }

      if (config.sanityProjectId) {
        dictionary.sanityProjectId = config.sanityProjectId
        dictionary.sanityApiVersion =
          new Date().toISOString().slice(0, 8) + '01'
      }

      await Promise.all(
        replace.map(async (file) => {
          const filePath = `${dest}/${file}`
          let contents = await fs.readFile(filePath, 'utf8')

          for (const [key, value] of Object.entries(dictionary)) {
            contents = contents.replace(`{{${key}}}`, value)
          }

          await fs.writeFile(filePath, contents)
        }),
      )
    }),
  )
}
