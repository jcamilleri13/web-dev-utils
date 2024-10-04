import { Readable } from 'stream'

import { log } from '@james-camilleri/logger'
import { SanityClient, SanityDocument, SanityImageAssetDocument } from '@sanity/client'
import { optimize } from 'svgo'

import { deepMap } from '../utils/deep-map.js'
import { isWebImage } from '../utils/type-guards.js'

export async function optimiseSvg(payload: SanityImageAssetDocument, client: SanityClient) {
  const { _id, label, url } = payload

  // Don't re-optimise an optimised SVG.
  if (label === 'optimised') return new Response('SVG already optimised.', { status: 200 })

  log.setHeader(`Optimising SVG ${_id}`)

  try {
    const originalSvg = await fetchSvg(url)
    const optimisedSvg = optimiseSvgString(originalSvg)
    log.info(`Optimised SVG (from ${originalSvg.length} to ${optimisedSvg.length})`)
    const newId = await uploadSvg(client, optimisedSvg)

    await replaceAllReferences(client, _id, newId)
    await deleteAsset(client, _id)
  } catch (error) {
    log.error(`${error}`)
    await log.flushAll()

    return new Response('Error optimising SVG.', { status: 500 })
  }

  log.success('SVG optimised and replaced')
  await log.flush()

  return new Response(null, { status: 200 })
}

async function fetchSvg(url: string): Promise<string> {
  const response = await fetch(url)
  return response.text()
}

function optimiseSvgString(svg: string): string {
  const optimised = optimize(svg, {
    multipass: true,
    plugins: [
      {
        name: 'preset-default',
        params: {
          overrides: {
            removeViewBox: false,
          },
        },
      },
    ],
  })

  return optimised.data
}

async function uploadSvg(client: SanityClient, svg: string): Promise<string> {
  const readable = Readable.from([svg])
  const { _id } = await client.assets.upload('image', readable, { label: 'optimised' })

  log.info(`Optimised SVG ${_id} uploaded`)

  return _id
}

async function replaceAllReferences(
  client: SanityClient,
  oldId: string,
  newId: string,
): Promise<void> {
  const documents = await getReferencedDocuments(client, oldId)
  const updatedDocuments = documents.map((document) =>
    deepMap(document, (input) => {
      // Return block content as is to prevent unnecessary recursion.
      if (input._type === 'block') return input

      if (!isWebImage(input)) return
      if (input.asset._ref !== oldId) return input

      input.asset._ref = newId
      log.debug(`Replaced reference in ${document._id}`)
      return input
    }),
  )

  await Promise.all(
    updatedDocuments.map((document) => client.patch(document._id).set(document).commit()),
  )

  log.debug('Updated all references')
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
