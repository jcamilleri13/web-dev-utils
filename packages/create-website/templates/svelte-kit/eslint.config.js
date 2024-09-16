import { fixupPluginRules } from '@eslint/compat'
import js from '@eslint/js'
import prettier from 'eslint-config-prettier'
import importPlugin from 'eslint-plugin-import'
import svelte from 'eslint-plugin-svelte'
import globals from 'globals'
import svelteParser from 'svelte-eslint-parser'
import ts from 'typescript-eslint'

/** @type {import('eslint').Linter.Config[]} */
export default [
  {
    name: 'files',
    files: ['**/*.svelte', '**/*.ts'],
  },
  {
    name: 'ignores',
    ignores: ['.netlify/', '.svelte-kit/', 'build/', 'dist/'],
  },

  {
    name: 'language options',
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },
      parser: svelteParser,
      parserOptions: {
        project: true,
        parser: ts.parser,
        tsconfigRootDir: import.meta.dirname,
        extraFileExtensions: ['.svelte'],
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

  {
    name: 'import',
    plugins: {
      import: fixupPluginRules(importPlugin),
    },
    rules: {
      'import/order': [
        'error',
        {
          alphabetize: {
            order: 'asc',
            orderImportKind: 'asc',
          },

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
          // TODO: Enable this when the change is merged to `eslint-plugin-import`.
          // named: {
          //     enabled: true,
          //     types: 'types-first'
          // },

          'newlines-between': 'always',
        },
      ],
      // TODO: Remove this once the eslint-plugin-import change is merged.
      'sort-imports': [
        'error',
        {
          ignoreDeclarationSort: true,
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
  ...svelte.configs['flat/prettier'],
]
