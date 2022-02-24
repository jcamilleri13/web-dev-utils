<script lang="ts">
  import { createEventDispatcher } from 'svelte'

  export let primary = false
  export let info = false
  export let success = false
  export let danger = false
  export let error = false

  // Avoid using disabled buttons.
  // https://gerireid.com/forms.html#buttons
  export let disabled = false

  export let linkTo: string = null

  const dispatch = createEventDispatcher()
  const onClick = (e) => dispatch('click', e)
</script>

{#if linkTo}
  <a
    class:disabled
    class:primary
    class:info
    class:success
    class:danger={danger || error}
    href={disabled ? '' : linkTo}
    tabindex={disabled ? -1 : null}
  >
    <slot />
  </a>
{:else}
  <button
    {disabled}
    class:disabled
    class:primary
    class:info
    class:success
    class:danger={danger || error}
    on:click={onClick}
    type="button"
  >
    <slot />
  </button>
{/if}

<style lang="scss">
  a,
  button {
    --colour: var(--background);
    --background-colour: var(--neutral);
    --highlight-colour: var(--foreground);
    --highlight-background-colour: var(--background);
    --active-colour: var(--foreground);
    --active-background-colour: var(--background);

    display: flex;
    padding: var(--sm) var(--md);

    // The button should be in a grid, so this
    // ensures it doesn't fill the entire width.
    margin-inline-end: auto;

    font-weight: bold;
    color: var(--colour);
    text-decoration: none;
    cursor: pointer;
    background-color: var(--background-colour);
    border: 0;
    outline: none;
    box-shadow: none;
    transition: color var(--transition-fast) ease-in-out,
      background-color var(--transition-fast) ease-in-out,
      box-shadow var(--transition-fast) ease-in-out;

    // TODO: Remember to always style hover, active, and focus styles!

    &:active:not(:disabled):not(.disabled) {
      color: var(--active-colour);
      background-color: var(--active-background-colour);
      box-shadow: 0 0 0 var(--border-width) var(--background-colour);
    }

    &:hover:not(:active):not(:disabled):not(.disabled),
    &:focus:not(:active):not(:disabled):not(.disabled) {
      color: var(--highlight-colour);
      box-shadow: 0 0 0 var(--border-width) var(--highlight-colour);
    }

    // This mainly kicks in after a button is clicked.
    // Remove the focus effect once the mouse moves away.
    &:focus:not(:focus-visible):not(:hover):not(:active) {
      color: var(--colour);
      box-shadow: none;
    }

    &.disabled {
      --colour: var(--foreground);
      --background-colour: var(--neutral);
      --highlight-colour: var(--foreground);
      --highlight-background-colour: var(--highlight-colour);

      cursor: not-allowed;
      box-shadow: none;
      opacity: 0.8;
    }

    &.primary {
      --colour: var(--background);
      --active-colour: var(--primary);
      --background-colour: var(--primary);
    }

    &.info {
      --colour: var(--background);
      --active-colour: var(--info);
      --background-colour: var(--info);
    }

    &.success {
      --colour: var(--background);
      --active-colour: var(--success);
      --background-colour: var(--success);
    }

    &.danger {
      --colour: var(--background);
      --active-colour: var(--error);
      --background-colour: var(--error);
    }
  }
</style>
