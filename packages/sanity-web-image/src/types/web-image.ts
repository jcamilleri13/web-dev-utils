import type { Image, ImageAsset, Reference } from 'sanity'

export interface RawImage extends Image {
  alt?: string
}

export interface RasterImageWithMetadata extends Image {
  alt?: string
  asset: Reference
  metadata: {
    blurHash: string
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
