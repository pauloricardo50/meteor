module.exports = function (wallaby) {
  return {
    files: ['src/**/*.js*', '!src/core/**'],
    tests: ['src/**/*.test.js*', '!src/core/**'],
    compilers: {
      '**/*.js?(x)': wallaby.compilers.babel({
        presets: ['babel-preset-gatsby'],
        plugins: [
          // '@babel/plugin-transform-modules-commonjs',
          // '@babel/plugin-proposal-class-properties',
          [
            'module-resolver',
            {
              root: ['.'],
              alias: {
                core: './imports/core',
                'meteor/cultofcoders:grapher/lib/createQuery':
                  './imports/core/utils/testHelpers/meteorStubs/cultofcoders:grapher',
                meteor: './imports/core/utils/testHelpers/meteorStubs',
              },
            },
          ],
        ],
      }),
    },
  };
};
