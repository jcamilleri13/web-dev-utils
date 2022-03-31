<script lang="ts" context="module">
  export type Validation = (value: string) => string | undefined

  export interface FieldInfo {
    name: string
    label?: string
    hint?: string
    type: typeof SvelteComponent | string
    value: string | boolean | undefined
    validations?: Validation[]
    valid?: boolean
  }
</script>

<script lang="ts">
  import type { SvelteComponent } from 'svelte'
  import Checkbox from './Checkbox.svelte'
  import Input from './Input.svelte'

  export let validate = false
  export let fieldInfo: FieldInfo[] = []
</script>

{#each fieldInfo as field}
  {#if typeof field.type !== 'string'}
    <svelte:component
      this={field.type}
      {...field}
      {validate}
      bind:value={field.value}
      bind:valid={field.valid}
    />
  {:else if field.type === 'checkbox'}
    <Checkbox
      {...field}
      {validate}
      bind:value={field.value}
      bind:valid={field.valid}
    />
  {:else}
    <Input
      {...field}
      {validate}
      bind:value={field.value}
      bind:valid={field.valid}
    />
  {/if}
{/each}
