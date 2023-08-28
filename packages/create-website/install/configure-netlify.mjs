import { promises as fs } from 'fs'
import { crossPlatform, exec, spawn } from '../utils/process.mjs'

export async function configureNetlify(config) {
  // TODO: This takes forever so it isn't really a solution.
  try {
    exec('netlify')
  } catch {
    await spawn(crossPlatform('npm'), ['install', '--global', 'netlify-cli'])
  }

  await spawn(crossPlatform('netlify'), ['switch'])

  for (const template of config) {
    const { dest } = template

    await spawn(crossPlatform('netlify'), ['init'], dest)

    try {
      await fs.access(`${dest}/.env`)
      await spawn(crossPlatform('netlify'), ['env:import', '.env'], dest)
    } catch {
      // .env file does not exist, keep calm and carry on
    }
  }
}
