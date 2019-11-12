Package.describe({
  name: 'qualia:one',
  version: '0.1.0',
  summary: 'Prevent two client bundles from being built.',
  git: 'http://github.com/qualialabs/one',
  documentation: 'README.md',
});

Package.onUse(function(api) {
  api.versionsFrom('METEOR@1.4');

  api.use(['ecmascript', 'underscore', 'webapp'], ['server']);

  api.mainModule('main.js', 'server');
});

/* This code monkey patches build process. It only works if the packages is locally installed. */
const bundleType = process.env.QUALIA_ONE_BUNDLE_TYPE;
if (bundleType === 'modern' || bundleType === 'legacy') {
  const path = Npm.require('path');
  const { mainModule } = global.process;
  const absPath = mainModule.filename
    .split(path.sep)
    .slice(0, -1)
    .join(path.sep);
  const require = function(filePath) {
    return mainModule.require(path.resolve(absPath, filePath));
  };
  const { PlatformList } = require('./project-context.js');
  const { getWebArchs } = PlatformList.prototype;
  const blacklist = [
    bundleType === 'modern' ? 'web.browser.legacy' : 'web.browser',
  ];
  PlatformList.prototype.getWebArchs = function() {
    const archs = getWebArchs.apply(this, arguments);
    return archs.filter(arch => !blacklist.includes(arch));
  };
}
