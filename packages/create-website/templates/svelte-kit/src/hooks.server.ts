import { createRequestHandler, setServerClient } from '@sanity/svelte-loader'

import { client } from '$lib/sanity/server'

setServerClient(client)

export const handle = createRequestHandler()
