import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import dts from 'vite-plugin-dts'

export default defineConfig({
  plugins: [react(), dts({ rollupTypes: true, insertTypesEntry: true })],
  build: {
    lib: {
      entry: {
        dashboard: './src/index.ts',
        functions: './src/functions/index.ts',
      },
      formats: ['es'],
    },

    rollupOptions: {
      external: [
        '@sanity/ui',
        'react',
        'react/jsx-runtime',
        'react-dom',
        'sanity',
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
