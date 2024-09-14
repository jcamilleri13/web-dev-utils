import type { LayoutServerLoad } from './$types'
import type { GlobalResult } from 'shared/types'

import { GLOBAL } from 'shared/queries'

export const load: LayoutServerLoad = async ({ locals: { loadQuery, preview } }) => {
  const initial = await loadQuery<GlobalResult>(GLOBAL)

  return { initial, preview }
}
