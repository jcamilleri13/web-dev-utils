import { deskTitle, id, schemaName } from '../utils/identifiers.mjs'
import { generateDeskStructure } from './desk-structure.mjs'
import { generatePages } from './pages.mjs'
import { generateSchema } from './schema.mjs'

const DEFAULT_CONFIGS = {
  blog: {
    feature: 'blog',
    deskTitle: 'Blog',
    schemaName: 'post',
    id: 'post',
  },
  portfolio: {
    feature: 'portfolio',
    deskTitle: 'Portfolio',
    schemaName: 'portfolioItem',
    id: 'portfolio-item',
  },
  store: {
    feature: 'store',
    deskTitle: 'Products',
    schemaName: 'product',
    id: 'product',
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
    forms: split(forms).map((name) => createConfigItem(name, 'submission')),
  }
}

function createConfigItem(name, type) {
  return (
    DEFAULT_CONFIGS[name] ?? {
      deskTitle: deskTitle(name, !type), // Only pluralise collections.
      schemaName: schemaName(name, type),
      id: id(name), // Used for page IDs and filenames.
    }
  )
}

function split(string) {
  return string
    .split(';')
    .filter((string) => string.length !== 0)
    .map((name) => name.trim())
}
