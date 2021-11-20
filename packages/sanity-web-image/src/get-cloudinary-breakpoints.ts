import { HandlerEvent } from '@netlify/functions'
import { v2 as cloudinary } from 'cloudinary'

import { SanityImageInfo } from './web-image'

const MIN_WIDTH = 300
const BYTE_STEP = 20000

export async function generateCloudinaryBreakpoints(
  images: SanityImageInfo[],
  event: HandlerEvent,
  onComplete: string
): Promise<void> {
  await Promise.all(
    images.map(({ documentId, field, url, width }) =>
      queueBreakpointGeneration(
        url,
        width,
        createOnCompleteUrl(event, onComplete, documentId, field)
      )
    )
  )
}

function createOnCompleteUrl(
  event: HandlerEvent,
  onComplete: string,
  documentId: string,
  field: string
) {
  const { rawUrl } = event

  const baseUrl = rawUrl.split('/').slice(0, -1).join('/')
  const queryParams = [`documentId=${documentId}`, `field=${field}`].join('&')

  return `${baseUrl}/${onComplete}?${queryParams}`
}

function queueBreakpointGeneration(
  url: string,
  width: number,
  notificationUrl: string
): Promise<void> {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload(
      url,
      {
        responsive_breakpoints: [
          {
            create_derived: false,
            bytes_step: BYTE_STEP,
            min_width: MIN_WIDTH,
            max_width: width,
            notification_url: notificationUrl
          }
        ]
      },
      (error, result) => {
        if (error) {
          reject(error.message)
          return
        }

        // const breakpoints = result?.responsive_breakpoints[0].breakpoints
        // const widths = breakpoints.map(({ width }: { width: number }) => width)
        // resolve(result)

        resolve()
      }
    )
  })
}
