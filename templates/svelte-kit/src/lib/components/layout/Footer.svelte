<script lang="ts">
  let year = (new Date()).getFullYear()
</script>

<footer>
  <div></div>
  <span>&copy; :Client Name: {year}</span>
</footer>

<style lang="scss">
  footer {
    display: flex;
    justify-content: space-between;

    margin: var(--xxl) var(--gutter) var(--sm);
    padding: var(--md) 0;
  }
</style>
