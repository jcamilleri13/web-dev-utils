<script lang="ts">
  import type { PageData } from './$types'

  import Grid from '$lib/components/layout/Grid.svelte'
  import ContactForm from '$lib/forms/contact/ContactForm.svelte'

  let { data }: { data: PageData } = $props()
</script>

<Grid>
  <ContactForm background="white" data={data.form} />
</Grid>
