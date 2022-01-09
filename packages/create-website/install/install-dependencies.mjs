import { crossPlatform, spawn } from '../utils/process.mjs'

export async function installDependencies(config) {
  for (const template of config) {
    const { dest, dependencies, devDependencies, packageManager } = template
    const command = packageManager === 'npm' ? 'install' : 'add'

    if (dependencies) {
      await spawn(
        crossPlatform(packageManager),
        [command, ...dependencies],
        dest,
      )
    }

    if (devDependencies) {
      await spawn(
        crossPlatform(packageManager),
        [command, '-D', ...devDependencies],
        dest,
      )
    }
  }
}
