<script lang="ts">
  import Exclamation from '@fortawesome/fontawesome-free/svgs/solid/circle-exclamation.svg?component'
  import { fade } from 'svelte/transition'

  import FormGroup from './FormGroup.svelte'

  interface Props {
    name: string
    label?: string
    hint?: string
    type?: string
    pattern?: string
    value?: string
    optional?: boolean
    disabled?: boolean
    width?: 'short' | 'long' | 'full'
    errors?: string[]
  }

  let {
    name,
    label,
    hint,
    type = 'text',
    pattern,
    value = $bindable(),
    optional = false,
    disabled = false,
    width = 'short',
    errors = [],
  }: Props = $props()

  let errorText = $derived(errors[0])

  const id = `input-${Math.random().toString().split('.')[1]}`
  if (!name) throw new Error(`Input ${id} requires a name`)

  const capitalise = (string: string) => {
    return `${string.slice(0, 1).toLocaleUpperCase()}${string.slice(1)}`
  }
</script>

<FormGroup {width}>
  <div class="label-wrapper">
    <label for={id}>{label ?? capitalise(name)}</label>
    {#if optional}<span class="optional">optional</span>{/if}
    {#if hint}<span class="hint">{hint}</span>{/if}
    {#if errorText}
      <span class="error">
        <span class="error-icon">
          <Exclamation />
        </span>
        <span in:fade class="error-text">{errorText}</span>
      </span>
    {/if}
  </div>

  {#if type === 'textarea'}
    <textarea
      {id}
      {name}
      {disabled}
      aria-invalid={errorText ? 'true' : undefined}
      style={errorText ? '--border-colour: var(--error)' : ''}
      bind:value
    ></textarea>
  {:else}
    <input
      {id}
      {name}
      {type}
      {pattern}
      {disabled}
      aria-invalid={errorText ? 'true' : undefined}
      style={errorText ? '--border-colour: var(--error)' : ''}
      bind:value
    />
  {/if}
</FormGroup>

<style>
  textarea {
    max-height: 200px;
  }

  input,
  textarea {
    padding: var(--xxs) var(--xs);
    border: 0;
    border-radius: var(--border-radius);
    outline: none;
    box-shadow: 0 0 0 var(--border-width) var(--border-colour);
    transition: box-shadow var(--transition-fast) ease-in-out;

    &:focus,
    &:hover {
      box-shadow: 0 0 0 var(--border-width) var(--primary);
    }
  }

  label {
    margin-inline-end: var(--xxs);
  }

  .label-wrapper {
    display: flex;
    gap: var(--xs);
    align-items: center;
  }

  .optional {
    padding: 0.1rem 0.3rem;
    margin-inline-start: var(--xs);
    font-size: 0.8em;
    color: var(--background);
    text-transform: uppercase;
    background: var(--neutral);
  }

  .hint {
    font-size: 0.9em;
    color: var(--neutral);
  }

  .error {
    display: flex;
    align-items: center;
  }

  .error-text {
    font-size: 0.9em;
    font-weight: bold;
    color: var(--error);
  }

  .error-icon {
    height: 0.9em;
    margin-inline-end: var(--xxs);
    color: var(--error);

    :global(svg) {
      vertical-align: top;
    }
  }
</style>
