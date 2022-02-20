<script lang="ts" context="module">
  import type { LoadInput } from '@sveltejs/kit'

  export const load = async ({ url }: LoadInput) => ({ props: { url } })
</script>

<script lang="ts">
  import '../styles/global.scss'

  import Header from '$lib/components/global/Header.svelte'
  import Footer from '$lib/components/global/Footer.svelte'
  import PageTransition from '$lib/components/transition/PageTransition.svelte'

  export let url: URL
</script>

<div class="grid">
  <Header />
  <main>
    <PageTransition {url}>
      <slot />
    </PageTransition>
  </main>
  <Footer />
</div>

<style>
  .grid {
    display: grid;
    grid-template-rows: auto 1fr auto;
    height: 100vh;
    overflow: auto;
  }

  main {
    position: relative;
    margin: 0 var(--gutter);
  }
</style>
