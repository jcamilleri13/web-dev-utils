import type { ImageAsset } from 'sanity'

import { SanityClient } from '@sanity/client'

import { optimiseSvg } from './optimise-svg.js'

const IMAGE_TYPE = 'sanity.imageAsset'
const SVG_EXTENSION = 'svg'

export async function optimiseImage(request: Request, client: SanityClient) {
  if (!request.body) return new Response('No body on request.', { status: 400 })

  const payload = (await request.json()) as ImageAsset
  const { _type, extension } = payload

  if (_type !== IMAGE_TYPE)
    return new Response('Payload not a `sanity.imageAsset`.', { status: 415 })

  if (extension === SVG_EXTENSION) return optimiseSvg(payload, client)

  return new Response('Optimisation not needed.', { status: 200 })
}
