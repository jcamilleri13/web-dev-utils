import { ElementQuery, Grid, Text } from '@sanity/ui'
import React from 'react'
import { Tool } from 'sanity'
import styled from 'styled-components'

import { SupportDetails } from '../types'
import { IssuesWidget } from '../widgets/Issues'
import { SupportWidget } from '../widgets/Support'

const GridSizing = styled.div`
  & > div {
    grid-template-columns: 1fr;
  }

  [data-eq-min~='2'] > & > div {
    grid-template-columns: 1fr 1fr;
  }

  [data-eq-min~='3'] > & > div {
    grid-template-columns: 2fr 1fr;
  }
`
interface SupportDashboardProps {
  tool: Tool<SupportDetails>
}

export function SupportDashboard(props: SupportDashboardProps) {
  const supportDetails = props.tool.options

  if (!supportDetails) {
    return <Text>Error in support dashboard configuration.</Text>
  }

  return (
    <ElementQuery>
      <GridSizing>
        <Grid gap={3} padding={4}>
          <IssuesWidget />
          <SupportWidget {...supportDetails} />
        </Grid>
      </GridSizing>
    </ElementQuery>
  )
}
