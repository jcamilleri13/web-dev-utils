import { addMonths } from 'date-fns'
import { SupportDashboard } from '../src/plugin/SupportDashboard'

export default {
  title: 'Support Dashboard',
  component: SupportDashboard,
  // // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
  // tags: ['autodocs'],
  // argTypes: {
  //   expiry: 'date',
  // },
  parameters: {
    // More on how to position stories at: https://storybook.js.org/docs/configure/story-layout
    layout: 'fullscreen',
  },
}

export const Dashboard = {
  args: {
    tool: {
      options: {
        expiry: addMonths(new Date(), 6).toISOString().slice(0, 10),
        level: 'standard',
      },
    }
  },
}
