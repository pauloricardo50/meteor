// module.exports = function (wallaby) {
//   return {
//     debug: false,
//     testFramework: 'mocha',
//     files: [
//       { pattern: '.test/mocha-config.js', instrument: false },
//       'imports/**/*.js*',
//       '!imports/**/*.spec.js*',
//     ],
//     tests: [{ pattern: 'imports/**/*.spec.js*' }],
//     compilers: {
//       '**/*.js*': wallaby.compilers.babel(),
//     },
//     env: {
//       type: 'node',
//     },
//   };
// };

// FIXME: this is a work in progress

module.exports = (wallaby) => {
  const path = require('path');
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
    workers: { initial: 1, regular: 1, recycle: true },
    setup: () => {
      wallaby.testFramework.addFile(
        `${wallaby.localProjectDir}/.test/mocha-config.js`,
      );
    },
  };
};
