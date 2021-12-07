import { SanityDocument } from '@sanity/client'

import { WebImage } from './web-image'

export function isWebImage(document: WebImage | SanityDocument): document is WebImage {
  return document._type === 'webImage'
}
