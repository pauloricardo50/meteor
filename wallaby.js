module.exports = function (wallaby) {
  return {
    debug: false,
    testFramework: 'mocha',
    files: [
      { pattern: '.test/mocha-config.js', instrument: false },
      'imports/**/*.js*',
      '!imports/**/*.spec.js*',
    ],
    tests: [{ pattern: 'imports/**/*.spec.js*' }],
    compilers: {
      '**/*.js*': wallaby.compilers.babel(),
    },
    env: {
      type: 'node',
    },
  };
};
