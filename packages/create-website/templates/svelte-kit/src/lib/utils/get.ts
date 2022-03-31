import { prefetchImageMetadata } from '@james-camilleri/sanity-web-image'
import imageUrlBuilder from '@sanity/image-url'
import type { SanityImageSource } from '@sanity/image-url/lib/types/types'
import CONFIG from '$lib/config'
import type { Page, PageId } from '$lib/types/pages'

const THUMBNAIL_SIZE = 200
const REQUEST_OPTIONS = { mode: 'cors' } as const
type Fetch = (input: RequestInfo, init?: RequestInit) => Promise<Response>

const { apiVersion, dataset, projectId } = CONFIG.SANITY

const imgBuilder = imageUrlBuilder({ projectId, dataset })
const url = (query: string) =>
  `https://${projectId}.apicdn.sanity.io/v${apiVersion}/data/query/${dataset}?query=${query}`

export async function getPage(page: PageId, fetch: Fetch): Promise<Page> {
  const query = `*[_type == "${page}"]`

  return fetch(url(query), REQUEST_OPTIONS)
    .then((response) => response.json())
    .then((payload) => payload.result[0])
    .then((page) => prefetchImageMetadata(page, CONFIG.SANITY, fetch))
}

export function getThumbnailUrlFor(source: SanityImageSource): string {
  return imgBuilder.image(source).size(THUMBNAIL_SIZE, THUMBNAIL_SIZE).url()
}

export const get = {
  page: getPage,
  thumbnailUrl: getThumbnailUrlFor,
}
