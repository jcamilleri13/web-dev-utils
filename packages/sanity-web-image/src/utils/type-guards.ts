import type { ImageWithMetadata } from '../types/web-image.js'
import type { BlockDefinition } from 'sanity'

export function isWebImage(document: unknown): document is ImageWithMetadata {
  return (
    typeof document === 'object' &&
    document != null &&
    '_type' in document &&
    document?._type === 'webImage'
  )
}

export function isBlockType(document: unknown): document is BlockDefinition {
  return (
    typeof document === 'object' &&
    document != null &&
    '_type' in document &&
    document?._type === 'block'
  )
}
