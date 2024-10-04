import { SanityClient } from '@sanity/client'

import { generateImageBreakpoints } from './generate-image-breakpoints.js'
import { optimiseSvg } from './optimise-svg.js'

const IMAGE_TYPE = 'sanity.imageAsset'
const SVG_EXTENSION = 'svg'

export async function optimiseImage(
  request: Request,
  client: SanityClient,
  breakpointNotificationFunction: string,
) {
  if (!request.body) return new Response('No body on request.', { status: 400 })

  const payload = await request.json()
  const { _type, extension } = payload

  if (_type !== IMAGE_TYPE)
    return new Response('Payload not a `sanity.imageAsset`.', { status: 415 })

  if (extension === SVG_EXTENSION) return optimiseSvg(payload, client)

  return generateImageBreakpoints(payload, request.url, breakpointNotificationFunction)
}
