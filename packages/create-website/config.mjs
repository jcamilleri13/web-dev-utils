export default {
  'svelte-kit': {
    githubSrc: 'sveltejs/kit/packages/create-svelte/templates/skeleton',
    remove: ['.ignore', '.meta.json', 'package.template.json', '/static/favicon.png'],
    dependencies: ['@sanity/client', 'nodemailer'],
    devDependencies: [
      '@poppanator/sveltekit-svg',
      '@portabletext/svelte',
      '@rollup/plugin-replace',
      'env-cmd',
      'sass',
      'svelte-inline-svg',
    ],
  },
  sanity: {
    dependencies: [
      '@james-camilleri/replace-sanity-favicon',
      '@james-camilleri/sanity-web-image',
      '@james-camilleri/slack-logger',
      '@netlify/functions',
    ],
  },
}
