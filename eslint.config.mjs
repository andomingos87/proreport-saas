import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: { ...require('eslint').recommendedConfig },
  eslintrc: {
    env: {
      browser: true,
      node: true,
      es6: true
    },
    ignorePatterns: ['node_modules/*'],
    parserOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module'
    }
  }
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals"),
  {
    ignores: ['**/*.config.js', '**/*.config.mjs'],
    rules: {
      '@typescript-eslint/no-unused-vars': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      'react/no-unescaped-entities': 'off',
      '@next/next/no-img-element': 'off',
      'prefer-const': 'off',
      'no-unused-vars': 'off',
      '@next/next/no-html-link-for-pages': 'off',
      'react-hooks/exhaustive-deps': 'off'
    }
  }
];

export default eslintConfig;
