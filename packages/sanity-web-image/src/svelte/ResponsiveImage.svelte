<script lang="ts">
  import type { WebImage } from '../types/web-image'

  import { decode } from 'blurhash'
  import { getContext, onMount } from 'svelte'
  import imageUrlBuilder from '@sanity/image-url'

  interface Sizes {
    [key: string]: string
  }

  interface ConfigContext {
    SANITY: {
      projectId: string
      dataset: string
      apiVersion: string
    }
  }

  const SVG = 'svg'
  const CANVAS_SIZE = 32
  const CONFIG = getContext<ConfigContext>('CONFIG')

  export let sanityConfig = CONFIG.SANITY

  export let image: WebImage
  export let sizes: Sizes | undefined = undefined
  export let cropRatio: number | undefined = undefined
  export let contain = false
  export let align: 'top' | 'center' | 'bottom' = 'top'
  export let maxHeight: string | undefined = undefined
  export let lazy = true

  $: alt = image.alt
  $: metadata = image.metadata
  $: blurHash = metadata.blurHash
  $: breakpoints = metadata.breakpoints
  $: dimensions = metadata.dimensions
  $: extension = metadata.extension
  $: aspectRatio = dimensions.aspectRatio
  $: width = dimensions.width
  $: height = dimensions.height

  $: urlBuilder = image && imageUrlBuilder(sanityConfig).image(image)
  $: src = image && urlBuilder.url()
  $: sizesString = generateSizesString(sizes)
  $: croppedHeight = cropRatio ? Math.floor(width / cropRatio) : height

  let canvas: HTMLCanvasElement | undefined
  let loaded = false
  const onLoad = () => {
    loaded = true
  }

  function generateSizesString(sizes?: Sizes) {
    const FALLBACK_WIDTH = '100vw'

    if (sizes === undefined) return FALLBACK_WIDTH

    const queryList = Object.entries(sizes).map(([query, size]) => {
      const queryString = /\(.*\)/.test(query) ? query : `(min-width: ${query})`
      return `${queryString} ${size}`
    })

    queryList.push(FALLBACK_WIDTH)
    return queryList.join(', ')
  }

  function breakpointUrl(breakpoint: number, format?: 'webp') {
    let builder = urlBuilder.width(breakpoint)

    if (cropRatio) {
      builder = builder.height(Math.floor(breakpoint / cropRatio)).fit('min')
    }

    if (format) {
      builder = builder.format(format)
    }

    return `${builder.url()} ${breakpoint}w`
  }

  async function fetchSvgSource(src: string, extension: string) {
    if (extension !== SVG) {
      return
    }

    try {
      const response = await fetch(src)
      if (!response.ok) {
        throw response.statusText
      }

      const source = await response.text()
      return alt
        ? source.replace(
            /(<.*?>)(.*)/,
            (_, openingTag, svgContent) =>
              `${openingTag}<title>${alt}</title>${svgContent}`,
          )
        : source
    } catch (e) {
      console.error('Error retrieving SVG source', e)
    }
  }

  $: svgSource = fetchSvgSource(src, extension)

  onMount(() => {
    if (extension === SVG || !image) return

    const pixels = decode(blurHash, CANVAS_SIZE, CANVAS_SIZE)
    const ctx = canvas?.getContext('2d')

    if (!ctx) return
    const imageData = ctx.createImageData(CANVAS_SIZE, CANVAS_SIZE)
    imageData.data.set(pixels)
    ctx?.putImageData(imageData, 0, 0)
  })

  $: srcset = breakpoints
    ?.map((breakpoint) => breakpointUrl(breakpoint))
    .join(', ')
  $: webpSrscset = breakpoints
    ?.map((breakpoint) => breakpointUrl(breakpoint, 'webp'))
    .join(', ')

  $: imgAtttributes = {
    class: contain ? 'contain' : 'cover',
    decoding: 'async' as const,
    height: croppedHeight,
    loading: lazy ? 'lazy' : undefined,
    sizes: sizesString,
    src,
    srcset,
    width,
  }
</script>

{#if image}
  <div
    class="image-wrapper"
    style={maxHeight ? `height: ${maxHeight}` : ''}
    style:--align={align}
  >
    {#if extension === SVG && svgSource}
      {#await svgSource then src}
        {@html src}
      {/await}
    {:else}
      <canvas
        bind:this={canvas}
        class:loaded
        width={CANVAS_SIZE}
        height={CANVAS_SIZE}
        style={contain
          ? `aspect-ratio: ${cropRatio || aspectRatio}`
          : 'height: 100%'}
      />
      <picture>
        <source type="image/webp" srcset={webpSrscset} sizes={sizesString} />
        <img {alt} {...imgAtttributes} on:load={onLoad} class:loaded />
      </picture>
    {/if}
  </div>
{/if}

<style lang="scss">
  .image-wrapper {
    position: relative;
    overflow: hidden;
  }

  canvas {
    position: absolute;
    width: 100%;
    z-index: -1;
    transition: opacity var(--transition-speed-medium) ease-in;

    &.loaded {
      opacity: 0;
    }
  }

  img {
    width: 100%;
    height: 100%;
    opacity: 0;
    transition: opacity var(--transition-speed-medium) ease-in;

    &.loaded {
      opacity: 1;
    }
  }

  .cover {
    object-fit: cover;
  }

  .contain {
    object-fit: contain;
    object-position: var(--align);
  }

  :global(svg) {
    height: 100%;
  }
</style>
