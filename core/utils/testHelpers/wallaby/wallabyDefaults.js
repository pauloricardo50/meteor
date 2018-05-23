// Use old-school javascript in this file to make it work nicely

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
        '!imports/**/*.spec.js*'
      ],
      tests: ['imports/**/*.spec.js*', '!imports/core/node_modules/**'],
      compilers: {
        '**/*.js?(x)': wallaby.compilers.babel({
          "presets": ["meteor", "@babel/preset-react"],
          "plugins": [
            "@babel/plugin-transform-modules-commonjs",
            "@babel/plugin-proposal-class-properties",
            "meteor-babel/plugins/dynamic-import",
            [
              "module-resolver",
              {
                "root": ["."],
                "alias": {
                  "core": "./imports/core",
                  "meteor": "./imports/core/utils/testHelpers/meteorStubs"
                }
              }
            ]
          ]
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
