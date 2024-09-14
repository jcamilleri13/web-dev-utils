import svg from '@poppanator/sveltekit-svg'
import replace from '@rollup/plugin-replace'
import { sveltekit } from '@sveltejs/kit/vite'

const BREAKPOINTS = {
  sm: '30em',
  md: '70em',
  lg: '100em',
}

const BREAKPOINT_STRINGS = Object.entries(BREAKPOINTS).reduce(
  (replaceConfig, [breakpoint, width]) => ({
    ...replaceConfig,
    [`__breakpoint-${breakpoint}__`]: width,
  }),
  {},
)

/** @type {import('vite').UserConfig} */
const config = {
  plugins: [
    sveltekit(),
    replace({
      values: BREAKPOINT_STRINGS,
      preventAssignment: true,
    }),
    svg({
      svgoOptions: {
        plugins: [
          {
            name: 'preset-default',
            params: {
              overrides: {
                removeTitle: false,
                removeViewBox: false,
              },
            },
          },
        ],
      },
    }),
  ],
}

export default config
