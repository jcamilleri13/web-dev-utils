export { optimiseAllImages } from './back-end/optimise-all-images'
export { optimiseImage } from './back-end/optimise-image'
export { updateImageMetadata } from './back-end/update-image-metadata'
export { prefetchImageMetadata } from './front-end/prefetch-image-metadata'

export type { WebImage } from './types/web-image'

export { WebImageSchema } from './sanity/schema'

// @ts-expect-error
export { default as ResponsiveImage } from '../src/svelte/ResponsiveImage.svelte'
