<script lang="ts">
  import { fade } from  'svelte/transition'
</script>

<div in:fade="{{ duration: 70, delay: 70 }}" out:fade="{{ duration: 70 }}">
  <slot />
</div>
