<script lang="ts">
  import type { Snippet } from 'svelte'
  import type { MouseEventHandler } from 'svelte/elements'

  interface Props {
    big?: boolean
    children: Snippet
    class?: string
    danger?: boolean
    info?: boolean
    linkTo?: string
    onclick?: MouseEventHandler<HTMLButtonElement>
    primary?: boolean
    small?: boolean
    stretch?: boolean
    success?: boolean
    type?: 'button' | 'submit'
  }

  let {
    big,
    children,
    class: _class,
    danger,
    info,
    linkTo,
    onclick,
    primary,
    small,
    stretch,
    success,
    type,
    ...attributes
  }: Props = $props()
</script>

<!-- This is either a button or a link, so we don't need aria roles. -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<svelte:element
  this={linkTo ? 'a' : 'button'}
  class:danger
  class:success
  class:info
  class:big
  class:small
  class:stretch
  class:primary
  class={_class}
  href={linkTo ?? undefined}
  onclick={!linkTo ? onclick : undefined}
  rel={linkTo && linkTo.startsWith('http') ? 'noopener' : undefined}
  target={linkTo && linkTo.startsWith('http') ? '_blank' : undefined}
  type={!linkTo ? type : undefined}
  {...attributes}
>
  {@render children()}
</svelte:element>

<style>
  a,
  button {
    --colour: var(--background);
    --background-colour: var(--neutral);
    --highlight-colour: var(--foreground);
    --highlight-background-colour: var(--background);
    --active-colour: var(--foreground);
    --active-background-colour: var(--background);

    display: flex;
    justify-content: center;
    justify-self: start;
    padding: var(--sm) var(--md);
    margin-inline-end: var(--xs);

    font-weight: bold;
    color: var(--colour);
    text-decoration: none;
    text-transform: inherit;
    cursor: pointer;
    background-color: var(--background-colour);
    border: 0;
    border-radius: var(--border-radius);
    outline: none;
    box-shadow: none;
    transition:
      color var(--transition-fast) ease-in-out,
      background-color var(--transition-fast) ease-in-out,
      box-shadow var(--transition-fast) ease-in-out;

    &:not(:last-child) {
      margin-inline-end: var(--xs);
    }

    &:hover,
    &:visited,
    &:active,
    &:focus {
      text-decoration: none;
    }

    /* TODO: Remember to always style hover, active, and focus styles! */

    &:active:not(:disabled, .disabled) {
      color: var(--active-colour);
      background-color: var(--active-background-colour);
      box-shadow: 0 0 0 var(--border-width) var(--background-colour);
    }

    &:hover:not(:active, :disabled, .disabled),
    &:focus:not(:active, :disabled, .disabled) {
      color: var(--highlight-colour);
      box-shadow: 0 0 0 var(--border-width) var(--highlight-colour);
    }

    /* This mainly kicks in after a button is clicked.
       Remove the focus effect once the mouse moves away. */
    &:focus:not(:focus-visible, :hover, :active) {
      color: var(--colour);
      box-shadow: none;
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

    &.big {
      width: 100%;
      padding: var(--md);
      font-size: var(--xl);
      text-align: center;
    }
  }
</style>
