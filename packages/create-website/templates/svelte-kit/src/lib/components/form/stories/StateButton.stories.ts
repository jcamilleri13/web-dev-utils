import type { Meta, StoryObj } from '@storybook/svelte'

import { createRawSnippet } from 'svelte'

import StateButton, { STATE } from '../StateButton.svelte'

const meta = {
  title: 'State Button',
  component: StateButton,
  argTypes: {
    children: { table: { disable: true } },
  },
} satisfies Meta<StateButton>

export default meta
type Story = StoryObj<typeof meta>

const children = createRawSnippet(() => ({ render: () => `Button` }))

export const Idle: Story = {
  args: {
    children,
    state: STATE.IDLE,
  },
}

export const Waiting: Story = {
  args: {
    children,
    state: STATE.WAITING,
  },
}

export const Success: Story = {
  args: {
    children,
    state: STATE.SUCCESS,
  },
}

export const Error: Story = {
  args: {
    children,
    state: STATE.ERROR,
  },
}
