import { fixupPluginRules } from '@eslint/compat'
import js from '@eslint/js'
import prettier from 'eslint-config-prettier'
import importPlugin from 'eslint-plugin-import'
import globals from 'globals'
import ts from 'typescript-eslint'

// TODO: Migrate "@sanity/eslint-config-studio" to new flat structure.

/** @type {import('eslint').Linter.Config[]} */
export default [
  js.configs.recommended,
  ...ts.configs.recommendedTypeChecked,

  {
    ignores: ['.netlify/', '.sanity/', 'build/', 'dist/'],
  },

  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
  },

  {
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

  prettier,
]
