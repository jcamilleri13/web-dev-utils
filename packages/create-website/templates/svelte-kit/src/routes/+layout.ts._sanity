import type { LayoutLoad } from './$types'

import { setPreviewing } from '@sanity/visual-editing/svelte'

export const prerender = true

export const load: LayoutLoad = ({ data: { initial, preview } }) => {
  setPreviewing(preview)

  return { initial, preview }
}
