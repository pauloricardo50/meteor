const fs = require('fs');
const path = require('path');

//
// CURRENT STATE OF ESLINT @ e-Potek
// 11 November 2019
//
// Removed prettier as a formatter from vscode, to format dierectly with eslint
// this is now called an "autofix", and not a format.
// There are several issues related to prettier and eslint, the major one
// being the incompatibility between eslint@6 and prettier-eslint
// https://github.com/prettier/prettier-vscode/issues/870
// https://github.com/prettier/prettier-vscode/issues/958
// https://github.com/prettier/prettier-eslint/issues/222
//
// Got some inspiration from react-boilerplate and looked at their setup
// They are importing the prettier config, as done below

const prettierOptions = JSON.parse(
  fs.readFileSync(path.resolve(__dirname, '.prettierrc'), 'utf8')
);

module.exports = {
  parser: 'babel-eslint',
  parserOptions: {
    ecmaVersion: 6,
    ecmaFeatures: { jsx: true },
  },
  extends: [
    'airbnb',
    'prettier',
    'prettier/react',
    'plugin:meteor/recommended',
    'plugin:react/recommended',
    'plugin:flowtype/recommended',
    'plugin:cypress/recommended',
  ],
  plugins: [
    'prettier',
    'import',
    'jsx-a11y',
    'meteor',
    'react',
    'react-hooks',
    'flowtype',
    'cypress',
  ],
  env: {
    es6: true,
    node: true,
    browser: true,
    // 'cypress/globals': true,
  },
  globals: {},
  settings: {
    flowtype: {
      onlyFilesWithFlowAnnotation: true,
    },
    react: {
      version: 'detect',
    },
    linkComponents: [
      // Components used as alternatives to <a> for linking, eg. <Link to={ url } />
      { name: 'Link', linkAttribute: 'to' },
    ],
  },
  rules: {
    // Setup prettier through eslint, instead of as a formatter in vscode
    'prettier/prettier': ['error', prettierOptions],

    // eslint default rules
    'class-methods-use-this': 0,
    indent: [
      1,
      2,
      {
        SwitchCase: 1,
      },
    ],
    'max-len': 0,
    'no-underscore-dangle': 0,
    // The most sane value, allows objects to stay on a single line if possible
    'object-curly-newline': ['error', { multiline: true, consistent: true }],
    'object-property-newline': [
      'error',
      { allowMultiplePropertiesPerLine: true },
    ],
    'multiline-ternary': ['error', 'always-multiline'],
    'no-debugger': 0,
    'no-nested-ternary': 0,
    'newline-per-chained-call': [2, { ignoreChainWithDepth: 3 }],
    'prefer-arrow-callback': 0,
    'arrow-parens': ['error', 'as-needed'],
    'prefer-destructuring': [
      'error',
      {
        VariableDeclarator: {
          array: true,
          object: true,
        },
        AssignmentExpression: {
          array: true,
          object: false,
        },
      },
      {
        enforceForRenamedProperties: false,
      },
    ],

    // UPDATE: This math issue appears to be fixed, try it out for a while
    // and then remove these comments
    // Use "functions"  instead of "all" to avoid this issue:
    // https://github.com/prettier/prettier-eslint/issues/180
    // 'no-extra-parens': [
    //   'error',
    //   'functions',
    //   { nestedBinaryExpressions: false },
    // ],
    'no-mixed-operators': ['error', { allowSamePrecedence: false }],
    // function-paren-newline is conflicting with max-len. so disable it
    // no fix planned: https://github.com/eslint/eslint/issues/9411
    'function-paren-newline': 0,
    'implicit-arrow-linebreak': 0,
    'func-names': 0,
    curly: 'error',
    'global-require': 0,
    'consistent-return': 0,
    // They're very useful for confirming things, and much more performant than Dialogs
    'no-alert': 0,

    // eslint-plugin-import rules

    // Good rule, but requires too many exceptions:
    // * core/ module (any any imports in core/, because no good package.json)
    // * /imports modules
    // * meteor/* modules
    'import/no-unresolved': 0,
    // This rule also complains about /imports
    'import/no-absolute-path': 0,
    // Keep an eye on this issue for a fix that allows this rule to be turned
    // on for meteor packages:
    // https://github.com/benmosher/eslint-plugin-import/issues/479
    'import/no-extraneous-dependencies': 0,
    // FIXME: Require extensions for all files except .js and .jsx
    // this rule is being worked on:
    // https://github.com/benmosher/eslint-plugin-import/issues/984
    'import/extensions': 0,
    // This rule is annoying when you are thinking about extending a file, so
    // you don't export default even with a single export
    'import/prefer-default-export': 0,
    // When you wrap a module in a container before exporting you cannot access
    // the original module during tests.
    // So for testing, importing the same module as named is helpful
    'import/no-named-as-default': 0,

    // eslint-plugin-jsx-a11y rules

    // Adding onClick handlers on non-buttons is useful
    'jsx-a11y/no-static-element-interactions': 0,

    'jsx-a11y/click-events-have-key-events': 0,
    'jsx-a11y/anchor-is-valid': 0,
    'jsx-a11y/no-noninteractive-element-interactions': 0,
    'jsx-a11y/label-has-for': [
      2,
      {
        components: ['Label'],
        required: { every: ['id'] },
        allowChildren: false,
      },
    ],

    // eslint-plugin-react rules

    // Lots of objects are being passed around in this repo,
    // this rule makes it inconvenient to do that
    'react/forbid-prop-types': 0,
    'react/sort-prop-types': [
      'error',
      {
        callbacksLast: false,
        ignoreCase: true,
        requiredFirst: false,
        sortShapeProp: false,
      },
    ],
    // Causes bugs: https://github.com/yannickcr/eslint-plugin-react/issues/1775
    // And not always practical
    'react/jsx-one-expression-per-line': [2, { allow: 'single-child' }],
    'react/display-name': 0,
    'react/no-multi-comp': 0,
    'react/sort-comp': [
      2,
      { order: ['lifecycle', 'static-methods', 'everything-else', 'render'] },
    ],

    // Session makes perfect sense sometimes and we can use it with cookies easily
    'meteor/no-session': 0,
    'max-classes-per-file': 0,
  },
};
