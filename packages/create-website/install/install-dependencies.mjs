import { crossPlatform, spawn } from '../utils/process.mjs'

export async function installDependencies(config) {
  for (const template of config) {
    const { dest, dependencies, devDependencies } = template

    if (dependencies) {
      await spawn(crossPlatform('pnpm'), ['i', ...dependencies], dest)
    }

    if (devDependencies) {
      await spawn(crossPlatform('pnpm'), ['i', '-D', ...devDependencies], dest)
    }
  }
}
