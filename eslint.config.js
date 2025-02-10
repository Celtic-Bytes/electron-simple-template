import pluginJs from '@eslint/js';
import eslintConfigPrettier from 'eslint-config-prettier';
import pluginReact from 'eslint-plugin-react';
import globals from 'globals';
import tseslint from 'typescript-eslint';

/** @type {import('eslint').Linter.Config[]} */
export default [
  {
    files: ['**/*.{js,mjs,cjs,ts,jsx,tsx}'],
    languageOptions: { globals: { ...globals.browser, ...globals.node } },
    settings: {
      react: {
        version: 'detect',
      },
    },
  },

  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  pluginReact.configs.flat.recommended,
  pluginReact.configs.flat['jsx-runtime'],
  eslintConfigPrettier,
  {
    // https://eslint.org/docs/latest/use/configure/configuration-files#excluding-files-with-ignores
    // https://eslint.org/docs/latest/use/configure/ignore
    ignores: [
      'node_modules/**',
      'dist/**',
      'release/**',
      '.gitignore',
      'clean.cjs',
      'watcher.mjs',
    ],
  },
  {
    rules: {
      '@typescript-eslint/no-explicit-any': ['warn'],
      '@typescript-eslint/no-unused-vars': 'warn',
      'no-unused-vars': ['off'],
      'prefer-const': ['warn'],
    },
  },
];
