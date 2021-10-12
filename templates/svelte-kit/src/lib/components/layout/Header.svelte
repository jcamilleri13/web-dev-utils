<script lang="ts">
  // import Logo from '../../../assets/images/logo.svg'
  import Navigation from './Navigation/index.svelte'
</script>

<header>
  <div class="wrapper">
    <a class="logo" href="/" tabindex="-1">
      <!-- <Logo /> -->
    </a>
    <Navigation />
  </div>
</header>

<style lang="scss">
  @use '../../../styles/breakpoints';

  header {
    position: sticky;
    top: 0;
    margin-block-end: var(--gutter);
  }

  .wrapper {
    display: flex;
    justify-content: space-between;

    padding: var(--md) 0;
    margin: 0 var(--gutter);
  }

  .logo {
    display: block;
    width: 100%;
    max-height: 5rem;

    &:hover { background: none; }

    @media (min-width: breakpoints.$md) { max-width: 100px; }
  }
</style>
