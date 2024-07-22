import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

export default defineConfig({
  plugins: [react()],
  build: {
    lib: {
      entry: './src/index.ts',
      formats: ['es'],
      fileName: 'dashboard',
    },

    // TODO: This isn't bundling correctly, the dist folder is over 4mb.
    rollupOptions: {
      external: [
        '@sanity/ui',
        'react',
        'react/jsx-runtime',
        'react-dom',
        'styled-components',
      ],
      output: {
        globals: {
          react: 'react',
          'react-dom': 'ReactDOM',
          'react/jsx-runtime': 'react/jsx-runtime',
        },
      },
    },
  },
})
