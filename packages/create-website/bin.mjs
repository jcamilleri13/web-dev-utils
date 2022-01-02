#!/usr/bin/env node

import fs from 'fs'

import inquirer from 'inquirer'

async function initialise() {
  const defaultName = process.argv[2]
  const cwd = defaultName || '.'

  await createProjectDir(cwd)
  const { name, cms } = await getProjectInfo(defaultName)

  if (cms !== 'none') {
    copyTemplate('svelte-kit', '.')
  } else {
    copyTemplate('svelte-kit', './front-end')
    copyTemplate(cms, './cms')
  }
}

async function createProjectDir(cwd) {
  if (fs.existsSync(cwd)) {
    if (fs.readdirSync(cwd).length > 0) {
      const response = await inquirer.prompt([
        {
          type: 'confirm',
          name: 'value',
          message: 'Directory not empty. Continue?',
          initial: false,
        },
      ])

      if (!response.value) {
        process.exit(1)
      }
    }
  } else {
    // mkdirp(cwd)
  }
}

function mkdirp(dir) {
  try {
    fs.mkdirSync(dir, { recursive: true })
  } catch (e) {
    if (e.code === 'EEXIST') return
    throw e
  }
}

function getProjectInfo(name) {
  return inquirer.prompt([
    {
      type: 'input',
      name: 'name',
      message: 'Website/client name:',
      default: name,
    },
    {
      type: 'list',
      name: 'cms',
      message: 'Content management system:',
      choices: ['sanity.io', 'none'],
      default: 'sanity.io',
    },
  ])
}

function copyTemplate(template, dest) {}

function replacePlaceholders(fileString, replacements) {
  for (const [key, value] of Object.entries(replacements)) {
    fileString = fileString.replace(`{{${key}}}`, value)
  }

  return fileString
}

// try {
//   const packageJson = JSON.parse(fs.readFileSync('./package.json', 'utf8'))

//   doThings(packageJson)

//   fs.writeFileSync('./package.json', JSON.stringify(packageJson, null, 2))

//   installDependencies()

//   // Delete setup script after execution.
//   fs.unlinkSync('./_setup.mjs')
// } catch (err) {
//   console.error(err)
// }

// // TODO: Figure out how to cleanly install the latest version of the dependencies.
// function installDependencies() {
//   const devDependencies = [
//     '@james-camilleri/svelte-portable-text',
//     '@poppanator/sveltekit-svg',
//     '@sveltejs/adapter-netlify',
//     'env-cmd',
//     'lodash',
//     'sanitize.css',
//     'sass',
//   ]

//   const dependencies = ['@sanity/client', 'nodemailer']
// }

// function updatePackageJson() {
//   // TODO: Add env-cmd to dev scripts.
// }

initialise()
