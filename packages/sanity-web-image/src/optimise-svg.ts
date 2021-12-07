import { Readable } from 'stream'

import log from '@james-camilleri/slack-logger'
import { HandlerResponse } from '@netlify/functions'
import { SanityClient, SanityDocument, SanityImageAssetDocument } from '@sanity/client'
import got from 'got'
import { optimize } from 'svgo'

import { deepMap } from './deep-map'
import { WebImage } from './web-image'

export async function optimiseSvg(
  payload: SanityImageAssetDocument,
  client: SanityClient
): Promise<HandlerResponse> {
  const { _id, label, url } = payload

  // Don't re-optimise an optimised SVG.
  if (label === 'optimised') return { statusCode: 200 }

  log.setHeader(`Optimising SVG ${_id}`)

  try {
    const originalSvg = await fetchSvg(url)
    const optimisedSvg = optimiseSvgString(originalSvg)
    log.info(`Optimised SVG (from ${originalSvg.length} to ${optimisedSvg.length})`)
    const newId = await uploadSvg(client, optimisedSvg)

    await replaceAllReferences(client, _id, newId)
    await deleteAsset(client, _id)
  } catch (error) {
    log.error(error)
    await log.flushAll()

    return { statusCode: 500 }
  }

  log.success('SVG optimised and replaced')
  await log.flush()

  return { statusCode: 200 }
}

async function fetchSvg(url: string): Promise<string> {
  const { body: svg } = await got(url)
  return svg
}

function optimiseSvgString(svg: string): string {
  return optimize(svg, {
    multipass: true,
    plugins: [
      {
        name: 'preset-default',
        params: {
          overrides: {
            removeViewBox: false
          }
        }
      }
    ]
  }).data
}

async function uploadSvg(client: SanityClient, svg: string): Promise<string> {
  const readable = Readable.from([svg])
  const { _id } = await client.assets.upload(
    'image',
    readable as unknown as ReadableStream<any>, // Node streams and web streams aren't quite compatible
    { label: 'optimised' }
  )

  log.info(`Optimised SVG ${_id} uploaded`)

  return _id
}

async function replaceAllReferences(
  client: SanityClient,
  oldId: string,
  newId: string
): Promise<void> {
  const documents = await getReferencedDocuments(client, oldId)
  const updatedDocuments = documents.map((document) =>
    deepMap(document, (input) => {
      if (!isWebImage(input)) return
      if (input.asset._ref !== oldId) return

      input.asset._ref = newId
      log.debug(`Replaced reference in ${document._id}`)
      return input
    })
  )

  await Promise.all(
    updatedDocuments.map((document) => client.patch(document._id).set(document).commit())
  )

  log.debug('Updated all references')
}

function isWebImage(document: WebImage | SanityDocument): document is WebImage {
  return document._type === 'webImage'
}

async function getReferencedDocuments(client: SanityClient, id: string): Promise<SanityDocument[]> {
  const query = `*[references("${id}")]`
  const result = await client.fetch(query)
  log.info(`Found ${result.length} documents referencing ${id}`)

  const ids = result.map((document: SanityDocument) => document._id)
  log.debug(`Found documents ${JSON.stringify(ids)} referencing ${id}`)

  return result
}

async function deleteAsset(client: SanityClient, id: string): Promise<void> {
  log.debug(`Deleting asset ${id}`)
  await client.delete(id)
}
