import path from 'path'

import svg from '@poppanator/sveltekit-svg'
import adapter from '@sveltejs/adapter-netlify'
import preprocess from 'svelte-preprocess'

/** @type {import('@sveltejs/kit').Config} */
const config = {
  // Consult https://github.com/sveltejs/svelte-preprocess
  // for more information about preprocessors
  preprocess: preprocess({
    postcss: true
  }),

  kit: {
    adapter: adapter(),
    // hydrate the <div id="svelte"> element in src/app.html
    target: '#svelte',
    vite: {
      plugins: [svg({
        svgoOptions: {
          plugins: [
            {
              name: 'preset-default',
              params: {
                overrides: {
                  removeViewBox: false,
                },
              },
            }],
          }
      })],
      resolve: {
        alias: {
          $assets: path.resolve('./src/assets')
        }
      },
      optimizeDeps: {
        include: []
      }
    }
  }
}

export default config;
