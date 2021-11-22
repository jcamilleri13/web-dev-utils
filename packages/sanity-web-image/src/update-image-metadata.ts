import log from '@james-camilleri/slack-logger'
import { HandlerEvent, HandlerResponse } from '@netlify/functions'
import { SanityClient } from '@sanity/client'

export async function updateImageMetadata(
  event: HandlerEvent,
  client: SanityClient
): Promise<HandlerResponse> {
  try {
    const id = event.queryStringParameters?.id

    if (!event.body) return { statusCode: 400 }
    if (!id) return { statusCode: 400 }

    log.setHeader(`Updating breakpoints for image ${id}`)

    const payload = JSON.parse(event.body)
    const breakpoints = payload.responsive_breakpoints[0].breakpoints
    if (!breakpoints) return { statusCode: 400 }

    const widths = breakpoints.map(({ width }: { width: number }) => width)
    log.info(`Breakpoints generated: ${JSON.stringify(widths)}`)

    await client.patch(id).set({ 'metadata.breakpoints': widths }).commit()
  } catch (error) {
    log.error(error)
    await log.flushAll()

    return { statusCode: 500 }
  }

  log.success('Breakpoints added to Sanity record')
  await log.flush()

  return { statusCode: 200 }
}
