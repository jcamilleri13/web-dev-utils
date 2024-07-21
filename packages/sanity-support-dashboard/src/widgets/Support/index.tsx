import { Badge, Button, Card, Flex, Stack, Text } from '@sanity/ui'
import {
  formatDate,
  differenceInCalendarDays,
  differenceInCalendarWeeks,
} from 'date-fns'
import React, { useCallback, useState } from 'react'
import { AddDocumentIcon, CloseIcon, HelpCircleIcon } from '@sanity/icons'
import { SupportDetails } from './SupportDetails'

interface SupportWidgetProps {
  expiry?: string
  level: 'none' | 'standard' | 'premium'
}

function formatTimeRemaining(expiryDate: Date) {
  const today = new Date()

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

  const [detailsVisible, setDetailsVisible] = useState(false)
  const onDetailsToggle = useCallback(
    () => setDetailsVisible((visible) => !visible),
    [],
  )

  return (
    <Card border padding={4}>
      <Stack space={3}>
        <Flex justify="space-between" align="center">
          <Text>Support level</Text>
          <Flex gap={2}>
            <Badge tone={levelTone}>{level.toUpperCase()}</Badge>
            {level !== 'none' && (
              <Button
                aria-label={
                  (detailsVisible ? 'Hide' : 'Show') + ' support level details'
                }
                icon={HelpCircleIcon}
                mode="bleed"
                onClick={onDetailsToggle}
                padding={0}
              />
            )}
          </Flex>
        </Flex>
        {detailsVisible && (
          <Card
            padding={4}
            tone={level === 'standard' ? 'primary' : 'positive'}
          >
            <Stack space={2}>
              <Flex justify="space-between">
                <Text weight="bold">
                  {level === 'standard' ? 'Standard' : 'Premium'} support
                </Text>
                <Button
                  aria-label="Close"
                  icon={CloseIcon}
                  mode="bleed"
                  onClick={onDetailsToggle}
                  padding={0}
                />
              </Flex>
              {/* @ts-expect-error The (i) button for support details will never be visible if support is 'none'. */}
              <SupportDetails level={level} />
            </Stack>
          </Card>
        )}
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
              icon={AddDocumentIcon}
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
