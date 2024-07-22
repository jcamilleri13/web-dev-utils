import { IssuesWidget } from '../src/widgets/Issues'

export default {
  title: 'Widgets/Issues',
  component: IssuesWidget,
  tags: ['autodocs'],
  argTypes: {
    issues: 'object',
  },
  parameters: {
    layout: 'fullscreen',
  },
}

export const Default = {
  args: {
    issues: [
      {
        closed_at: null,
        created_at: '2024-07-18T09:56:14Z',
        id: 2415915489,
        labels: ['enhancement', 'size: large', 'client dashboard'],
        state: 'open',
        title: 'Generate sitemap for SEO',
      },
      {
        closed_at: '2024-07-18T09:56:14Z',
        created_at: '2023-09-07T19:53:32Z',
        id: 1886484405,
        labels: ['bug', 'size: medium', 'client dashboard'],
        state: 'closed',
        title:
          'Courses & Practise Groups over 2 time zones display incorrect times',
      },
    ],
  },
}
