'use strict';

const js = require('@eslint/js');

module.exports = [
  js.configs.recommended,
  {
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'commonjs',
      globals: {
        require: 'readonly',
        module: 'readonly',
        process: 'readonly',
        console: 'readonly',
        __dirname: 'readonly',
      },
    },
    rules: {
      'no-unused-vars': ['error', { argsIgnorePattern: '^next$' }],
    },
  },
  {
    files: ['tests/**/*.test.js'],
    languageOptions: {
      globals: {
        describe: 'readonly',
        it: 'readonly',
        test: 'readonly',
        expect: 'readonly',
         beforeAll: 'readonly',
         beforeEach: 'readonly',
         afterAll: 'readonly',
         afterEach: 'readonly',
         jest: 'readonly',
      },
    },
  },
];
