import log from '@james-camilleri/slack-logger'
import { HandlerResponse } from '@netlify/functions'
import { SanityImageAssetDocument } from '@sanity/client'
import { v2 as cloudinary } from 'cloudinary'

const MIN_WIDTH = 300
const BYTE_STEP = 20000

export async function generateImageBreakpoints(
  payload: SanityImageAssetDocument,
  rawUrl: string,
  breakpointNotificationFunction: string,
): Promise<HandlerResponse> {
  try {
    const { _id, url } = payload

    log.setHeader(`Generating breakpoints for image ${_id}`)

    const width = payload.metadata.dimensions.width
    const notificationUrl = createNotificationUrl(rawUrl, breakpointNotificationFunction, _id)

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

function createNotificationUrl(rawUrl: string, breakpointNotificationFunction: string, id: string) {
  const baseUrl = rawUrl.split('/').slice(0, -1).join('/')
  const notificationUrl = `${baseUrl}/${breakpointNotificationFunction}?id=${id}`
  log.debug(`Generated Cloudinary notification URL: ${notificationUrl}`)

  return notificationUrl
}

async function queueBreakpointGeneration(
  url: string,
  width: number,
  notificationUrl: string,
): Promise<void> {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload(
      url,
      {
        async: true,
        notification_url: notificationUrl,
        responsive_breakpoints: [
          {
            create_derived: false,
            bytes_step: BYTE_STEP,
            min_width: MIN_WIDTH,
            max_width: width,
          },
        ],
      },
      (error) => {
        if (error) {
          reject(error.message)
          return
        }

        resolve()
      },
    )
  })
}
