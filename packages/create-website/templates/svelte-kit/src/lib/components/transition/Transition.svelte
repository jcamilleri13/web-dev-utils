<script lang="ts">
  import { fade } from 'svelte/transition'

  export let order = 0

  const duration = 500
  const delay = 200 * order
</script>

<div in:fade={{ duration, delay }}>
  <slot />
</div>
