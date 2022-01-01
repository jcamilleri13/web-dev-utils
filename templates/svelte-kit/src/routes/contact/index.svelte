<script context="module">
	export const prerender = true;
</script>

<script lang="ts">
  import Alert from '$lib/components/forms/Alert.svelte'
  import Button from '$lib/components/forms/Button.svelte'
  import Input from '$lib/components/forms/Input.svelte'
  import PageTransition from '$lib/components/PageTransition.svelte'
  import Telephone from '$lib/components/Telephone.svelte'
  import TextArea from '$lib/components/forms/TextArea.svelte'
  import Title from '$lib/components/Title.svelte'

  let name: string
  let email: string
  let subject: string
  let message: string

  let form
  let alertVisible = false
  let alertState

  let disabled
  $: disabled = !(email !== '' && subject !== '' && message !== '')

  async function submit (e) {
    e.preventDefault()

    const formData = new FormData(form)

    const response = await fetch('/contact-us/submit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      // FormData.entries() is not in Typescript definitions.
      body: JSON.stringify(Object.fromEntries((formData as any).entries()))
    })

    alertState = response.ok ? 'success' : 'error'
    alertVisible = true

    if (response.ok) {
      name = ''
      email = ''
      subject = ''
      message = ''
    }

    setTimeout(() => { alertVisible = false }, 5000)
  }
</script>

<PageTransition>
  <Title titlePrefix="The Voice Explained" text="Get in Touch" />

  <div class="grid">
    <form bind:this={form} class="contact-form" name="contact">
      <Input name="name" bind:value={name} />
      <Input name="email" type="email" required bind:value={email} />
      <Input name="subject" required bind:value={subject} />
      <TextArea name="message" required bind:value={message} />
      <p><small>Fields marked with an asterisk (*) are required.</small></p>
      <div class="flex">
        <Button {disabled} input="button" on:click={submit}>submit</Button>
        <Alert
          state={alertState}
          visible={alertVisible}
          messages={{
            success: 'Your message was submitted successfully',
            error: 'There was an issue submitting your message, please try again',
            warning: null,
            info: null
          }}
        />
      </div>
    </form>
    <div class="contact-details">
      <a href="tel:+44 (0) 7957 272554">+44 (0) 7957 272554</a>
    </div>
  </div>

  <div class="telephone">
    <Telephone seed={message} />
  </div>
</PageTransition>

<style lang="scss">
  @use '../../styles/config';

  .grid {
    display: grid;
    grid-template-columns: 1fr;
    grid-gap: var(--gutter);

    @media (min-width: config.$breakpoint-md) {
      margin: 0 auto;
      max-width: 1000px;
      grid-gap: calc(var(--xxl) * 2);

      > * { margin: 0 var(--xxl) }
    }
  }

  .contact-details {
    margin-bottom: var(--lg);

    font-size: var(--xxl);
    font-weight: 600;
    text-align: center;

    > a { text-decoration: none; }
  }

  .telephone {
    &::before {
      position: absolute;
      width: var(--border-thickness);
      height: 100vh;
      top: -99vh;
      right: 15px;
      background: var(--primary);
      content: "";
    }

    position: fixed;
    bottom: 7rem;
    right: var(--xxl);
    width: 100px;
    opacity: 0.8;
    z-index: -1;
  }
</style>
