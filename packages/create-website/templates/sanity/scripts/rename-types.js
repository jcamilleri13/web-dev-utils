import fs from 'node:fs/promises'

function pascalCase(string) {
  return string
    .split('_')
    .map((word) => word.toLowerCase())
    .map((word) => `${word.slice(0, 1).toUpperCase()}${word.slice(1)}`)
    .join('')
}

async function renameTypes() {
  console.log('Renaming query types.')
  const typeGenConfig = await fs.readFile('./sanity-typegen.json', {
    encoding: 'utf-8',
  })

  const outputPath = JSON.parse(typeGenConfig).generates

  const typesFile = await fs.readFile(outputPath, 'utf-8')
  const typesToRename = typesFile.matchAll(/export type ([A-Z\d_]*)Result =/g)

  let renamedTypes = typesFile
  for (const match of typesToRename) {
    if (!match[1]) {
      continue
    }

    const originalName = `${match[1]}Result`
    const newName = `${pascalCase(match[1])}Result`
    renamedTypes = renamedTypes.replaceAll(originalName, newName)
  }

  await fs.writeFile(outputPath, renamedTypes, 'utf-8')
}

renameTypes()
