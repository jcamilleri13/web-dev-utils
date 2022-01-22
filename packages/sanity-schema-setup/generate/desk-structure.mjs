import fs from 'fs/promises'
import prettier from 'prettier'

const DEFAULT_ICONS = {
  form: 'RiDownload2Line',
  pageAbout: 'RiInformationLine',
  pageAboutUs: 'RiInformationLine',
  pageContact: 'RiMailLine',
  pageContactUs: 'RiMailLine',
  pageHome: 'RiHome4Line',
  pages: 'RiArticleLine',
  portfolioItem: 'RiImage2Line',
  post: 'RiDraftLine',
  product: 'RiShoppingCartLine',
}

export async function generateDeskStructure(cwd, config) {
  const { features, pages, collections, forms } = config

  const deskStructure = `
    ${imports(config)}

    export default () =>
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

  const formatted = prettier.format(deskStructure, {
    semi: false,
    singleQuote: true,
    trailingComma: 'all',
    useTabs: false,
    parser: 'babel',
  })

  await fs.mkdir(`${cwd}/custom`, { recursive: true })
  await fs.writeFile(`${cwd}/custom/desk-structure.js`, formatted)
}

function imports(config) {
  const icons = Object.values(config)
    .flat()
    .map(({ schemaName }) => DEFAULT_ICONS[schemaName])
    .filter(Boolean)
    .sort()

  return `
    import S from '@sanity/desk-tool/structure-builder'
    import { ${icons.join(',')} } from 'react-icons/ri';
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
        .icon(${DEFAULT_ICONS.form})
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
