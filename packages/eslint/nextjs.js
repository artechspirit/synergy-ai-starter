// @ts-check
const base = require('./base');
const { FlatCompat } = require('@eslint/eslintrc');

const compat = new FlatCompat();

/** @type {import("eslint").Linter.Config[]} */
const config = [
  ...base,
  ...compat.extends('next/core-web-vitals'),
  {
    rules: {
      // No direct img tags — use Next.js Image
      '@next/next/no-img-element': 'error',
    },
  },
];

module.exports = config;
