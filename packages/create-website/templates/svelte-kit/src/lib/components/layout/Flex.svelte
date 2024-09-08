<script lang="ts">
  import type { Snippet } from 'svelte'

  interface Props {
    align?: 'start' | 'end' | 'center' | 'stretch'
    children: Snippet
    column?: boolean
    gap?: string
    justify?: 'start' | 'end' | 'center' | 'space-between' | 'space-around' | 'space-evenly'
    stackAt?: 'sm' | 'md' | 'none'
    wrap?: boolean
  }

  const {
    children,
    column,
    gap = 'var(--gutter)',
    align = 'start',
    justify = 'start',
    stackAt = 'sm',
    wrap,
  }: Props = $props()
</script>

<div
  class="flex {stackAt}"
  style:--align={align}
  style:--direction={column ? 'column' : 'row'}
  style:--gap={gap}
  style:--justify={justify}
  style:--wrap={wrap ? 'wrap' : 'nowrap'}
>
  {@render children()}
</div>

<style lang="scss">
  @use '../../../styles/breakpoints';

  .flex {
    display: flex;
    flex-flow: var(--direction) var(--wrap);
    gap: var(--gap);
    align-items: var(--align);
    justify-content: var(--justify);

    &:not(.none) {
      flex-flow: column var(--wrap);
    }

    &.sm {
      @media (min-width: breakpoints.$md) {
        flex-flow: var(--direction) var(--wrap);
      }
    }

    &.md {
      @media (min-width: breakpoints.$lg) {
        flex-flow: var(--direction) var(--wrap);
      }
    }
  }
</style>
