import { SanityImageObject } from '@sanity/image-url/lib/types/types'

export interface WebImage extends SanityImageObject {
  alt: string
  breakpoints: number[]
}

export interface SanityImageInfo {
  documentId: string
  field: string
  url: string
  width: number
}
