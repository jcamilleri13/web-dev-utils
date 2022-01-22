import inquirer from 'inquirer'

import { generate } from './generate/index.mjs'
import prompts from './prompts.mjs'

async function main() {
  const cwd = process.argv[2] || '.'

  const userInput = await inquirer.prompt(prompts)
  generate(cwd, userInput)
}

main()
