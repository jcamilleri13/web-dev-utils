import { SanityClient, SanityImageAssetDocument } from '@sanity/client'

import { OptimisedSanityImage } from '../types/web-image'
import { generateImageBreakpoints } from './generate-image-breakpoints.js'
import { optimiseSvg } from './optimise-svg.js'

const IMAGE_TYPE = 'sanity.imageAsset'
const SVG_EXTENSION = 'svg'

export async function optimiseAllImages(
  client: SanityClient,
  baseUrl: string,
  breakpointNotificationFunction: string,
) {
  const images = await client.fetch<SanityImageAssetDocument>(
    `*[_type == "${IMAGE_TYPE}"]`,
  )
  const imagesToOptimise = images.filter(
    (image: OptimisedSanityImage) =>
      !(image.label === 'optimised' || image.metadata?.breakpoints?.length > 0),
  )

  for (const image of imagesToOptimise) {
    image.extension === SVG_EXTENSION
      ? await optimiseSvg(image, client)
      : await generateImageBreakpoints(
          image,
          baseUrl,
          breakpointNotificationFunction,
        )
  }
}
