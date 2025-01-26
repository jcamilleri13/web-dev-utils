import type { RasterImageWithMetadata, RawImage } from '../types/web-image.js'

export interface Sizes {
  [key: string]: string
}

// TODO: Types (and implementation) do not currently support alternate SVG images.
export interface AlternateImage {
  maxWidth: string
  image?: RawImage | RasterImageWithMetadata
  cropRatio?: number
}

export interface AlternateImageWithMetadata extends AlternateImage {
  image?: RasterImageWithMetadata
}

export const CANVAS_SIZE = 32
