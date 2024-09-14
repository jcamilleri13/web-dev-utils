<script lang="ts">
  import { KEYS, getContext } from '$lib/context'

  interface Props {
    title: string
    subtitle?: string
    hidden: boolean
  }

  let { title, subtitle, hidden }: Props = $props()

  const prefix = getContext(KEYS.TITLE)
</script>

<svelte:head>
  <title>{prefix ? `${prefix} – ` : ''}{title}</title>
</svelte:head>

<h1 class:screen-reader-only={hidden}>{title}</h1>
{#if subtitle}
  <h2 class:screen-reader-only={hidden}>{subtitle}</h2>
{/if}

<style>
  /* Remove default (large) spacing before subtitle. */
  h2 {
    margin-top: 0;
  }
</style>
