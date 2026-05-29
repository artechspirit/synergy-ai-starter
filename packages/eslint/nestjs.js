// @ts-check
const base = require('./base');

/** @type {import("eslint").Linter.Config[]} */
const config = [
  ...base,
  {
    rules: {
      // NestJS often uses parameter decorators — relax this rule
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
    },
  },
];

module.exports = config;
