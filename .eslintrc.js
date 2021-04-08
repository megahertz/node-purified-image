'use strict';

module.exports = {
  extends: 'airbnb-base/legacy',
  env: {
    es6: true,
    jasmine: true,
    node: true,
  },

  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'script',
  },

  rules: {
    'comma-dangle': [2, {
      arrays: 'always-multiline',
      objects: 'always-multiline',
      imports: 'always-multiline',
      exports: 'always-multiline',
      functions: 'never',
    }],
    'max-classes-per-file': 0,
    'max-len': [2, { code: 80 }],
    'no-param-reassign': 0,
    'no-return-assign': 0,
    'no-underscore-dangle': 0,
    'no-use-before-define': 0,
    strict: [2, 'global'],
  },
};
