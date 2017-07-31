// const wallabify = require('wallabify');
// const proxyquireify = require('proxyquireify');

module.exports = function (wallaby) {
  // const postprocessor = wallabify({}, b => b.plugin(proxyquireify.plugin));

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
    // preprocessors: {
    //   'app*/**/*.js': function (file) {
    //     return require('babel').transform(file.content, { sourceMap: true });
    //   },
    // },
    // postprocessor,
    // bootstrap() {
    //   window.__moduleBundler.loadTests();
    // },
    // preprocessors: {
    //   'imports/**/*.js*': (file) => {
    //     // change absolute imports to absolute root imports
    //     const content = file.content;
    //     return content.replace("require('/", "require('~/dev/epotek/");
    //   },
    // },
  };
};
