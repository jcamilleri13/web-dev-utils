import { SanityImageAssetDocument } from '@sanity/client'
import { SanityImageDimensions, SanityReference } from '@sanity/image-url/lib/types/types'

type SanityMetadata = SanityImageAssetDocument['metadata']
type BreakpointMetadata = {
  breakpoints: number[]
}

interface Metadata extends SanityMetadata, BreakpointMetadata {}

export interface OptimisedSanityImage extends SanityImageAssetDocument {
  metadata: Metadata
}

export interface WebImage {
  _type: 'webImage'
  alt?: string
  asset: SanityReference
  metadata: {
    blurHash: string
    breakpoints: number[]
    extension: string
    dimensions: SanityImageDimensions
  }
}
