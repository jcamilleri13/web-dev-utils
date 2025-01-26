<script lang="ts">
  import type { ImageWithMetadata, RawImage } from '../types/web-image.js'
  import type { ImageUrlBuilder } from 'sanity'

  import { onMount } from 'svelte'

  import { SVG } from '../utils/svg.js'

  import {
    type AlternateImage,
    type AlternateImageWithMetadata,
    type Sizes,
    CANVAS_SIZE,
  } from './types.js'
  import {
    checkAlternateImagesMetadata,
    generateBreakpoints,
    generateSizesString,
    generateSrcset,
    generateWebpSrcset,
    getImageWithMetadata,
    isImageWithMetaData,
    renderBlurHash,
  } from './utils.js'

  interface Props {
    imageUrlBuilder: ImageUrlBuilder
    image?: RawImage | ImageWithMetadata
    alternateImages?: AlternateImage[]

    align?: 'top' | 'center' | 'bottom'
    contain?: boolean
    cropRatio?: number
    lazy?: boolean
    maxHeight?: string
    sizes?: Sizes
  }

  let {
    image,
    imageUrlBuilder,
    alternateImages,
    sizes,
    cropRatio,
    contain = false,
    align = 'top',
    maxHeight,
    lazy = true,
  }: Props = $props()

  let canvas: HTMLCanvasElement | undefined = $state()
  let imageWithMetadata: ImageWithMetadata | undefined = $state(
    isImageWithMetaData(image) ? image : undefined,
  )

  let alternateImagesWithMetadata: AlternateImageWithMetadata[] | undefined = $state(
    !checkAlternateImagesMetadata(alternateImages) ? undefined : alternateImages,
  )

  // Default loaded to true and set to false on mount, just in case javascript is disabled.
  let loaded = $state(true)
  const onLoad = () => {
    loaded = true
  }

  let {
    alt,
    svgMarkup,
    metadata: { blurHash, dimensions: { aspectRatio, width, height } = {}, extension } = {},
  } = $derived<ImageWithMetadata | Record<string, undefined>>(imageWithMetadata ?? {})

  let urlBuilder = $derived(imageWithMetadata && imageUrlBuilder.image(imageWithMetadata))
  let src = $derived(urlBuilder?.url())
  let sizesString = $derived(generateSizesString(sizes))
  let breakpoints = $derived(width ? generateBreakpoints(width) : [])
  let croppedHeight = $derived(cropRatio && width ? Math.floor(width / cropRatio) : height)

  let imgAttributes = $derived({
    class: contain ? 'contain' : 'cover',
    decoding: 'async' as const,
    height: croppedHeight,
    loading: lazy ? ('lazy' as const) : undefined,
    sizes: sizesString,
    src,
    srcset: generateSrcset(urlBuilder, breakpoints, cropRatio),
    width: width,
  })

  $effect(() => {
    if (image && !isImageWithMetaData(image)) {
      getImageWithMetadata(image, imageUrlBuilder).then((image) => {
        imageWithMetadata = image
      })
    }
  })

  $effect(() => {
    if (alternateImages && !checkAlternateImagesMetadata(alternateImages)) {
      Promise.all(
        alternateImages.map(async (alternateImage) => {
          if (alternateImage.image) {
            return {
              ...alternateImage,
              image: await getImageWithMetadata(alternateImage.image, imageUrlBuilder),
            }
          }

          return alternateImage
        }),
      )

      getImageWithMetadata(image, imageUrlBuilder).then((image) => {
        imageWithMetadata = image
      })
    }
  })

  onMount(() => {
    if (extension !== SVG) {
      loaded = false
      renderBlurHash(canvas, blurHash)
    }
  })
</script>

{#if image}
  <div class="image-wrapper" style="height: {maxHeight ?? '100%'};" style:--align={align}>
    {#if extension === SVG && svgMarkup}
      <!-- eslint-disable-next-line svelte/no-at-html-tags -->
      {@html svgMarkup}
    {:else}
      <canvas
        bind:this={canvas}
        class:loaded
        width={CANVAS_SIZE}
        height={CANVAS_SIZE}
        style={contain ? `aspect-ratio: ${cropRatio || aspectRatio}` : 'height: 100%'}
      ></canvas>
      <picture>
        {#if alternateImagesWithMetadata}
          {#each alternateImagesWithMetadata as { maxWidth, image: alternateImage, cropRatio }}
            {@const width = alternateImage?.metadata.dimensions.width}
            <source
              type="image/webp"
              media="(max-width: {maxWidth})"
              srcset={generateWebpSrcset(
                alternateImage ? imageUrlBuilder.image(alternateImage) : urlBuilder,
                width ? generateBreakpoints(width) : [],
                cropRatio,
              )}
            />
          {/each}
        {/if}
        <source
          type="image/webp"
          srcset={generateWebpSrcset(urlBuilder, breakpoints, cropRatio)}
          sizes={sizesString}
        />
        <img {alt} {...imgAttributes} onload={onLoad} class:loaded />
      </picture>
    {/if}
  </div>
{/if}

<style>
  .image-wrapper {
    position: relative;
    overflow: hidden;
  }

  canvas {
    position: absolute;
    z-index: -1;
    width: 100%;
    height: 100%;
    transition: opacity var(--image-fade-transition-speed, 0.2s) ease-in;

    &.loaded {
      opacity: 0;
    }
  }

  img {
    width: 100%;
    height: 100%;
    opacity: 0;
    transition: opacity var(--image-fade-transition-speed, 0.2s) ease-in;

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
