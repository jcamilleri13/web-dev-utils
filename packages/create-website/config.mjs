export default {
  'svelte-kit': {
    githubSrc: 'sveltejs/kit/packages/create-svelte/templates/skeleton',
    remove: [
      '.ignore',
      '.meta.json',
      'package.template.json',
      '/static/favicon.png',
    ],
    replace: ['package.json', 'src/config.js'],
    packageManager: 'npm',
    dependencies: ['@sanity/client', 'nodemailer'],
    devDependencies: [
      '@beyonk/gdpr-cookie-consent-banner',
      '@james-camilleri/sanity-web-image',
      '@poppanator/sveltekit-svg',
      '@portabletext/svelte',
      '@rollup/plugin-replace',
      '@sveltejs/adapter-auto@next',
      '@sveltejs/kit@next',
      '@typescript-eslint/eslint-plugin',
      '@typescript-eslint/parser',
      'env-cmd',
      'eslint-config-prettier',
      'eslint-plugin-svelte3',
      'eslint',
      'prettier-plugin-svelte',
      'prettier',
      'sass',
      'svelte-check',
      'svelte-inline-svg',
      'svelte-preprocess',
      'svelte',
      'tslib',
      'typescript',
    ],
  },
  sanity: {
    replace: [
      'package.json',
      'netlify/functions/optimise-image.ts',
      'netlify/functions/update-image-metadata.ts',
    ],
    packageManager: 'yarn',
    dependencies: [
      '@james-camilleri/replace-sanity-favicon',
      '@james-camilleri/sanity-web-image',
      '@james-camilleri/slack-logger',
      '@netlify/functions',
    ],
  },
}
