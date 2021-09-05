import fs from 'fs'

try {
  const packageFile = fs.readFileSync('./package.json', 'utf8')
  const correctedPackageFile = packageFile.replace(
    '"build": "sanity build"',
    '"build": "sanity build && node ./node_modules/@jcamilleri13/replace-sanity-favicon"'
  )

  fs.writeFileSync('./package.json', correctedPackageFile)

  // Delete setup script after execution.
  fs.unlinkSync('./_setup.mjs')
} catch (err) {
  console.error(err)
}
