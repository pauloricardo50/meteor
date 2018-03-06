// Use old-school javascript in this file to make it work nicely

const packageStubs = [
  {
    expose: 'meteor',
    src: 'imports/core/utils/testHelpers/meteorStubs',
  },
];

function setWallabyConfig(name, overrides = {}) {
  return function setupWallaby(wallaby) {
    return {
      name,
      // debug: true, // Use this if things go wrong
      testFramework: 'mocha',
      files: [
        // load all files in imports
        'imports/**/**.js*',
        // Don't load node_modules twice
        '!imports/core/node_modules/**',
        // Don't import unnecessary folders
        '!imports/core/assets/**',
        // Don't load tests here, but in the next variable
        '!imports/**/*.spec.js*',
        // For a weird reason wallaby fucks up on .json files
        '!**/*.json',
      ],
      tests: ['imports/**/*.spec.js*', '!imports/core/node_modules/**'],
      compilers: {
        '**/*.js*': wallaby.compilers.babel({
          presets: ['env', 'react', 'stage-0'],
          plugins: [
            [
              'module-alias',
              [{ src: 'imports/core', expose: 'core' }, ...packageStubs],
            ],
          ],
        }),
      },
      env: { type: 'node' },
      setup() {
        global.IS_WALLABY = true;
        global.fetch = require('node-fetch');
      },
      ...overrides,
    };
  };
}

module.exports = setWallabyConfig;
