import type { Meta, StoryObj } from '@storybook/svelte'

import Input from '../Input.svelte'

const meta = {
  title: 'Input',
  component: Input,
} satisfies Meta<Input>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    name: 'input',
  },
}

export const Disabled: Story = {
  args: {
    name: 'input',
    disabled: true,
    value: 'some text',
  },
}

export const TextArea: Story = {
  args: {
    name: 'input',
    type: 'textarea',
  },
}
