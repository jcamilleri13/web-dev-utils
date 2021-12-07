import { SanityImageAssetDocument } from '@sanity/client'
import { SanityImageDimensions, SanityReference } from '@sanity/image-url/lib/types/types'

export interface WebImage extends SanityImageAssetDocument {
  _type: 'webImage'
  alt?: string
  asset: SanityReference
  metadata: {
    blurHash: string
    breakpoints: number[]
    dimensions: SanityImageDimensions
  }
}
