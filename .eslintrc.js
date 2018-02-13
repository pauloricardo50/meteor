module.exports = {
  parser: 'babel-eslint',
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
  },
  plugins: ['import', 'jsx-a11y', 'meteor', 'react', 'prettier'],
  extends: [
    'airbnb',
    'prettier',
    'plugin:meteor/recommended',
    'plugin:react/recommended',
  ],
  env: {
    browser: true,
  },
  globals: {},
  rules: {
    // eslint default rules
    'class-methods-use-this': 'off',
    indent: [1, 2],
    'max-len': ['error', 80],
    'no-underscore-dangle': [
      'error',
      {
        // These are all meteor specific exceptions
        allow: [
          '_id',
          '_ensureIndex',
          '_verifyEmailToken',
          '_resetPasswordToken',
          '_name',
          '_execute',
        ],
      },
    ],

    // eslint-plugin-import rules

    // This lets you import modules that cannot be found which start with
    // meteor/* and /* (for /imports)
    'import/no-unresolved': ['error', { ignore: ['^meteor/', '^/'] }],
    // This rule also complains about /imports
    'import/no-absolute-path': 'off',
    // Keep an eye on this issue for a fix that allows this rule to be turned
    // on for meteor packages:
    // https://github.com/benmosher/eslint-plugin-import/issues/479
    'import/no-extraneous-dependencies': 'off',
    // Require extensions for all files except .js and .jsx
    'import/extensions': ['always', { js: 'never', jsx: 'never' }],
    // This rule is annoying when you are thinking about extending a file, so
    // you don't export default even with a single export
    'import/prefer-default-export': 'off',
    // When you wrap a module in a container before exporting you cannot access
    // the original module during tests.
    // So for testing, importing the same module as named is helpful
    'import/no-named-as-default': 'off',

    // eslint-plugin-jsx-a11y rules

    // Adding onClick handlers on non-buttons is useful
    'jsx-a11y/no-static-element-interactions': 'off',

    // eslint-plugin-react rules
    'react/forbid-prop-types': 'off',
  },
};
