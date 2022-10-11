import { promises as fs } from 'fs'

import prettier from 'prettier'

import PRETTIER_SETTINGS from './prettier-settings.mjs'

export async function generateSchema(cwd, config) {
  const { features, pages, collections, forms } = config

  const filesWritten = (
    await Promise.all([
      await Promise.all(
        features.map(({ feature, ...config }) =>
          writeSubSchemaFiles(cwd, feature, createSchemas([config])),
        ),
      ),
      await writeSubSchemaFiles(cwd, 'pages', createPageSchemas(pages)),
      await writeSubSchemaFiles(cwd, 'collections', createSchemas(collections)),
      await writeSubSchemaFiles(cwd, 'form-submissions', createSchemas(forms)),
    ])
  ).flat(2)

  const rootSchema = `
    import { WebImageSchema as webImage } from '@james-camilleri/sanity-web-image'

    ${filesWritten
      .sort((a, b) => a.filePath.localeCompare(b.filePath))
      .map(
        ({ filePath, schemaName }) =>
          `import ${schemaName} from './${filePath
            .split('/')
            .slice(-2)
            .join('/')
            .replace('.ts', '')}'`,
      )
      .join('\n')}

    export const schemaTypes = [
      ${filesWritten
        .sort((a, b) => a.schemaName.localeCompare(b.schemaName))
        .map(({ schemaName }) => `${schemaName},`)
        .join('\n')}
      webImage,
    ]
  `

  await fs.writeFile(
    `${cwd}/schemas/index.ts`,
    prettier.format(rootSchema, PRETTIER_SETTINGS),
  )
}

function createPageSchemas(pages) {
  return pages.map(({ schemaName, deskTitle, id }) => {
    const filename = `${id}.ts`
    const schema = `
      import { defineField, defineType } from 'sanity'

      export default defineType({
        name: '${schemaName}',
        type: 'document',
        title: '${deskTitle}',
        __experimental_actions: ['update', 'publish'],
        fields: [
          defineField({
            name: 'title',
            type: 'string'
          }),
          defineField({
            name: 'subtitle',
            type: 'string'
          })
        ]
      })
    `

    return { filename, schema, schemaName }
  })
}

function createSchemas(config) {
  return config.map(({ schemaName, deskTitle, id }) => {
    const filename = `${id}.ts`
    const schema = `
      import { defineField, defineType } from 'sanity'

      export default defineType({
        name: '${schemaName}',
        type: 'document',
        title: '${deskTitle}',
        fields: [
          defineField({
            name: 'fieldName',
            title: 'Field Title',
            type: 'string',
          }),
        ],
      })
    `

    return { filename, schema, schemaName }
  })
}

async function writeSubSchemaFiles(cwd, type, schemas) {
  await fs.mkdir(`${cwd}/schemas/${type}`, { recursive: true })

  return Promise.all(
    schemas.map(async ({ filename, schema, schemaName }) => {
      const filePath = `${cwd}/schemas/${type}/${filename}`
      await fs.writeFile(filePath, prettier.format(schema, PRETTIER_SETTINGS))

      return { filePath, schemaName }
    }),
  )
}
