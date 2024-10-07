import ResponsiveImage from './svelte/ResponsiveImage.svelte'

export { optimiseAllImages } from './back-end/optimise-all-images.js'
export { updateImageMetadata } from './back-end/update-image-metadata.js'
export { optimiseImage } from './back-end/optimise-image.js'

export { prefetchImageMetadata } from './front-end/prefetch-image-metadata.js'
export { WebImageSchema } from './sanity/schema.js'

export { ResponsiveImage, ResponsiveImage as default }

export type { ImageWithMetadata as WebImage } from './types/web-image.js'
