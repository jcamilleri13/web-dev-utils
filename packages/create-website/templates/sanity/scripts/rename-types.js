import fs from 'node:fs/promises'

async function renameTypes() {
  console.log('Renaming query types.')
  const typeGenConfig = await fs.readFile('./sanity-typegen.json', {
    encoding: 'utf-8',
  })

  const outputPath = JSON.parse(typeGenConfig).generates

  const types = await fs.readFile(outputPath, 'utf-8')
  const renamedTypes = types.replaceAll(/export type ([A-Z\d_]*)Result =/g, (_, typeName) => {
    const pascalCase = typeName
      .split('_')
      .map((word) => word.toLowerCase())
      .map((word) => `${word.slice(0, 1).toUpperCase()}${word.slice(1)}`)
      .join('')

    return `export type ${pascalCase}Result =`
  })

  await fs.writeFile(outputPath, renamedTypes, 'utf-8')
}

renameTypes()
