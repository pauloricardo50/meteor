module.exports = function (wallaby) {
  const testFilePattern = 'imports/**/*.spec.js';
  const filePattern = 'imports/**/*.js';
  console.log('wtf?');

  return {
    debug: true,
    testFramework: 'jest',
    files: [
      { pattern: './jest.config.js', load: false, instrumenting: false },
      { pattern: filePattern, load: false },
      { pattern: testFilePattern, ignore: true },
    ],
    tests: [{ pattern: testFilePattern }],
    compilers: {
      '**/*.js': wallaby.compilers.babel(),
      '**/*.jsx': wallaby.compilers.babel(),
    },
    env: {
      type: 'node',
      runner: 'node',
    },
    setup: () => {
      /* eslint global-require: 0 */
      const jestConfig = require('./jest.config.js');
      jestConfig.globals = { __DEV__: true };
      wallaby.testFramework.configure(jestConfig);
      console.log('hehe');
    },
  };
};
