import type { ImageWithMetadata } from '../types/web-image.js'
import type { SanityDocument } from 'sanity'

import { deepMap } from '../utils/deep-map.js'
import { isBlockType, isWebImage } from '../utils/type-guards.js'

interface SanityConfig {
  apiVersion: string
  dataset: string
  projectId: string
}

// Just a helper function to avoid re-writing the guard conditions multiple times.
function createMapFunction(mappedFunction: (input: ImageWithMetadata) => unknown) {
  return (input: unknown) => {
    // Return block content as is to prevent unnecessary recursion.
    if (isBlockType(input)) return input
    if (!isWebImage(input)) return
    if (!input?.asset) return input

    return mappedFunction(input)
  }
}

export async function prefetchImageMetadata<
  T extends SanityDocument | SanityDocument[] = SanityDocument,
>(
  input: T,
  sanityConfig: SanityConfig,
  fetch: (input: RequestInfo, init?: RequestInit) => Promise<Response>,
): Promise<T> {
  const { apiVersion, dataset, projectId } = sanityConfig
  const idsToFetch: string[] = []

  // Traverse tree and collect all asset IDs requiring fetching.
  deepMap(
    input,
    createMapFunction((input) => {
      idsToFetch.push(input.asset._ref)
      return input
    }),
  )

  const query = `*[_id in [${idsToFetch.map((id) => `"${id}"`).join(',')}]]{ _id, extension, ...metadata{ blurHash, breakpoints, dimensions }}`
  const response = (await fetch(
    `https://${projectId}.apicdn.sanity.io/v${apiVersion}/data/query/${dataset}?query=${query}`,
    { mode: 'cors' },
  ).then((result) => result.json())) as {
    result: (ImageWithMetadata['metadata'] & { _id: string })[]
  }

  const metadata = response.result.reduce(
    (metadata, item) => {
      const { _id, ...rest } = item
      return {
        ...metadata,
        [_id]: rest,
      }
    },
    {} as Record<string, ImageWithMetadata['metadata']>,
  )

  // Update metadata
  return deepMap(
    input,
    createMapFunction((input) => ({ ...input, metadata: metadata[input.asset._ref] })),
  ) as T
}
