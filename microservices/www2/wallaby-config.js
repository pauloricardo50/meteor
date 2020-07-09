module.exports = function (wallaby) {
  return {
    files: [
      'src/components/WwwCalculator/WwwCalculatorState.jsx',
      'src/components/WwwCalculator/wwwCalculatorConstants.js',
    ],
    // files: ['src/**/*.js*', '!src/core/**', '!src/**/*.test.js*'],
    tests: ['src/components/WwwCalculator/test/WwwCalculator.test.js'],
    // tests: ['src/**/*.test.js*', '!src/core/**'],
    compilers: {
      '**/*.js?(x)': wallaby.compilers.babel({
        presets: ['babel-preset-gatsby'],
        plugins: [
          [
            'module-resolver',
            {
              root: ['.'],
              alias: {
                core: './src/core',
              },
            },
          ],
        ],
      }),
    },
    trace: true,
    debug: true,
  };
};
