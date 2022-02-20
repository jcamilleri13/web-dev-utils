<script lang="ts">
  export let columns: number | Array<number | string> = 1
  export let repeat: number | string = null
  export let stackAt = 'sm'

  if (!Array.isArray(columns)) columns = Array(columns).fill(1)

  let cssColumns = repeat
    ? `repeat(auto-fit, minmax(min(${repeat}${
        typeof repeat == 'number' ? 'rem' : ''
      }, 100%), 1fr))`
    : columns
        .map((ratio) => (typeof ratio === 'number' ? `${ratio}fr` : ratio))
        .join(' ')
</script>

<div class={`grid ${stackAt}`} style="--columns: {cssColumns}">
  <slot />
</div>

<style lang="scss">
  @use '../../../styles/breakpoints';

  .grid {
    --space: var(--gutter);

    display: grid;
    gap: var(--space);
    margin-bottom: var(--space);

    &.sm {
      @media (min-width: breakpoints.$md) {
        grid-template-columns: var(--columns);
      }
    }

    &.md {
      @media (min-width: breakpoints.$lg) {
        grid-template-columns: var(--columns);
      }
    }

    @media (min-width: breakpoints.$lg) {
      --space: var(--xl);
    }
  }
</style>
