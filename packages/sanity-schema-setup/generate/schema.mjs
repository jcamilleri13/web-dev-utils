import { promises as fs } from 'fs'

import prettier from 'prettier'

const PRETTIER_SETTINGS = {
  semi: false,
  singleQuote: true,
  trailingComma: 'all',
  useTabs: false,
  parser: 'babel',
}

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
    import schemaTypes from 'all:part:@sanity/base/schema-type'
    import createSchema from 'part:@sanity/base/schema-creator'

    ${filesWritten
      .sort((a, b) => a.filePath.localeCompare(b.filePath))
      .map(
        ({ filePath, schemaName }) => `import ${schemaName} from '${filePath}'`,
      )
      .join('\n')}

    export default createSchema({
      name: 'default',
      types: schemaTypes.concat([
        ${filesWritten
          .sort((a, b) => a.schemaName.localeCompare(b.schemaName))
          .map(({ schemaName }) => `${schemaName},`)
          .join('\n')}
        webImage,
      ]),
    })
  `

  await fs.writeFile(
    `${cwd}/schemas/schema.js`,
    prettier.format(rootSchema, PRETTIER_SETTINGS),
  )
}

function createPageSchemas(pages) {
  return pages.map(({ schemaName, deskTitle, id }) => {
    const filename = `${id}.js`
    const schema = `
      export default {
        name: '${schemaName}',
        type: 'document',
        title: '${deskTitle}',
        __experimental_actions: ['update', 'publish'],
        fields: [
          {
            name: 'title',
            type: 'string'
          },
          {
            name: 'subtitle',
            type: 'string'
          }
        ]
      }
    `

    return { filename, schema, schemaName }
  })
}

function createSchemas(config) {
  return config.map(({ schemaName, deskTitle, id }) => {
    const filename = `${id}.js`
    const schema = `
      export default {
        name: '${schemaName}',
        type: 'document',
        title: '${deskTitle}',
        fields: [],
      }
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
