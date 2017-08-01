module.exports = function (wallaby) {
  return {
    name: 'e-Potek Client',
    debug: true,
    testFramework: 'mocha',
    files: [
      { pattern: '.test/mocha-config.js', instrument: false, load: true },
      { pattern: 'imports/**/*.js*', load: true },
      '!imports/**/*.spec.js*',
    ],
    tests: [{ pattern: 'imports/**/*.spec.js*', load: true }],
    compilers: {
      '**/*.js*': wallaby.compilers.babel(),
    },
    env: {
      type: 'node',
    },
  };
};
