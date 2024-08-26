<script lang="ts">
  import '../styles/global.scss'

  import type { PageData } from './$types'

  import { setContext } from 'svelte'

  import Footer from '$lib/components/global/Footer.svelte'
  import Header from '$lib/components/global/Header.svelte'
  import CONFIG from '$lib/config'

  setContext('CONFIG', CONFIG)

  export let data: PageData



  // Trigger CSS view transitions.
  onNavigate((navigation) => {
    if (!document.startViewTransition) return

    return new Promise((resolve) => {
      document.startViewTransition(async () => {
        resolve()
        await navigation.complete
      })
    })
  })
</script>

<div class="grid">
  <Header />
  <main>
      <slot />
  </main>
  <Footer />
</div>

<style>
  .grid {
    display: grid;
    grid-template-rows: auto 1fr auto;
    height: 100vh;
    overflow-x: hidden;
    overflow-y: auto;
  }

  main {
    position: relative;
    margin: 0 var(--gutter);
  }
</style>
