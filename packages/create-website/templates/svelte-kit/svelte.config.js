import path from 'path'

import svg from '@poppanator/sveltekit-svg'
import replace from '@rollup/plugin-replace'
import adapter from '@sveltejs/adapter-auto'
import preprocess from 'svelte-preprocess'

import CONFIG from './src/config.js'

const BREAKPOINT_STRINGS = Object.entries(CONFIG.BREAKPOINTS).reduce(
  (replaceConfig, [breakpoint, width]) => ({
    ...replaceConfig,
    [`__breakpoint-${breakpoint}__`]: width,
  }),
  {},
)

/** @type {import('@sveltejs/kit').Config} */
const config = {
  // Consult https://github.com/sveltejs/svelte-preprocess
  // for more information about preprocessors
  preprocess: preprocess(),

  kit: {
    adapter: adapter(),
    // hydrate the <div id="svelte"> element in src/app.html
    target: '#svelte',
    vite: {
      plugins: [
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
      resolve: {
        alias: {
          $assets: path.resolve('./src/assets'),
        },
      },
    },
  },
}

export default config
