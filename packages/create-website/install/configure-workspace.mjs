import { promises as fs } from 'fs'

export async function configureWorkspace(cwd) {
  const workspace = `packages:\n  - 'sites/*'\n\n`
  const gitignore = `node_modules

.netlify/
.pnp/
.sanity/
build/
coverage/
dist/
logs/
package/

!.env.example
.DS_Store
.env
.env.*
.pnp.js
.svelte-kit
*.log
*.pem
*.tsbuildinfo
\n\n`

  await fs.writeFile(`${cwd}/pnpm-workspace.yaml`, workspace)
  await fs.writeFile(`${cwd}/.gitignore`, gitignore)
}
