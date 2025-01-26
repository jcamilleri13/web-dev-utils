import type { ImageAsset } from 'sanity'

import { SanityClient } from '@sanity/client'

import { optimiseSvg } from './optimise-svg.js'

const IMAGE_TYPE = 'sanity.imageAsset'
const SVG_EXTENSION = 'svg'

export async function optimiseAllImages(client: SanityClient) {
  const images = await client.fetch<ImageAsset[]>(`*[_type == "${IMAGE_TYPE}"]`)
  const imagesToOptimise = images.filter(
    (image): image is ImageAsset =>
      image.extension === SVG_EXTENSION && image.label !== 'optimised',
  )

  await Promise.all(imagesToOptimise.map((image) => optimiseSvg(image, client)))
}
