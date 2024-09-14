import { SANITY_API_KEY } from '$env/static/private'

import { client as clientSideClient } from './client'

export const client = clientSideClient.withConfig({
  token: SANITY_API_KEY,
  useCdn: false,
  stega: true,
})
