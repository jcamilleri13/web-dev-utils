import { log } from '@james-camilleri/logger'
import { SanityClient } from '@sanity/client'

export async function updateImageMetadata(request: Request, client: SanityClient) {
  try {
    const queryParameters = new URL(request.url).searchParams
    const id = queryParameters.get('id')

    if (!request.body) return new Response('No body on request.', { status: 400 })
    if (!id) return new Response('No id on request query parameters.', { status: 400 })

    log.setHeader(`Updating breakpoints for image ${id}`)

    const payload = await request.json()
    log.debug(`PAYLOAD:\n--------\n\n${JSON.stringify(payload, null, 2)}`)
    const breakpoints = payload.responsive_breakpoints[0].breakpoints
    if (!breakpoints) return new Response('No breakpoints found.', { status: 400 })

    const widths = breakpoints.map(({ width }: { width: number }) => width)
    log.info(`Breakpoints generated: ${JSON.stringify(widths)}`)

    await client.patch(id).set({ 'metadata.breakpoints': widths }).commit()
  } catch (error) {
    log.error(`${error}`)
    await log.flushAll()

    return new Response('Error updating image metadata.', { status: 400 })
  }

  log.success('Breakpoints added to Sanity record')
  await log.flush()

  return new Response(null, { status: 200 })
}
