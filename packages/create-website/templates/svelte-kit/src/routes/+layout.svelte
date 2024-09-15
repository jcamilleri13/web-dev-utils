<script lang="ts">
  import '../styles/global.scss'

  import type { LayoutData } from './$types'
  import type { Snippet } from 'svelte'

  import { onNavigate } from '$app/navigation'
  import Footer from '$lib/components/global/Footer.svelte'
  import Header from '$lib/components/global/Header.svelte'
  import { KEYS, setContext } from '$lib/context'

  setContext(KEYS.TITLE, 'Site Title')

  let { children, data }: { children: Snippet; data: LayoutData } = $props()

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
    {@render children()}
  </main>
  <Footer />
</div>

<style>
  .grid {
    display: grid;
    grid-template-rows: auto 1fr auto;
    height: 100vh;
    overflow: hidden auto;
  }

  main {
    position: relative;
    margin: 0 var(--gutter);
  }
</style>
