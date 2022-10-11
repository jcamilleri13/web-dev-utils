import { promises as fs } from 'fs'

import prettier from 'prettier'

import PRETTIER_SETTINGS from './prettier-settings.mjs'

const DEFAULT_ICONS = {
  pageAbout: 'RiInformationLine',
  pageAboutUs: 'RiInformationLine',
  pageContact: 'RiMailLine',
  pageContactUs: 'RiMailLine',
  pageHome: 'RiHome4Line',
  pages: 'RiArticleLine',
  portfolioItem: 'RiImage2Line',
  post: 'RiDraftLine',
  product: 'RiShoppingCartLine',
  submissions: 'RiDownload2Line',
}

export async function generateDeskStructure(cwd, config) {
  const { features, pages, collections, forms } = config

  const deskStructure = `
    ${imports(config)}

    export default (S: StructureBuilder, context: ConfigContext) =>
      S.list()
        .title('Content')
        .items([${[
          generateCollections(features),
          generateCollections(collections),
          generateForms(forms),
          generatePages(pages),
        ]
          .filter(Boolean)
          .join('S.divider(),')}])
  `

  const formatted = prettier.format(deskStructure, PRETTIER_SETTINGS)

  await fs.writeFile(`${cwd}/structure.ts`, formatted)
}

function imports(config) {
  const icons = Object.values(config)
    .flat()
    .map(({ schemaName }) => DEFAULT_ICONS[schemaName])
    .filter(Boolean)
    .sort()

  return `
    import { ConfigContext, StructureBuilder } from 'sanity/desk'
    import { ${icons.join(',')} } from 'react-icons/ri'
  `
}

function generateCollections(collections) {
  if (collections.length) {
    return collections.map(
      ({ schemaName, deskTitle }) => `
      S.listItem()
        .title('${deskTitle}')
        .icon(${DEFAULT_ICONS[schemaName]})
        .child(
          S.documentList()
            .title('${deskTitle}')
            .filter('_type == "${schemaName}"')
            .schemaType('${schemaName}')
        ),
      `,
    )
  }
}

function generateForms(forms) {
  if (forms.length) {
    return forms.map(
      ({ schemaName, deskTitle }) => `
      S.listItem()
        .title('${deskTitle} Submissions')
        .icon(${DEFAULT_ICONS.submissions})
        .child(
          S.documentList()
            .title('${deskTitle}')
            .filter('_type == "${schemaName}"')
            .schemaType('${schemaName}')
        ),
      `,
    )
  }
}

function generatePages(pages) {
  if (pages.length === 0) return
  if (pages.length < 4) return pages.map(generatePage).join(',')

  return `
    S.listItem()
      .title('Pages')
      .icon(${DEFAULT_ICONS.pages})
      .child(
        S.list()
          .title('Pages')
          .items([${pages.map(generatePage).join(',')}]),
      ),`
}

function generatePage({ schemaName, deskTitle, id }) {
  return `
    S.listItem()
      .title('${deskTitle}')
      .icon(${DEFAULT_ICONS[schemaName]})
      .child(
        S.document()
          .title('${deskTitle}')
          .schemaType('${schemaName}')
          .documentId('${id}'),
      ),`
}
