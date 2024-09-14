import type { Meta, StoryObj } from '@storybook/svelte'

import { createRawSnippet } from 'svelte'

import Button from '../Button.svelte'

const meta = {
  title: 'Button',
  component: Button,
  argTypes: {
    children: { table: { disable: true } },
  },
} satisfies Meta<Button>

export default meta
type Story = StoryObj<typeof meta>

const children = createRawSnippet(() => ({ render: () => `Button` }))

export const Primary: Story = {
  args: {
    primary: true,
    children,
  },
}

export const Secondary: Story = {
  args: {
    primary: false,
    children,
  },
}

export const Big: Story = {
  args: {
    primary: true,
    big: true,
    children,
  },
}
