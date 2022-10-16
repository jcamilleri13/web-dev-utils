<script lang="ts">
  import type { WebImage } from '../types/web-image'

  import { decode } from 'blurhash'
  import { getContext, onMount } from 'svelte'
  import InlineSVG from 'svelte-inline-svg'
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
  export let maxHeight: string | undefined = undefined

  const { alt, metadata } = image ?? {}
  const { blurHash, breakpoints, dimensions, extension } = metadata ?? {}
  const { aspectRatio, width, height } = dimensions ?? {}

  const urlBuilder = image && imageUrlBuilder(sanityConfig).image(image)
  const src = image && urlBuilder.url()
  const sizesString = generateSizesString(sizes)
  const croppedHeight = cropRatio ? width * cropRatio : height

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

  function addTitleToSvg(svg: SVGElement, title?: string) {
    if (!title) return svg

    const titleElement = document.createElementNS(
      'http://www.w3.org/2000/svg',
      'title',
    )
    titleElement.textContent = title
    svg.insertAdjacentElement('afterbegin', titleElement)

    return svg
  }

  function breakpointUrl(breakpoint: number, format?: 'webp') {
    let builder = urlBuilder.width(breakpoint)

    if (cropRatio) {
      builder = builder.height(breakpoint * cropRatio).fit('min')
    }

    if (format) {
      builder = builder.format(format)
    }

    return `${builder.url()} ${breakpoint}w`
  }

  onMount(() => {
    if (extension === SVG || !image) return

    const pixels = decode(blurHash, CANVAS_SIZE, CANVAS_SIZE)
    const ctx = canvas?.getContext('2d')

    if (!ctx) return
    const imageData = ctx.createImageData(CANVAS_SIZE, CANVAS_SIZE)
    imageData.data.set(pixels)
    ctx?.putImageData(imageData, 0, 0)
  })

  const srcset = breakpoints
    ?.map((breakpoint) => breakpointUrl(breakpoint))
    .join(', ')
  const webpSrscset = breakpoints
    ?.map((breakpoint) => breakpointUrl(breakpoint, 'webp'))
    .join(', ')

  const imgAtttributes = {
    class: contain ? 'contain' : 'cover',
    decoding: 'async' as const,
    height: croppedHeight,
    loading: 'lazy',
    sizes: sizesString,
    src,
    srcset,
    width,
  }
</script>

{#if image}
  <div class="image-wrapper" style={maxHeight ? `height: ${maxHeight}` : ''}>
    {#if extension === SVG}
      <InlineSVG
        {src}
        transformSrc={(svg) => addTitleToSvg(svg, alt)}
        style={cropRatio ? `aspect-ratio: ${cropRatio}` : ''}
      />
    {:else}
      <canvas
        bind:this={canvas}
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
    object-position: top;
  }

  :global(svg) {
    height: 100%;
  }
</style>
