// Based off `svelte-typed-context`
// https://github.com/KamenKolev/svelte-typed-context

import {
  getContext as svelteGetContext,
  hasContext as svelteHasContext,
  setContext as svelteSetContext,
} from 'svelte'

import * as KEYS from './keys'
export { KEYS }

// Provided as key to getContext and setContext in order to enable strict typing
// eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-empty-object-type
export interface ContextKey<T = unknown> {}

declare const _checked: unique symbol
interface CheckedInjectionKey<T> extends ContextKey<T> {
  [_checked]?: never
}

type getContext = {
  <T>(key: CheckedInjectionKey<T>): T
  <T>(key: ContextKey<T>): undefined | T
}
type setContext = <T>(key: ContextKey<T>, context: T) => void
type hasContext = <T>(key: ContextKey<T>) => key is CheckedInjectionKey<T>

export const getContext = svelteGetContext as getContext
export const setContext = svelteSetContext as setContext
export const hasContext = svelteHasContext as hasContext
