import type { ImageWithMetadata } from '../types/web-image.js'
import type { Image, ImageUrlBuilder } from 'sanity'

import { decode } from 'blurhash'

import {
  type AlternateImage,
  type AlternateImageWithMetadata,
  type Sizes,
  CANVAS_SIZE,
  SVG,
} from './types'

export function isImageWithMetaData(
  image: Image | ImageWithMetadata | undefined,
): image is ImageWithMetadata {
  return !!image && image.metadata != null
}

export function checkAlternateImagesMetadata(
  alternateImages?: AlternateImage[] | AlternateImageWithMetadata[],
): alternateImages is AlternateImageWithMetadata[] {
  return !alternateImages?.some((alternateImage) => {
    return !(alternateImage.image == null || isImageWithMetaData(alternateImage.image))
  })
}

async function fetchImageMetaData(image: Image, imageUrlBuilder: ImageUrlBuilder) {
  const { asset } = image
  const { dataset, projectId } = imageUrlBuilder.options

  if (!asset?._ref || !dataset || !projectId) {
    return
  }

  const query = `*[_id == "${asset?._ref}"]{ extension, ...metadata{ blurHash, breakpoints, dimensions }}[0]`
  const apiVersion = new Date().toISOString().split('T')[0] // Just use current API. We may regret this later.
  const url = `https://${projectId}.apicdn.sanity.io/v${apiVersion}/data/query/${dataset}?query=${query}`

  try {
    const payload = await fetch(url)
    const metadata = ((await payload.json()) as { result: ImageWithMetadata['metadata'] }).result

    return metadata
  } catch (e) {
    console.error(e)
  }
}

export async function getImageWithMetadata(
  image: Image | ImageWithMetadata | undefined,
  imageUrlBuilder: ImageUrlBuilder,
) {
  if (!image) {
    return Promise.resolve(undefined)
  }

  return !isImageWithMetaData(image) ?
      ({
        ...image,
        metadata: await fetchImageMetaData(image, imageUrlBuilder),
      } as ImageWithMetadata)
    : Promise.resolve(image)
}

export function generateSizesString(sizes?: Sizes) {
  const FALLBACK_WIDTH = '100vw'

  if (sizes === undefined) return FALLBACK_WIDTH

  const queryList = Object.entries(sizes).map(([query, size]) => {
    const queryString = /\(.*\)/.test(query) ? query : `(min-width: ${query})`
    return `${queryString} ${size}`
  })

  queryList.push(FALLBACK_WIDTH)
  return queryList.join(', ')
}

export async function fetchSvgSource(src?: string, alt?: string, extension?: string) {
  if (!src || extension !== SVG) {
    return
  }

  try {
    const response = await fetch(src)
    if (!response.ok) {
      throw Error(response.statusText)
    }

    const source = await response.text()
    return alt ?
        source.replace(
          /(<.*?>)(.*)/,
          (_, openingTag, svgContent) => `${openingTag}<title>${alt}</title>${svgContent}`,
        )
      : source
  } catch (e) {
    console.error('Error retrieving SVG source', e)
  }
}

function breakpointUrl(
  urlBuilder: ImageUrlBuilder | undefined,
  breakpoint: number,
  cropRatio?: number,
  format?: 'webp',
) {
  if (!urlBuilder) {
    return ''
  }

  let builder = urlBuilder.width(breakpoint)

  if (cropRatio) {
    builder = builder.height(Math.floor(breakpoint / cropRatio)).fit('min')
  }

  if (format) {
    builder = builder.format(format)
  }

  return `${builder.url()} ${breakpoint}w`
}

export function generateSrcset(
  urlBuilder?: ImageUrlBuilder,
  breakpoints?: number[],
  cropRatio?: number,
) {
  return breakpoints
    ?.map((breakpoint) => breakpointUrl(urlBuilder, breakpoint, cropRatio))
    .join(', ')
}

export function generateWebpSrcset(
  urlBuilder?: ImageUrlBuilder,
  breakpoints?: number[],
  cropRatio?: number,
) {
  return breakpoints
    ?.map((breakpoint) => breakpointUrl(urlBuilder, breakpoint, cropRatio, 'webp'))
    .join(', ')
}

export function renderBlurHash(canvas?: HTMLCanvasElement, blurHash?: string) {
  if (!canvas || !blurHash) {
    return
  }

  const pixels = decode(blurHash, CANVAS_SIZE, CANVAS_SIZE)
  const ctx = canvas?.getContext('2d')

  if (!ctx) {
    return
  }

  const imageData = ctx.createImageData(CANVAS_SIZE, CANVAS_SIZE)
  imageData.data.set(pixels)
  ctx?.putImageData(imageData, 0, 0)
}
