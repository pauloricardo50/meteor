module.exports = function setupWallaby(wallaby) {
  const packageStubs = [
    {
      expose: 'meteor',
      src: 'imports/core/utils/testHelpers/meteorStubs',
    },
  ];
  return {
    name: 'e-Potek Client',
    debug: true,
    testFramework: 'mocha',
    files: [
      // Don't load node_modules twice
      '!imports/core/node_modules/**',
      // Don't import unnecessary folders
      '!imports/core/assets/**',
      // load all files in imports
      'imports/**/**.js*',
      // Don't load tests here, but in the next variable
      '!imports/wallaby/**/*.spec.js*',
    ],
    tests: ['imports/wallaby/**/*.spec.js*'],
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
    env: {
      type: 'node',
    },
  };
};
