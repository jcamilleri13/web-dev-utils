import { HelpCircleIcon } from '@sanity/icons'
import { definePlugin } from 'sanity'

import { SupportDetails } from '../types'

import { SupportDashboard } from './SupportDashboard'

export const supportDashboardTool = definePlugin<SupportDetails>((options) => {
  return {
    name: 'support-dashboard-tool',
    tools: [
      {
        name: 'support-dashboard',
        title: 'Support',
        component: SupportDashboard,
        options,
        icon: HelpCircleIcon,
      },
    ],
  }
})
