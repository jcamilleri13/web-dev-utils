import { addDays, addMonths } from 'date-fns'
import { SupportWidget } from '../src/widgets/Support'

export default {
  title: 'Widgets/Support',
  component: SupportWidget,
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
  tags: ['autodocs'],
  argTypes: {
    expiry: 'date',
  },
  parameters: {
    // More on how to position stories at: https://storybook.js.org/docs/configure/story-layout
    layout: 'fullscreen',
  },
}

export const Standard = {
  args: {
    expiry: addMonths(new Date(), 6).toISOString().slice(0, 10),
    level: 'standard',
  },
}

export const Premium = {
  args: {
    expiry: addMonths(new Date(), 6).toISOString().slice(0, 10),
    level: 'premium',
  },
}

export const CloseToExpiry = {
  args: {
    expiry: addDays(new Date(), 100).toISOString().slice(0, 10),
    level: 'standard',
  },
}

export const ExpiringImminently = {
  args: {
    expiry: addDays(new Date(), 3).toISOString().slice(0, 10),
    level: 'standard',
  },
}

export const Expired = {
  args: {
    expiry: addDays(new Date(), -2).toISOString().slice(0, 10),
    level: 'standard',
  },
}

export const None = {
  args: {
    level: 'none',
  },
}
