import type { OptimisedSanityImage } from '../types/web-image.js'
import type { ImageAsset } from 'sanity'

import { SanityClient } from '@sanity/client'

import { generateImageBreakpoints } from './generate-image-breakpoints.js'
import { optimiseSvg } from './optimise-svg.js'

const IMAGE_TYPE = 'sanity.imageAsset'
const SVG_EXTENSION = 'svg'

export async function optimiseAllImages(
  client: SanityClient,
  baseUrl: string,
  breakpointNotificationFunction: string,
) {
  const images = await client.fetch<(ImageAsset | OptimisedSanityImage)[]>(
    `*[_type == "${IMAGE_TYPE}"]`,
  )
  const imagesToOptimise = images.filter(
    (image): image is ImageAsset =>
      !(
        image.label === 'optimised' ||
        (image as OptimisedSanityImage).metadata?.breakpoints?.length > 0
      ),
  )

  await Promise.all(
    imagesToOptimise.map((image) =>
      image.extension === SVG_EXTENSION ?
        optimiseSvg(image, client)
      : generateImageBreakpoints(image, baseUrl, breakpointNotificationFunction),
    ),
  )
}
