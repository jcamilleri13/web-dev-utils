import fs from 'fs'

try {
  const packageJson = JSON.parse(fs.readFileSync('./package.json', 'utf8'))
  const sanityJson = JSON.parse(fs.readFileSync('./sanity.json', 'utf8'))

  replaceSanityFavicon(packageJson)
  addSanityParts(sanityJson)

  fs.writeFileSync('./package.json', JSON.stringify(packageJson, null, 2))
  fs.writeFileSync('./sanity.json', JSON.stringify(sanityJson, null, 2))

  installDependencies()

  // Delete setup script after execution.
  fs.unlinkSync('./_setup.mjs')
} catch (err) {
  console.error(err)
}

function replaceSanityFavicon (package) {
  package.build = 'sanity build && node ./node_modules/@jcamilleri13/replace-sanity-favicon'
}

function addSanityParts (sanity) {
  sanity.parts = [{
      name: 'part:@sanity/base/schema',
      path: './schemas/schema'
    }, {
      name: 'part:@sanity/desk-tool/structure',
      path: './custom/desk-structure.js'
    }, {
      implements: 'part:@sanity/base/brand-logo',
      path: './custom/styling/logo.jsx'
    }, {
      implements: 'part:@sanity/base/theme/variables/override-style',
      path: './custom/styling/variables.css'
    }
  ]
}

// TODO: Figure out how to cleanly install the latest version of the dependencies.
function installDependencies() {
  const dependencies = [
    '@jcamilleri13/sanity-web-image',
    '@jcamilleri13/slack-logger',
    'react-icons'
  ]
}
