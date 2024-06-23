/** @type { import("eslint").Linter.Config } */
module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:svelte/recommended',
		'prettier'
  ],
  plugins: ['@typescript-eslint', 'import'],
  parserOptions: {
		sourceType: 'module',
		ecmaVersion: 2020,
		extraFileExtensions: ['.svelte']
	},
  env: {
    browser: true,
    es2017: true,
    node: true,
  },
  overrides: [
		{
			files: ['*.svelte'],
			parser: 'svelte-eslint-parser',
			parserOptions: {
				parser: '@typescript-eslint/parser'
			}
		}
	]
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
