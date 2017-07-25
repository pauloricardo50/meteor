module.exports = function (wallaby) {
  return {
    debug: false,
    testFramework: 'jest',
    files: [
      { pattern: './jest.config.js', instrumenting: false },
      { pattern: 'imports/**/*.js*' },
      { pattern: '!imports/**/*.spec.js' },
    ],
    tests: [{ pattern: 'imports/**/*.spec.js' }],
    compilers: {
      '**/*.js*': wallaby.compilers.babel(),
    },
    env: {
      type: 'node',
      runner: 'node',
    },
    setup: () => {
      const jestConfig = require('./jest.config.js'); // eslint-disable-line global-require
      jestConfig.globals = { __DEV__: true };
      wallaby.testFramework.configure(jestConfig);
    },
  };
};
