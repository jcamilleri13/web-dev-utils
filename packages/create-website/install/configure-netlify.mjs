import { crossPlatform, spawn } from '../utils/process.mjs'

export async function configureNetlify(config) {
  await spawn(crossPlatform('netlify'), ['switch'])

  for (const template of config) {
    const { dest } = template

    await spawn(crossPlatform('netlify'), ['init'], dest)
  }
}
