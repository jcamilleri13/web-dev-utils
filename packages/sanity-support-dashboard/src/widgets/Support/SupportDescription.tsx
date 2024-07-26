import { Flex, Stack, Text } from '@sanity/ui'
import React from 'react'

import { SUPPORT_LEVEL } from '../../types'

interface SupportDescriptionProps {
  level: SUPPORT_LEVEL
}

export function SupportDescription({ level }: SupportDescriptionProps) {
  const criticalResponse =
    level === SUPPORT_LEVEL.PREMIUM ? '12 hours' : '3 days'
  const criticalResolution =
    level === SUPPORT_LEVEL.PREMIUM ? '24 hours' : '5 days'

  const nonCriticalResponse =
    level === SUPPORT_LEVEL.PREMIUM ? '3 days' : '7 days'
  const nonCriticalResolution =
    level === SUPPORT_LEVEL.PREMIUM ? '5 days' : '10 days'

  return (
    <Text>
      <Stack>
        <Flex gap={1}>
          <strong>Critical issues:</strong>
          <span>
            response in {criticalResponse}, resolution in {criticalResolution}.
          </span>
        </Flex>
        <Flex gap={1}>
          <strong>Non-critical issues: </strong>
          <span>
            response in {nonCriticalResponse}, resolution in{' '}
            {nonCriticalResolution}.
          </span>
        </Flex>
      </Stack>
    </Text>
  )
}
