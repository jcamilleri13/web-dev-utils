import type { Image, ImageAsset, Reference } from 'sanity'

type SanityMetadata = ImageAsset['metadata']
type BreakpointMetadata = {
  breakpoints: number[]
}

interface Metadata extends SanityMetadata, BreakpointMetadata {}

export interface OptimisedSanityImage extends ImageAsset {
  metadata: Metadata
}

export interface RawWebImage extends Image {
  alt?: string
}

export interface RasterImageWithMetadata extends Image {
  alt?: string
  asset: Reference
  metadata: {
    blurHash: string
    breakpoints: number[]
    extension: string
    dimensions: ImageAsset['metadata']['dimensions']
  }
}

export interface SvgImageWithMetaData extends RasterImageWithMetadata {
  svgMarkup: string
  metadata: RasterImageWithMetadata['metadata'] & {
    extension: 'svg'
  }
}

export type ImageWithMetadata = SvgImageWithMetaData | RasterImageWithMetadata
