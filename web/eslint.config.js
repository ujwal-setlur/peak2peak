// eslint.config.js
import astroPlugin from 'eslint-plugin-astro';
import astroParser from 'astro-eslint-parser'; // Add this import
import reactPlugin from 'eslint-plugin-react';
import jsxA11yPlugin from 'eslint-plugin-jsx-a11y';
import tailwindPlugin from 'eslint-plugin-tailwindcss';
import prettierPlugin from 'eslint-plugin-prettier';
import airbnbConfig from 'eslint-config-airbnb';
import prettierConfig from 'eslint-config-prettier';
import globals from 'globals';

export default [
  {
    ignores: ['node_modules/**', 'dist/**', '.astro/**'],
  },
  {
    files: ['**/*.{js,jsx,ts,tsx,astro}'],
    languageOptions: {
      ecmaVersion: 2021,
      sourceType: 'module',
      globals: {
        ...globals.browser,
      },
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    plugins: {
      astro: astroPlugin,
      react: reactPlugin,
      'jsx-a11y': jsxA11yPlugin,
      tailwindcss: tailwindPlugin,
      prettier: prettierPlugin,
    },
    rules: {
      ...airbnbConfig.rules,
      ...prettierConfig.rules,
      'react/prop-types': 'off',
      'tailwindcss/classnames-order': 'warn',
      'prettier/prettier': ['error', {}, { usePrettierrc: true }],
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
  },
  {
    files: ['**/*.astro'],
    languageOptions: {
      parser: astroParser, // Set the Astro parser
    },
    processor: astroPlugin.processors['client-side-ts'],
    rules: {
      ...astroPlugin.configs.recommended.rules,
    },
  },
  {
    files: ['**/*.jsx', '**/*.tsx'],
    rules: {
      'react/react-in-jsx-scope': 'off',
    },
  },
];
