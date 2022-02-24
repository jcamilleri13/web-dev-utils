<script lang="ts" context="module">
  import { get } from '$lib/utils/get'
  import { PAGES } from '$lib/types/pages'

  export const prerender = true

  // export async function load({ fetch }) {
  //   return {
  //     props: {
  //       page: await get.page(PAGES.CONTACT, fetch),
  //     },
  //   }
  // }
</script>

<script lang="ts">
  import { tick } from 'svelte'

  import Grid from '$lib/components/layout/Grid.svelte'
  import Input from '$lib/components/form/Input.svelte'
  import StateButton, {
    State,
    STATE,
  } from '$lib/components/form/StateButton.svelte'
  import Title from '$lib/components/global/Title.svelte'
  import Transition from '$lib/components/transition/Transition.svelte'

  // Taken from https://stackoverflow.com/questions/201323/how-can-i-validate-an-email-address-using-a-regular-expression.
  const EMAIL_REGEX =
    /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/
  const RESET_TIMEOUT = 5000

  let form: HTMLFormElement
  let formState: State
  let submitted

  let fields = [
    {
      name: 'name',
      value: '',
      valid: undefined,
    },
    {
      name: 'email',
      type: 'email',
      value: '',
      validations: [
        (value) => !EMAIL_REGEX.test(value) && 'Enter a valid email address',
      ],
      valid: undefined,
    },
    {
      name: 'subject',
      value: '',
      valid: undefined,
    },
    {
      name: 'message',
      type: 'textarea',
      value: '',
      valid: undefined,
    },
  ]

  async function submit(e) {
    e.preventDefault()

    // Stop multiple submissions.
    if (formState === STATE.WAITING) return

    submitted = true
    await tick() // Await validation before attempting submit.
    if (fields.filter(({ valid }) => !valid).length) return

    formState = STATE.WAITING
    const response = await fetch('/contact/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(Object.fromEntries(new FormData(form).entries())),
    })

    formState = response.ok ? STATE.SUCCESS : STATE.ERROR
    setTimeout(() => {
      formState = STATE.IDLE
    }, RESET_TIMEOUT)

    if (response.ok) {
      fields = fields.map((field) => ({ ...field, value: '' }))
      submitted = false
    }
  }
</script>

<Title text="Contact us" />

<div class="grid">
  <Transition order={0}>
    <form bind:this={form} name="contact">
      <Grid>
        {#each fields as field}
          <Input
            {...field}
            validate={submitted}
            bind:value={field.value}
            bind:valid={field.valid}
          />
        {/each}
        <StateButton
          on:click={submit}
          state={formState}
          messages={{
            [STATE.WAITING]: 'Submitting',
            [STATE.ERROR]: 'Error submitting message',
            [STATE.SUCCESS]: 'Submitted',
          }}>Submit</StateButton
        >
      </Grid>
    </form>
  </Transition>
</div>
