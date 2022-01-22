import { deskTitle, id, schemaName } from '../utils/identifiers.mjs'
import { generateDeskStructure } from './desk-structure.mjs'
import { generatePages } from './pages.mjs'
import { generateSchema } from './schema.mjs'

const DEFAULT_CONFIGS = {
  blog: {
    deskTitle: 'Blog',
    schemaName: 'post',
  },
  portfolio: {
    deskTitle: 'Portfolio',
    schemaName: 'portfolioItem',
  },
  store: {
    deskTitle: 'Products',
    schemaName: 'product',
  },
}

export async function generate(cwd, userInput, apiKey) {
  const config = createConfig(userInput)

  await generateSchema(cwd, config)
  await generateDeskStructure(cwd, config)
  await generatePages(cwd, config, apiKey)
}

function createConfig({ features, pages, collections, forms }) {
  return {
    features: features.map((name) => createConfigItem(name)),
    pages: split(pages).map((name) => createConfigItem(name, 'page')),
    collections: split(collections).map((name) => createConfigItem(name)),
    forms: split(forms).map((name) => createConfigItem(name, 'form')),
  }
}

function createConfigItem(name, type) {
  return (
    DEFAULT_CONFIGS[name] ?? {
      deskTitle: deskTitle(name, !type), // Only pluralise collections.
      schemaName: schemaName(name, type),
      id: id(name), // These are only used for pages.
    }
  )
}

function split(string) {
  return string
    .split(';')
    .filter((string) => string.length !== 0)
    .map((name) => name.trim())
}
