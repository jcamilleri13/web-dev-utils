import type { ImageAsset } from 'sanity'

import { log } from '@james-camilleri/logger'

const MIN_WIDTH = 300
const BYTE_STEP = 20000

export async function generateImageBreakpoints(
  payload: ImageAsset,
  rawUrl: string,
  breakpointNotificationFunction: string,
  cloudinaryUrl?: string,
) {
  try {
    const { _id, url } = payload

    log.setHeader(`Generating breakpoints for image ${_id}`)

    const width = payload.metadata.dimensions.width
    const notificationUrl = createNotificationUrl(rawUrl, breakpointNotificationFunction, _id)

    await queueBreakpointGeneration(
      url,
      width,
      notificationUrl,
      parseCloudinaryUrl(cloudinaryUrl ?? process.env.CLOUDINARY_URL),
    )
  } catch (error) {
    log.error(`${error as string}`)
    await log.flushAll()

    return new Response('Error queueing image breakpoint generation.', { status: 500 })
  }

  log.success('Breakpoint generation task queued')
  await log.flush()

  return new Response(null, { status: 200 })
}

function createNotificationUrl(rawUrl: string, breakpointNotificationFunction: string, id: string) {
  const baseUrl = rawUrl.split('/').slice(0, -1).join('/')
  const notificationUrl = `${baseUrl}/${breakpointNotificationFunction}?id=${id}`
  log.debug(`Generated Cloudinary notification URL: ${notificationUrl}`)

  return notificationUrl
}

// cloudinary://<your_api_key>:<your_api_secret>@daqg2bvdk
function parseCloudinaryUrl(url?: string) {
  if (!url?.startsWith('cloudinary://')) {
    throw Error('Invalid Cloudinary URL format.')
  }

  const [apiKey, secretAndName] = url.replace('cloudinary://', '').split(':')
  const [secret, cloudName] = secretAndName.split('@')

  return {
    apiKey,
    secret,
    cloudName,
  }
}

async function queueBreakpointGeneration(
  url: string,
  width: number,
  notificationUrl: string,
  auth: {
    cloudName: string
    apiKey: string
    secret: string
  },
): Promise<void> {
  const formData = new FormData()
  formData.append('file', url)
  formData.append('api_key', auth.apiKey)

  const params = {
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
    timestamp: Math.round(new Date().getTime() / 1000),
  }

  // Add params to request.
  Object.entries(params).forEach(([name, param]) =>
    formData.append(name, typeof param === 'string' ? param : JSON.stringify(param)),
  )

  // Create request digest string.
  const serialisedParams = Object.entries(params)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, value]) => `${key}=${typeof value === 'string' ? value : JSON.stringify(value)}`)
    .join('&')

  const signature = await crypto.subtle.digest(
    { name: 'SHA-1' },
    new TextEncoder().encode(serialisedParams + auth.secret),
  )

  const hexSignature = Array.from(new Uint8Array(signature))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')

  formData.append('signature', hexSignature)

  const response = await fetch(`http://api.cloudinary.com/v1_1/${auth.cloudName}/image/upload`, {
    method: 'POST',
    body: formData,
  })

  if (!response.ok) {
    const body = await response.text()
    log.error(body)

    throw Error()
  }

  log.debug(await response.text())
}
