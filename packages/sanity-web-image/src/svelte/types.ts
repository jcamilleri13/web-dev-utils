import type { ImageWithMetadata } from '../types/web-image.js'
import type { Image } from 'sanity'

export interface Sizes {
  [key: string]: string
}

export interface AlternateImage {
  maxWidth: string
  image?: Image | ImageWithMetadata
  cropRatio?: number
}

export interface AlternateImageWithMetadata extends AlternateImage {
  image?: ImageWithMetadata
}

export const SVG = 'svg'
export const CANVAS_SIZE = 32
