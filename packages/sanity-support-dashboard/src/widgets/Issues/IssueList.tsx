import { Flex, Box, Stack, Badge, Text } from '@sanity/ui'
import React from 'react'
import { Issue } from '../../types'

interface IssueListProps {
  issues: Issue[]
}

export function IssueList({ issues }: IssueListProps) {
  return (
    <Flex direction="column">
      {issues.map((issue, i) => {
        return (
          <Box
            key={issue.id}
            paddingBottom={i !== issues.length - 1 ? 4 : undefined}
            marginBottom={i !== issues.length - 1 ? 4 : undefined}
            style={
              i !== issues.length - 1
                ? { borderBottom: 'solid 0.5px var(--card-border-color)' }
                : undefined
            }
          >
            <Flex justify="space-between">
              <Stack space={3}>
                <Text
                  size={2}
                  style={{
                    textDecoration:
                      issue.state === 'closed'
                        ? 'line-through var(--card-code-fg-color)'
                        : undefined,
                  }}
                >
                  {issue.title}
                </Text>
                <Text
                  size={1}
                  style={{
                    fontStyle: 'italic',
                    color: 'var(--card-icon-color)',
                    marginTop: '0.2em',
                  }}
                >
                  {issue.state === 'open' ? 'opened' : 'closed'}{' '}
                  {issue.state === 'open'
                    ? new Date(issue.created_at).toLocaleDateString()
                    : new Date(issue.created_at).toLocaleDateString()}
                </Text>
              </Stack>
              <Stack>
                {issue.labels.includes('bug') && (
                  <Badge tone="critical">bug</Badge>
                )}
                {issue.labels.includes('enhancement') && (
                  <Badge tone="positive">enhancement</Badge>
                )}
              </Stack>
            </Flex>
          </Box>
        )
      })}
    </Flex>
  )
}
