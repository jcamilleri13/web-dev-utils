import log from '@james-camilleri/slack-logger'
import { HandlerEvent, HandlerResponse } from '@netlify/functions'
import { SanityClient } from '@sanity/client'

import { generateCloudinaryBreakpoints } from './generate-cloudinary-breakpoints'
import { getImagesForProcessing } from './get-images'

export async function onImageUploadHook(
  client: SanityClient,
  event: HandlerEvent,
  onComplete: string
): Promise<HandlerResponse> {
  try {
    log.setHeader('Queuing images for breakpoint generation')
    const images = await getImagesForProcessing(client, event)
    const urls = images.map(({ url }) => url).join()
    log.info(`Queuing images: ${urls}`)

    await generateCloudinaryBreakpoints(images, event, onComplete)
  } catch (error) {
    log.error(error)
    await log.flushAll()

    return { statusCode: 500 }
  }

  await log.flush()

  return { statusCode: 200 }
}
