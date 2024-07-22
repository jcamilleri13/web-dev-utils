import { Box, Card, Heading, Stack, Text } from '@sanity/ui'
import React from 'react'

import { Issue } from '../../types'

interface IssuesWidgetProps {
  issues: Issue[]
}

export function IssuesWidget(props: IssuesWidgetProps) {
  const { issues } = props

  return (
    <Card border padding={4}>
      <Stack space={3}>
        <Box marginBottom={2}>
          <Heading as="h2" size={2}>
            Pending Issues
          </Heading>
        </Box>
        <Text>Coming soon.</Text>
      </Stack>
    </Card>
  )
}
