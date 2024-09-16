<script lang="ts" module>
  import { type Args, defineMeta, setTemplate } from '@storybook/addon-svelte-csf'

  import StateButton, { STATE } from '../StateButton.svelte'

  const { Story } = defineMeta({
    title: 'State Button',
    component: StateButton,
  })
</script>

<script>
  setTemplate(stateButtonTemplate)
</script>

{#snippet stateButtonTemplate(args: Args<typeof Story>)}
  <StateButton {...args}>Button</StateButton>
{/snippet}

<Story name="Idle" args={{ state: STATE.IDLE }} />
<Story name="Waiting" args={{ state: STATE.WAITING }} />
<Story name="Success" args={{ state: STATE.SUCCESS }} />
<Story name="Error" args={{ state: STATE.ERROR }} />
