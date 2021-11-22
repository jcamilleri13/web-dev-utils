import log from '@james-camilleri/slack-logger'
import { HandlerEvent, HandlerResponse } from '@netlify/functions'
import { v2 as cloudinary } from 'cloudinary'

const IMAGE_TYPE = 'sanity.imageAsset'
const SVG_EXTENSION = 'svg'
const MIN_WIDTH = 300
const BYTE_STEP = 20000

export async function generateImageBreakpoints(
  event: HandlerEvent,
  onComplete: string
): Promise<HandlerResponse> {
  if (!event.body) return { statusCode: 400 }

  const payload = JSON.parse(event.body)
  const { _id, _type, extension, url } = payload

  if (_type !== IMAGE_TYPE) return { statusCode: 415 }
  if (extension === SVG_EXTENSION) return { statusCode: 200 }

  try {
    log.setHeader(`Generating breakpoints for image ${_id}`)

    const width = payload.metadata.dimensions.width
    const notificationUrl = createNotificationUrl(event, onComplete, _id)

    await queueBreakpointGeneration(url, width, notificationUrl)
  } catch (error) {
    log.error(error)
    await log.flushAll()

    return { statusCode: 500 }
  }

  log.success('Breakpoint generation task queued')
  await log.flush()

  return { statusCode: 200 }
}

function createNotificationUrl(event: HandlerEvent, onComplete: string, id: string) {
  const { rawUrl } = event

  const baseUrl = rawUrl.split('/').slice(0, -1).join('/')
  const notificationUrl = `${baseUrl}/${onComplete}?id=${id}`

  log.debug(`Generated Cloudinary notification URL: ${notificationUrl}`)

  return notificationUrl
}

async function queueBreakpointGeneration(
  url: string,
  width: number,
  notificationUrl: string
): Promise<void> {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload(
      url,
      {
        notification_url: notificationUrl,
        responsive_breakpoints: [
          {
            create_derived: false,
            bytes_step: BYTE_STEP,
            min_width: MIN_WIDTH,
            max_width: width
          }
        ]
      },
      (error) => {
        if (error) {
          reject(error.message)
          return
        }

        resolve()
      }
    )
  })
}
