import js from '@eslint/js';
import eslintConfigPrettier from 'eslint-config-prettier/flat';
import pluginImport from 'eslint-plugin-import';
import pluginReact from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import { defineConfig } from 'eslint/config';
import globals from 'globals';
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import tseslint from 'typescript-eslint';

const __dirname = dirname(fileURLToPath(import.meta.url));

export default defineConfig([
  {
    files: ['**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    // https://eslint.org/docs/latest/use/configure/configuration-files#excluding-files-with-ignores
    // https://eslint.org/docs/latest/use/configure/ignore
    ignores: ['**/dist/**', '**/release/**', '**/node_modules/**'],
    plugins: { js, import: pluginImport },
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs['recommended-latest'],
      pluginReact.configs.flat.recommended,
      pluginReact.configs.flat['jsx-runtime'],
      eslintConfigPrettier,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: { ...globals.browser, ...globals.node },
      parserOptions: {
        // Explicitly set tsconfigRootDir to avoid ambiguity in monorepo
        tsconfigRootDir: __dirname,
      },
    },
    settings: {
      react: {
        version: 'detect',
      },
      'import/resolver': {
        typescript: {
          project: [
            './tsconfig.json',
            'packages/*/tsconfig.json',
            'apps/*/tsconfig.json',
          ],
        },
        node: true,
      },
    },
    rules: {
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-unused-vars': 'warn',
      'import/no-unresolved': 'error',
      'no-unused-vars': ['off'],
      'prefer-const': ['warn'],
    },
  },
]);
