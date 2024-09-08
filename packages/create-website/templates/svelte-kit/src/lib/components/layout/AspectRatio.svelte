<script lang="ts">
  import type { Snippet } from 'svelte'

  interface Props {
    'aspect-ratio': string
    children?: Snippet
    'max-height'?: string
  }

  let { 'aspect-ratio': aspectRatio, children, 'max-height': maxHeight }: Props = $props()
</script>

<div class="wrapper" style:--aspect-ratio={aspectRatio} style:--max-height={maxHeight ?? '100%'}>
  <div class="aspect-ratio">
    {@render children?.()}
  </div>
</div>

<style>
  .wrapper {
    display: flex;
    justify-content: center;
  }

  .aspect-ratio {
    --clamped-width: calc(var(--max-height) * var(--aspect-ratio));

    width: min(100%, var(--clamped-width));
    aspect-ratio: var(--aspect-ratio);
  }
</style>
