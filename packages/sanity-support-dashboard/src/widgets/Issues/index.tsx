import { Box, Card, Heading, Stack } from '@sanity/ui'
import React, { useMemo } from 'react'

import { Issue } from '../../types'
import { IssueList } from './IssueList'

interface IssuesWidgetProps {
  issues: Issue[]
}

export function IssuesWidget(props: IssuesWidgetProps) {
  const { issues } = props
  const { open, closed } = useMemo(() => {
    const groupedIssues = issues.reduce(
      (issues, issue) => {
        issue.state === 'open'
          ? issues.open.push(issue)
          : issues.closed.push(issue)

        return issues
      },
      {
        open: [] as Issue[],
        closed: [] as Issue[],
      },
    )

    groupedIssues.open.sort((a, b) => a.created_at.localeCompare(b.created_at))
    groupedIssues.closed.sort(
      (a, b) => a.closed_at?.localeCompare(b.closed_at ?? '') ?? 0,
    )

    return groupedIssues
  }, [issues])

  return (
    <Card border padding={4}>
      <Stack space={5}>
        <Stack space={3}>
          <Box marginBottom={3}>
            <Heading as="h2" size={2}>
              Pending Issues
            </Heading>
          </Box>
          <IssueList issues={open} />
        </Stack>
        {closed.length > 0 && (
          <Stack space={3}>
            <Box marginBottom={3}>
              <Heading as="h2" size={2}>
                Recently Closed Issues
              </Heading>
            </Box>
            <IssueList issues={closed} />
          </Stack>
        )}
      </Stack>
    </Card>
  )
}
