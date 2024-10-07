import js from '@eslint/js'
import prettier from 'eslint-config-prettier'
import importPlugin from 'eslint-plugin-import'
import svelte from 'eslint-plugin-svelte'
import globals from 'globals'
import ts from 'typescript-eslint'

/** @type {import('eslint').Linter.Config[]} */
export default [
  {
    name: 'files',
    files: ['**/*.ts'],
  },
  {
    name: 'ignores',
    ignores: ['.netlify/', '.sanity/', 'build/', 'dist/'],
  },

  {
    name: 'language options',
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },
      parserOptions: {
        project: true,
        tsconfigRootDir: process.cwd(),
      },
    },
    settings: {
      'import/resolver': {
        typescript: {},
      },
    },
  },

  js.configs.recommended,
  ...ts.configs.recommendedTypeChecked,
  ...svelte.configs['flat/recommended'],

  {
    name: 'disable type-checked',
    files: ['**/*.js', '**/*.svelte', '.storybook/**'],
    ...ts.configs.disableTypeChecked,
  },

  { name: 'import/recommended', ...importPlugin.flatConfigs.recommended },
  { name: 'import/typescript', ...importPlugin.flatConfigs.typescript },

  {
    name: 'import',
    rules: {
      'import/order': [
        'error',
        {
          alphabetize: {
            order: 'asc',
            orderImportKind: 'asc',
          },

          // Sort the imported statements into groups.
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

          // Sort imported members,
          // i.e. the bits in between {} in "import { a, b, c } from 'my-module".
          named: {
            enabled: true,
            types: 'types-first',
          },

          'newlines-between': 'always',
        },
      ],
    },
  },

  {
    name: 'custom rules',
    rules: {
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          args: 'all',
          argsIgnorePattern: '^_',
          vars: 'all',
          varsIgnorePattern: '^_',
          destructuredArrayIgnorePattern: '^_',
          ignoreRestSiblings: true,
        },
      ],
    },
  },

  { name: 'prettier', ...prettier },
]
