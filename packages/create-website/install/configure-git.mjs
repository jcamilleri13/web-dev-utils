import { exec } from '../utils/process.mjs'

export async function configureGit(cwd) {
  await exec('git init', cwd)
  await exec('git add .', cwd)
  await exec('git commit -m"Initial commit."', cwd)
  // git init
  // git add .
  // git commit
  // git add github remote (github cli?)
  // git push
}
