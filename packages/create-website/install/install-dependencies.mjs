import { exec } from '../utils/process.mjs'

export async function installDependencies(cwd, config, projectInfo) {
  console.info('Installing dependencies')

  // if (proje)

  const args = ['install', '-D', ...Project.settings.lintPkgs, ...this.testPackages]
  await utils.process.spawnp('npm', args, this.path)
}
