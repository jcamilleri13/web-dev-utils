<script lang="ts">
  import Title from '$lib/components/global/Title.svelte'
  import FullWidth from '$lib/components/layout/FullWidth.svelte'
  import Grid from '$lib/components/layout/Grid.svelte'
  import LoremIpsum from '$lib/components/prototyping/LoremIpsum.svelte'
  import Placeholder from '$lib/components/prototyping/Placeholder.svelte'
  import Transition from '$lib/components/transition/Transition.svelte'

  import CONFIG from '$lib/config'
</script>

<Title text={CONFIG.GENERAL.siteTitle} />
<Grid>
  <Transition order={1}>
    <LoremIpsum sentences={2} />
  </Transition>
  <FullWidth>
    <Transition order={0}>
      <Placeholder height={400} />
    </Transition>
  </FullWidth>
  <Grid columns={2}>
    <LoremIpsum paragraphs={5} />
    <Placeholder caption="An image" />
  </Grid>
  <Grid columns={[3, 2, 1]}>
    {#each new Array(3) as _, i}
      <Grid>
        <Placeholder caption="Another image" height={350} />
        <LoremIpsum paragraphs={3 - i} />
      </Grid>
    {/each}
  </Grid>
</Grid>
