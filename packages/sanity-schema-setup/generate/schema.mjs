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
      await writeSubSchemaFiles(cwd, undefined, createGlobalSchema()),
      await writeSubSchemaFiles(cwd, 'collections', createSchemas(collections)),
      await writeSubSchemaFiles(cwd, 'form-submissions', createSchemas(forms)),
    ])
  ).flat(2)

  const rootSchema = `
    import { WebImage } from '@james-camilleri/sanity-web-image/schema'

    ${filesWritten
      .sort((a, b) => a.filePath.localeCompare(b.filePath))
      .map(
        ({ filePath, schemaName }) =>
          `import ${schemaName} from './${filePath
            .replace(/.*\/schemas\//, '')
            .replace('.ts', '')}'`,
      )
      .join('\n')}

    export const schemaTypes = [
      ${filesWritten
        .sort((a, b) => a.schemaName.localeCompare(b.schemaName))
        .map(({ schemaName }) => `${schemaName},`)
        .join('\n')}
        WebImage,
    ]
  `

  await fs.writeFile(
    `${cwd}/schemas/index.ts`,
    await prettier.format(rootSchema, PRETTIER_SETTINGS),
  )
}

function createGlobalSchema() {
  const filename = 'global.ts'
  const schemaName = 'global'
  const schema = `
    import { defineField, defineType } from 'sanity'

    export default defineType({
      name: '${schemaName}',
      type: 'document',
      title: 'Global',
      fields: [
        defineField({
          name: 'title',
          title: 'Site title',
          type: 'string',
          description:
            'This will appear in the browser title bar, the copyright footer, etc.',
          validation: (Rule) => Rule.required(),
        }),
        defineField({
          name: 'socialMediaLinks',
          type: 'array',
          of: [
            {
              type: 'object',
              fields: [
                {
                  name: 'platform',
                  type: 'string',
                  options: {
                    list: [
                      { title: 'Facebook', value: 'facebook' },
                      { title: 'GitHub', value: 'github' },
                      { title: 'Instagram', value: 'instagram' },
                      { title: 'Mastadon', value: 'mastadon' },
                      { title: 'TikTok', value: 'tiktok' },
                      { title: 'Twitter/X', value: 'twitter' },
                      { title: 'WhatsApp', value: 'whatsapp' },
                      { title: 'YouTube', value: 'youtube' },
                    ],
                  },
                  validation: (Rule) => Rule.required(),
                },
                {
                  name: 'url',
                  title: 'URL',
                  type: 'url',
                  validation: (Rule) => Rule.required(),
                },
              ],
            },
          ],
        }),
      ]
    })
  `

  // The write function is expecting an array of schemas.
  return [{ filename, schema, schemaName }]
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
  if (type) {
    await fs.mkdir(`${cwd}/schemas/${type}`, { recursive: true })
  }

  return Promise.all(
    schemas.map(async ({ filename, schema, schemaName }) => {
      const filePath = `${cwd}/schemas/${type ? `${type}/` : ''}${filename}`
      await fs.writeFile(
        filePath,
        await prettier.format(schema, PRETTIER_SETTINGS),
      )

      return { filePath, schemaName }
    }),
  )
}
