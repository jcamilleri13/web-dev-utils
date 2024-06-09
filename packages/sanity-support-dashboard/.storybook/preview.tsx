// Based on https://github.com/sanity-io/ui Storybook config.

import type { Preview } from '@storybook/react'
import { themes } from '@storybook/theming'
import { DecoratorHelpers } from '@storybook/addon-themes'
import { StoryFn } from '@storybook/react'
import React from 'react'
import { createGlobalStyle } from 'styled-components'
import { Card, ThemeProvider, studioTheme } from '@sanity/ui'

const { initializeThemeState, pluckThemeFromContext, useThemeParameters } =
  DecoratorHelpers

export const GlobalStyle = createGlobalStyle`
  body,
  .docs-story {
    background-color: ${({ theme }) => theme.sanity.color.base.bg};
  }
`

const withSanityTheme = ({ themes, defaultTheme }) => {
  initializeThemeState(Object.keys(themes), defaultTheme)

  return (Story: StoryFn, context) => {
    const selectedTheme = pluckThemeFromContext(context)
    const { themeOverride } = useThemeParameters()

    const selected = themeOverride || selectedTheme || defaultTheme

    return (
      <ThemeProvider scheme={selected} theme={studioTheme}>
        <GlobalStyle />
        <Card padding={4}>
          <Story />
        </Card>
      </ThemeProvider>
    )
  }
}

const preview: Preview = {
  decorators: [
    withSanityTheme({
      themes: { light: 'light', dark: 'dark' },
      defaultTheme: 'dark',
    }),
  ],
  parameters: {
    backgrounds: { disable: true },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
    docs: {
      theme: {
        ...themes.dark,
        fontBase: 'Inter, sans-serif',
      },
    },
    layout: 'fullscreen',
  },
}

export default preview
