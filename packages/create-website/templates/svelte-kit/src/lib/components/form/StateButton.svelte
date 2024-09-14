<script lang="ts" context="module">
  export const STATE = {
    IDLE: 'idle',
    WAITING: 'waiting',
    ERROR: 'error',
    SUCCESS: 'success',
  } as const

  export type State = (typeof STATE)[keyof typeof STATE]

  export interface StatusMessages {
    [STATE.WAITING]?: string
    [STATE.ERROR]?: string
    [STATE.SUCCESS]?: string
  }
</script>

<script lang="ts">
  import type { ComponentProps } from 'svelte'

  import Check from '@fortawesome/fontawesome-free/svgs/solid/circle-check.svg'
  import Exclamation from '@fortawesome/fontawesome-free/svgs/solid/circle-exclamation.svg'
  import { scale } from 'svelte/transition'
  import { Jumper } from 'svelte-loading-spinners'

  import Button from './Button.svelte'

  interface Props extends ComponentProps<Button> {
    state?: State
    messages?: StatusMessages
  }

  let { state = STATE.IDLE, messages = {}, children, onclick, ...props }: Props = $props()
</script>

<Button
  {...props}
  success={state === STATE.SUCCESS}
  danger={state === STATE.ERROR}
  onclick={state === STATE.WAITING ? undefined : onclick}
>
  {#if state === STATE.WAITING}
    <span class="icon" transition:scale>
      <Jumper size="1.5" unit="em" color="currentColor" duration="1s" />
    </span>
  {/if}
  {#if state === STATE.SUCCESS}
    <span class="icon" transition:scale>
      <Check />
    </span>
  {/if}
  {#if state === STATE.ERROR}
    <span class="icon" transition:scale>
      <Exclamation />
    </span>
  {/if}

  {#if state === STATE.IDLE || !messages[state]}
    {@render children()}
  {:else}
    {messages[state]}
  {/if}
</Button>

<style>
  .icon {
    height: 1em;
    margin-inline-start: var(--xs);

    :global(svg) {
      vertical-align: baseline;
    }
  }
</style>
