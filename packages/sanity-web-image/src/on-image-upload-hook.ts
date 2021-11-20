import log from '@james-camilleri/slack-logger'
import { HandlerEvent, HandlerResponse } from '@netlify/functions'
import { SanityClient } from '@sanity/client'

import { getImagesForProcessing } from './get-images'
import { queueImagesForProcessing } from './queue-images'

export async function onImageUploadHook(
  client: SanityClient,
  event: HandlerEvent
): Promise<HandlerResponse> {
  try {
    log.setHeader('Queuing images for breakpoint generation')
    const images = await getImagesForProcessing(client, event)
    const urls = images.map(({ url }) => url).join()
    log.info(`Queuing images: ${urls}`)

    await queueImagesForProcessing(images)
  } catch (error) {
    log.error(error)
    await log.flushAll()

    return { statusCode: 500 }
  }

  await log.flush()

  return { statusCode: 200 }
}
