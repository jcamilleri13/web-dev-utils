import { HandlerEvent, HandlerResponse } from '@netlify/functions'
import { SanityClient } from '@sanity/client'

import { generateImageBreakpoints } from './generate-image-breakpoints.js'
import { optimiseSvg } from './optimise-svg.js'

const IMAGE_TYPE = 'sanity.imageAsset'
const SVG_EXTENSION = 'svg'

export async function optimiseImage(
  event: HandlerEvent,
  client: SanityClient,
  breakpointNotificationFunction: string,
): Promise<HandlerResponse> {
  if (!event.body) return { statusCode: 400 }

  const payload = JSON.parse(event.body)
  const { _type, extension } = payload

  if (_type !== IMAGE_TYPE) return { statusCode: 415 }

  if (extension === SVG_EXTENSION) return optimiseSvg(payload, client)

  const { rawUrl } = event
  return generateImageBreakpoints(
    payload,
    rawUrl,
    breakpointNotificationFunction,
  )
}
