import { crossPlatform, spawn } from '../utils/process.mjs'

export async function configureNetlify(config) {
  // TODO add some try catch to avoid doing this unnecessarily.
  await spawn(crossPlatform('npm'), ['install', '--global', 'netlify-cli'])
  await spawn(crossPlatform('netlify'), ['switch'])

  for (const template of config) {
    const { dest } = template

    await spawn(crossPlatform('netlify'), ['init'], dest)
  }
}
