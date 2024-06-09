import { Badge, Button, Card, Flex, Stack, Text } from '@sanity/ui'
import {
  formatDate,
  differenceInCalendarDays,
  differenceInCalendarWeeks,
} from 'date-fns'
import React from 'react'
import { HelpCircleIcon } from '@sanity/icons'

interface SupportWidgetProps {
  expiry?: string
  level: 'none' | 'standard' | 'premium'
}

function formatTimeRemaining(expiryDate: Date) {
  const today = new Date()
  // const expiryDate = addDays(expiry, 1)

  const differenceInWeeks = differenceInCalendarWeeks(expiryDate, today)
  const differenceInDays =
    differenceInCalendarDays(expiryDate, today) - differenceInWeeks * 7

  const differenceInWeeksString =
    differenceInWeeks > 0
      ? `${differenceInWeeks} week${differenceInWeeks > 1 ? 's' : ''}`
      : undefined

  const differenceInDaysString =
    differenceInDays > 0
      ? `${differenceInDays} day${differenceInDays > 1 ? 's' : ''}`
      : undefined

  return [differenceInWeeksString, differenceInDaysString]
    .filter(Boolean)
    .join(', ')
}

export function SupportWidget(props: SupportWidgetProps) {
  const { expiry, level } = props

  const hasExpiry = !!(expiry?.length && expiry.length > 0)
  const expiryDate = hasExpiry && new Date(expiry)
  const hasSupport = level !== 'none'

  const today = new Date()
  const daysTillExpiry =
    hasSupport && expiryDate ? differenceInCalendarDays(expiryDate, today) : 0
  const supportExpired = daysTillExpiry <= 0

  const formattedTimeRemaining = expiryDate
    ? formatTimeRemaining(expiryDate)
    : ''

  const levelTone =
    level === 'none' ? 'default' : level === 'standard' ? 'primary' : 'positive'

  const daysTillExpiryTone =
    daysTillExpiry <= 7
      ? 'critical'
      : daysTillExpiry <= 180
      ? 'caution'
      : 'positive'

  return (
    <Card border padding={4}>
      <Stack space={3}>
        <Flex justify="space-between" align="center">
          <Text>Support level</Text>
          <Badge tone={levelTone}>{level.toUpperCase()}</Badge>
        </Flex>
        {hasSupport && expiryDate && (
          <Flex justify="space-between" align="center">
            <Text>Support valid until</Text>
            <Flex gap={2} align="center">
              <Text>{formatDate(expiryDate, 'dd/MM/yyyy')}</Text>
              <Badge tone={daysTillExpiryTone}>
                {supportExpired
                  ? 'EXPIRED'
                  : `${formattedTimeRemaining} remaining`}
              </Badge>
            </Flex>
          </Flex>
        )}
        {hasSupport && (
          <Card marginTop={2}>
            <Button
              disabled={!hasSupport || supportExpired}
              fontSize={16}
              href="mailto:support@james.mt"
              icon={HelpCircleIcon}
              mode="ghost"
              padding={4}
              text="Open support ticket"
              width="fill"
            />
          </Card>
        )}
      </Stack>
    </Card>
  )
}
