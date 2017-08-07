process.env.NODE_ENV = 'test';

module.exports = function (wallaby) {
  return {
    name: 'e-Potek Client',
    debug: true,
    testFramework: 'mocha',
    files: [
      { pattern: '.test/mocha-config.js', instrument: false },
      'imports/**/*.js*',
      '!imports/**/*.spec.js*',
    ],
    tests: ['imports/**/*.spec.js*'],
    compilers: {
      '**/*.js*': wallaby.compilers.babel(),
    },
    env: {
      type: 'node',
    },
  };
};
