import log from '@james-camilleri/slack-logger'
import { HandlerEvent } from '@netlify/functions'
import { SanityClient, SanityDocument } from '@sanity/client'

import { SanityImageInfo } from './web-image'

const WEB_IMAGE = 'webImage'

export async function getImagesForProcessing(
  client: SanityClient,
  event: HandlerEvent
): Promise<Array<SanityImageInfo>> {
  const documents = await getModifiedDocuments(client, event)

  // Find all webImages in updated documents.
  return Promise.all(
    documents.map(async (document: SanityDocument) => {
      const { _id, name, title } = document
      log.debug(`Collecting webImages for "${name || title || '(no title)'}" [${_id}]`)

      return {
        documentId: document._id,
        webImages: await Promise.all(
          Object.entries(document)
            .filter(([_, value]) => value._type === WEB_IMAGE && !value.breakpoints)
            .map(async ([field, value]) => {
              const { url, width } = await getSanityImageMetadata(client, value.asset._ref)
              return { documentId: document._id, field, url, width }
            })
        )
      }
    })
  )
}

async function getModifiedDocuments(client: SanityClient, event: HandlerEvent) {
  if (!event.body) return []

  const ids = JSON.parse(event.body).ids
  const modifiedIds = JSON.stringify([...ids.created, ...ids.updated])
  log.debug(`Modified IDs: ${modifiedIds}`)

  return client.fetch(`*[_id in ${modifiedIds}]`)
}

async function getSanityImageMetadata(client: SanityClient, imageId: string) {
  const result = await client.fetch(`*[_id=="${imageId}"]`)
  const { metadata, url } = result[0]
  const { width } = metadata.dimensions

  log.debug(`Found webImage ${imageId}: width ${width}, url: ${url}`)

  return { url, width }
}
