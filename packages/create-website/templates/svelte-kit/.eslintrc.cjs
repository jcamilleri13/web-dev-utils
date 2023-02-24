module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended'],
  plugins: ['svelte3', '@typescript-eslint', 'import'],
  ignorePatterns: ['*.cjs'],
  overrides: [{ files: ['*.svelte'], processor: 'svelte3/svelte3' }],
  settings: {
    'svelte3/typescript': () => require('typescript'),
  },
  parserOptions: {
    sourceType: 'module',
    ecmaVersion: 2019,
  },
  env: {
    browser: true,
    es2017: true,
    node: true,
  },
  rules: {
    'import/order': [
      'error',
      {
        alphabetize: { order: 'asc', orderImportKind: 'asc' },
        groups: [
          'type',
          'builtin',
          'external',
          'internal',
          'unknown',
          'parent',
          'sibling',
          'index',
          'object',
        ],
        'newlines-between': 'always',
      },
    ],
  },
}
