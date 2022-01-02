<script lang="ts">
  import Header from '$lib/components/layout/Header.svelte'
  import Footer from '$lib/components/layout/Footer.svelte'
</script>

<Header />
<main><slot /></main>
<Footer />

<style lang="scss" global>
  @import '../styles/global.scss';
</style>
