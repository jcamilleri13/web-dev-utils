import { prefetchImageMetadata } from '@james-camilleri/sanity-web-image'
import CONFIG from '$lib/config'
import type { Page, PageId } from '$lib/types/pages'

const REQUEST_OPTIONS = { mode: 'cors' } as const
type Fetch = (input: RequestInfo, init?: RequestInit) => Promise<Response>

function url(query: string) {
  const { apiVersion, dataset, projectId } = CONFIG.SANITY
  return `https://${projectId}.apicdn.sanity.io/v${apiVersion}/data/query/${dataset}?query=${query}`
}

export async function getPage(page: PageId, fetch: Fetch): Promise<Page> {
  const query = `*[_type == "${page}"]`

  return fetch(url(query), REQUEST_OPTIONS)
    .then((response) => response.json())
    .then((payload) => payload.result[0])
    .then((page) => prefetchImageMetadata(page, CONFIG.SANITY, fetch))
}

export const get = {
  page: getPage,
}
