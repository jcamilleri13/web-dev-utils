import { promises as fs } from 'fs'

export async function generateReadme(projectInfo, cwd) {
  const { name, cms, configNetlify } = projectInfo

  const builtUsing = `Built using SvelteKit${cms === 'sanity' ? ` and Sanity.io.` : '.'}`
  const hosted = configNetlify ? ' Hosted on Netlify.' : ''
  const readme = `# ${name}\nWebsite for *${name}*. ${builtUsing}${hosted}`

  await fs.writeFile(`${cwd}/README.md`, readme)
}
