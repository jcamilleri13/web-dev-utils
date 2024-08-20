export default {
  _shared: {
    devDependencies: ['groq'],
  },
  'svelte-kit': {
    githubSrc: 'sveltejs/kit/packages/create-svelte/templates/skeleton',
    remove: ['.ignore', '.meta.json', 'package.template.json', 'static/favicon.png'],
    replace: ['.env', 'package.json', 'src/config.js'],
    dependencies: [],
    devDependencies: [
      '@eslint/compat',
      '@fortawesome/fontawesome-free',
      '@james-camilleri/sanity-web-image',
      '@james-camilleri/type-scale',
      '@poppanator/sveltekit-svg',
      '@portabletext/svelte',
      '@portabletext/types',
      '@rollup/plugin-replace',
      '@sveltejs/adapter-auto',
      '@sveltejs/kit',
      '@sveltejs/vite-plugin-svelte',
      '@types/eslint',
      'eslint-config-prettier',
      'eslint-plugin-import',
      'eslint-plugin-svelte',
      'eslint',
      'globals',
      'lorem-ipsum',
      'postcss-html',
      'prettier-plugin-svelte',
      'prettier',
      'sanitize.css',
      'sass',
      'stylelint-config-html',
      'stylelint-config-prettier-scss',
      'stylelint-config-recess-order',
      'stylelint-config-sass-guidelines',
      'stylelint-config-standard-scss',
      'stylelint-order',
      'stylelint',
      'svelte-check',
      'svelte-inline-svg',
      'svelte-loading-spinners',
      'svelte',
      'tslib',
      'typescript-eslint',
      'typescript',
      'vite',
    ],
  },
  sanity: {
    replace: [
      '.env',
      'package.json',
      'netlify/functions/optimise-image.ts',
      'netlify/functions/update-image-metadata.ts',
      'scripts/clean-assets.js',
      'scripts/generate-breakpoints.js',
    ],
    dependencies: [
      '@james-camilleri/replace-sanity-favicon',
      '@james-camilleri/sanity-web-image',
      '@james-camilleri/logger',
      '@sanity/client',
      '@sanity/vision',
      'react-dom',
      'react-icons',
      'react-is',
      'react',
      'sanity',
      'styled-components',
    ],
    devDependencies: [
      '@eslint/compat',
      '@netlify/functions',
      '@sanity/eslint-config-studio',
      '@types/eslint',
      'eslint-config-prettier',
      'eslint-plugin-import',
      'eslint',
      'globals',
      'prettier',
      'typescript-eslint',
      'typescript',
    ],
  },
}
