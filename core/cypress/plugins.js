module.exports = (on, config) => {
  console.log('---------------');
  console.log('Cypress Config');
  console.log('---------------');
  console.log(config);

  if (!process.env.CIRCLE_CI) {
    config.screenshotsFolder = 'cypress/logs/screenshots';
    config.videosFolder = 'cypress/logs/videos';
  }

  // Temporary fix from cypress, to be removed
  // https://github.com/cypress-io/cypress/issues/2037
  on('before:browser:launch', (browser = {}, args) => {
    if (browser.name === 'chrome') {
      args = args.filter(arg => arg !== '--disable-blink-features=RootLayerScrolling');

      return args;
    }
  });

  return config;
};
