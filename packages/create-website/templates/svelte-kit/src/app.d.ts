// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces

import type { LoaderLocals } from '@sanity/svelte-loader'

declare global {
  namespace App {
    interface Locals extends LoaderLocals {}
  }
}

export {}
