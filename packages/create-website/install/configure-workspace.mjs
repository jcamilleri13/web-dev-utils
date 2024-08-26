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

  const editorconfig = `[*]
end_of_line = lf`

  await fs.writeFile(`${cwd}/pnpm-workspace.yaml`, workspace)
  await fs.writeFile(`${cwd}/.gitignore`, gitignore)
  await fs.writeFile(`${cwd}/.editorconfig`, editorconfig)

  // Add "shared" package to all sub-sites.

  const siteDirs = (await fs.readdir(`${cwd}/sites`, { withFileTypes: true }))
    .filter((entry) => entry.isDirectory())
    .filter((dir) => dir.name !== '_shared')
    .map((dir) => `${dir.parentPath}/${dir.name}`)

  await Promise.all(
    siteDirs.map(async (siteDir) => {
      const packageJsonRaw = await fs.readFile(`${siteDir}/package.json`, 'utf-8')
      const packageJson = JSON.parse(packageJsonRaw)

      packageJson.devDependencies = { shared: 'workspace:^' }

      await fs.writeFile(
        `${siteDir}/package.json`,
        JSON.stringify(packageJson, undefined, 2),
        'utf-8',
      )
    }),
  )
}
