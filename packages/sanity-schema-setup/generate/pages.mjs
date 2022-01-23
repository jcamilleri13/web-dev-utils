import { promises as fs } from 'fs'

import sanityClient from '@sanity/client'
import inquirer from 'inquirer'

export async function generatePages(cwd, config, apiKey) {
  const { pages } = config

  let sanityJson
  try {
    sanityJson = await fs.readFile(`${cwd}/sanity.json`, 'utf8')
  } catch (e) {
    console.log('Error reading sanity.json, cannot pre-create pages.')
    return
  }

  const sanityConfig = JSON.parse(sanityJson)
  const { projectId, dataset } = sanityConfig.api

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
