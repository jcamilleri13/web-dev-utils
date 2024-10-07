import type { Image, ImageAsset, Reference } from 'sanity'

type SanityMetadata = ImageAsset['metadata']
type BreakpointMetadata = {
  breakpoints: number[]
}

interface Metadata extends SanityMetadata, BreakpointMetadata {}

export interface OptimisedSanityImage extends ImageAsset {
  metadata: Metadata
}

export interface ImageWithMetadata extends Image {
  alt?: string
  asset: Reference
  metadata: {
    blurHash: string
    breakpoints: number[]
    extension: string
    dimensions: ImageAsset['metadata']['dimensions']
  }
}
