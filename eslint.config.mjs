import js from '@eslint/js'
import { fixupPluginRules } from '@eslint/compat'
import jsxA11y from 'eslint-plugin-jsx-a11y'
import importX from 'eslint-plugin-import-x'
import reactCompiler from 'eslint-plugin-react-compiler'
import reactHooks from 'eslint-plugin-react-hooks'
import eslintReact from '@eslint-react/eslint-plugin'
import eslintConfigPrettier from 'eslint-config-prettier'
import tseslint from 'typescript-eslint'

export default tseslint.config(
  // --- Ignored files ---
  {
    ignores: ['dist/', '.tanstack/', '.vinxi/', 'src/routeTree.gen.ts'],
  },

  // --- JS + TypeScript base ---
  js.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,
  {
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },

  // --- React (@eslint-react — native ESLint 10 support) ---
  // Replaces eslint-plugin-react which does not yet support ESLint 10
  eslintReact.configs['recommended-typescript'],

  // --- React Hooks (wrapped via @eslint/compat for ESLint 10 compatibility) ---
  {
    plugins: { 'react-hooks': fixupPluginRules(reactHooks) },
    rules: reactHooks.configs['recommended-latest'].rules,
  },

  // --- Accessibility (wrapped via @eslint/compat for ESLint 10 compatibility) ---
  {
    plugins: { 'jsx-a11y': fixupPluginRules(jsxA11y) },
    rules: jsxA11y.flatConfigs.recommended.rules,
  },

  // --- Import ordering + validation (native ESLint 10 support) ---
  // Only use recommended (not .typescript) — TypeScript already validates module resolution
  importX.flatConfigs.recommended,
  {
    rules: {
      // TypeScript handles module resolution — disable redundant checks
      'import-x/no-unresolved': 'off',
      'import-x/namespace': 'off',
      'import-x/order': [
        'error',
        {
          groups: [
            'builtin',
            'external',
            'internal',
            'parent',
            'sibling',
            'index',
          ],
          'newlines-between': 'always',
          alphabetize: { order: 'asc', caseInsensitive: true },
        },
      ],
    },
  },

  // --- React Compiler (warns when code can't be optimized) ---
  {
    plugins: { 'react-compiler': reactCompiler },
    rules: {
      'react-compiler/react-compiler': 'warn',
    },
  },

  // --- Essencium custom rules ---
  {
    rules: {
      // General
      'no-console': 'warn',
      'no-shadow': 'off',
      'prefer-arrow-callback': 'error',
      'arrow-body-style': ['error', 'as-needed'],

      // TypeScript — strict typing enforcement
      '@typescript-eslint/no-shadow': 'error',
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/explicit-function-return-type': [
        'error',
        { allowExpressions: true, allowTypedFunctionExpressions: true },
      ],
    },
  },

  // --- Prettier (must be last — disables conflicting formatting rules) ---
  eslintConfigPrettier,
)
