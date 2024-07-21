import React from 'react'
import { Flex, Stack, Text } from '@sanity/ui'

interface SupportDetailsProps {
  level: 'standard' | 'premium'
}

export function SupportDetails({ level }: SupportDetailsProps) {
  const criticalResponse = level === 'standard' ? '3 days' : '12 hours'
  const criticalResolution = level === 'standard' ? '5 days' : '24 hours'

  const nonCriticalResponse = level === 'standard' ? '7 days' : '3 days'
  const nonCriticalResolution = level === 'standard' ? '10 days' : '5 days'

  return (
    <Stack space={3} marginTop={3}>
      <Text>
        <Flex gap={1}>
          <strong>Critical issues:</strong>
          <span>
            response in {criticalResponse}, resolution in {criticalResolution}.
          </span>
        </Flex>
      </Text>
      <Text>
        <Flex gap={1}>
          <strong>Non-critical issues:</strong>
          <span>
            response in {nonCriticalResponse}, resolution in{' '}
            {nonCriticalResolution}.
          </span>
        </Flex>
      </Text>
    </Stack>
  )
}
