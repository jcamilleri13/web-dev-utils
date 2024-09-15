<script lang="ts">
  import type { ContactFormSchema } from './schema'
  import type { Infer, SuperValidated } from 'sveltekit-superforms'

  import { superForm } from 'sveltekit-superforms'

  import Input from '$lib/components/form/Input.svelte'
  import StateButton, { STATE, type State } from '$lib/components/form/StateButton.svelte'
  import Grid from '$lib/components/layout/Grid.svelte'

  interface Props {
    data: SuperValidated<Infer<ContactFormSchema>>
  }

  let { data }: Props = $props()

  const { form, constraints, errors, allErrors, submitting, delayed, timeout, message, enhance } =
    superForm(data)
  let state: State = $state(STATE.IDLE)

  $effect(() => {
    if ($delayed) {
      state = STATE.WAITING
    }

    if (($allErrors.length && !$submitting) || $timeout || $message?.valid === false) {
      state = STATE.ERROR
      setTimeout(() => (state = STATE.IDLE), 5000)
    }

    if ($message?.valid) {
      state = STATE.SUCCESS
      setTimeout(() => (state = STATE.IDLE), 5000)
    }
  })
</script>

<form method="POST" action="/form/contact" name="contact" use:enhance>
  <Grid>
    <Input
      name="name"
      optional={!$constraints.name?.required}
      errors={$errors.name}
      bind:value={$form.name}
    />
    <Input
      name="email"
      type="email"
      optional={!$constraints.email?.required}
      errors={$errors.email}
      bind:value={$form.email}
    />
    <Input
      name="subject"
      optional={!$constraints.subject?.required}
      errors={$errors.subject}
      bind:value={$form.subject}
    />
    <Input
      name="message"
      type="textarea"
      optional={!$constraints.message?.required}
      errors={$errors.message}
      bind:value={$form.message}
    />

    <StateButton
      big
      type="submit"
      {state}
      messages={{
        [STATE.WAITING]: 'Sending',
        [STATE.ERROR]: 'Error sending message',
        [STATE.SUCCESS]: 'Message sent successfully',
      }}>Submit</StateButton
    >
  </Grid>
</form>
