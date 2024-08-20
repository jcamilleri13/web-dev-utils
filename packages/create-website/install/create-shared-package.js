import { mkdirp } from '../utils/file.mjs'

export async function createProjectDir(cwd) {
  await mkdirp(cwd + 'sites/_shared')
}
