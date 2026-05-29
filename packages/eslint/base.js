// @ts-check
/** @type {import("eslint").Linter.Config[]} */
const config = [
  {
    files: ['**/*.{ts,tsx,js,jsx}'],
    rules: {
      // Disallow any type
      '@typescript-eslint/no-explicit-any': 'error',
      // Disallow unused variables
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      // Disallow console.log in production code
      'no-console': ['warn', { allow: ['warn', 'error', 'info'] }],
      // Enforce consistent import ordering
      'import/order': [
        'error',
        {
          groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index'],
          'newlines-between': 'always',
          alphabetize: { order: 'asc', caseInsensitive: true },
        },
      ],
    },
  },
];

module.exports = config;
