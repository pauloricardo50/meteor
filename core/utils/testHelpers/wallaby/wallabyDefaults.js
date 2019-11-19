const merge = require('lodash/merge');
// Use old-school javascript in this file to make it work nicely

function setWallabyConfig(name, overrides = {}) {
  return function setupWallaby(wallaby) {
    return merge(
      {},
      {
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
          // Load language files for some tests
          'lang/*.json',
          // // Don't load css files
          { pattern: 'node_modules/**/*.css', ignore: true },
        ],
        tests: ['imports/**/*.spec.js*', '!imports/core/node_modules/**'],
        compilers: {
          '**/*.js?(x)': wallaby.compilers.babel({
            presets: ['meteor', '@babel/preset-react', '@babel/preset-flow'],
            plugins: [
              '@babel/plugin-transform-modules-commonjs',
              '@babel/plugin-proposal-class-properties',
              'meteor-babel/plugins/dynamic-import',
              [
                'module-resolver',
                {
                  root: ['.'],
                  alias: {
                    core: './imports/core',
                    meteor: './imports/core/utils/testHelpers/meteorStubs',
                  },
                },
              ],
            ],
          }),
        },
        env: { type: 'node' },
        setup() {
          global.IS_WALLABY = true;
          global.fetch = require('node-fetch');

          // Configure jsdom for react mount tests
          const jsdom = require('jsdom');

          const { JSDOM } = jsdom;
          const { document } = new JSDOM(
            '<!doctype html><html><body></body></html>',
          ).window;
          global.document = document;
          global.window = document.defaultView;
          global.navigator = { userAgent: 'node.js', platform: 'MacIntel' };

          // Do this for react-use, which uses the global variable "history"
          // Follow this issue: https://github.com/streamich/react-use/issues/73
          global.history = {};

          require('uniforms-bridge-simple-schema-2');
          const SimpleSchema = require('simpl-schema').default;
          SimpleSchema.extendOptions([
            'index',
            'unique',
            'denyInsert',
            'denyUpdate',
            'uniforms',
            'condition',
            'customAllowedValues',
            'customAutoValue',
          ]);
        },
      },
      overrides,
    );
  };
}

module.exports = setWallabyConfig;
