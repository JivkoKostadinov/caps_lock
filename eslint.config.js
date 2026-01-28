// @ts-check
import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import prettierConfig from 'eslint-config-prettier';

export default tseslint.config(
  // Base ESLint recommended rules
  eslint.configs.recommended,

  // TypeScript-ESLint recommended rules
  ...tseslint.configs.recommended,

  // Prettier config to disable conflicting rules
  prettierConfig,

  // Custom configuration
  {
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },

  // Ignore patterns
  {
    ignores: [
      '**/node_modules/**',
      '**/dist/**',
      '**/build/**',
      '**/*.js', // Ignore JS files if you only want to lint TS
    ],
  },
);
