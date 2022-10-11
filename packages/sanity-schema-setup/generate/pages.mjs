import { promises as fs } from 'fs'

import sanityClient from '@sanity/client'
import inquirer from 'inquirer'

const ERROR = 'Error reading sanity.config.ts, cannot pre-create pages.'

export async function generatePages(cwd, config, apiKey) {
  const { pages } = config

  let sanityConfig
  try {
    sanityConfig = await fs.readFile(`${cwd}/sanity.config.ts`, 'utf8')
  } catch (e) {
    console.log(ERROR)
    return
  }

  const [_, projectId, dataset] = sanityConfig.match(
    /export default createConfig\({[\s\S]+projectId:\s+'(.*)',\s+dataset:\s+'(.*)'/m,
  )

  if (!projectId || !dataset) {
    console.log(ERROR)
    return
  }

  if (!apiKey) {
    apiKey = (
      await inquirer.prompt({
        type: 'input',
        name: 'key',
        message: 'Sanity read/write API key:',
      })
    ).key
  }

  const client = sanityClient({
    projectId,
    dataset,
    apiVersion: new Date().toISOString().slice(0, 8) + '01',
    token: apiKey,
    useCdn: false,
  })

  try {
    for (const { schemaName, id } of pages) {
      await client.create({
        _type: schemaName,
        _id: id,
      })
    }
  } catch (e) {
    console.error(e)
  }
}
