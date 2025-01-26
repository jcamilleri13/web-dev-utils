import type { ImageWithMetadata, RawImage } from '../types/web-image.js'
import type { ImageUrlBuilder } from 'sanity'

import { decode } from 'blurhash'

import { SVG, fetchSvgMarkup } from '../utils/svg.js'

import {
  type AlternateImage,
  type AlternateImageWithMetadata,
  type Sizes,
  CANVAS_SIZE,
} from './types'

export function isImageWithMetaData(
  image: RawImage | ImageWithMetadata | undefined,
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

async function fetchImageMetaData(image: RawImage, imageUrlBuilder: ImageUrlBuilder) {
  const { asset } = image
  const { dataset, projectId } = imageUrlBuilder.options

  if (!asset?._ref || !dataset || !projectId) {
    return {}
  }

  const query = `*[_id == "${asset?._ref}"]{ extension, ...metadata{ blurHash, dimensions }}[0]`
  const apiVersion = new Date().toISOString().split('T')[0] // Just use current API. We may regret this later.
  const url = `https://${projectId}.apicdn.sanity.io/v${apiVersion}/data/query/${dataset}?query=${query}`

  try {
    const payload = await fetch(url)
    const metadata = ((await payload.json()) as { result: ImageWithMetadata['metadata'] }).result

    let svgMarkup: string | undefined
    if (metadata.extension === SVG) {
      svgMarkup = await fetchSvgMarkup(imageUrlBuilder.image(image).url(), image.alt)
    }

    return { metadata, svgMarkup }
  } catch (e) {
    console.error(e)
  }

  return {}
}

export async function getImageWithMetadata(
  image: RawImage | ImageWithMetadata | undefined,
  imageUrlBuilder: ImageUrlBuilder,
) {
  if (!image) {
    return Promise.resolve(undefined)
  }

  if (isImageWithMetaData(image)) {
    return Promise.resolve(image)
  }

  const { metadata, svgMarkup } = await fetchImageMetaData(image, imageUrlBuilder)

  return {
    ...image,
    ...(svgMarkup ? { svgMarkup } : undefined),
    metadata,
  } as ImageWithMetadata
}

export function generateBreakpoints(width: number) {
  let nextBreakpoint = 100
  const breakpoints: number[] = []

  while (nextBreakpoint < width) {
    breakpoints.push(nextBreakpoint)
    nextBreakpoint +=
      nextBreakpoint < 300 ? 50
      : nextBreakpoint < 1000 ? 100
      : 150
  }

  breakpoints.push(width)

  return breakpoints
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
