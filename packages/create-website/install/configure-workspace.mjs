import { promises as fs } from 'fs'

export async function configureWorkspace(cwd) {
  const workspace = `packages:\n  - 'sites/*'`

  await fs.writeFile(`${cwd}/pnpm-workspace.yaml`, workspace)
}
