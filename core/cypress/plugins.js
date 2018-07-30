module.exports = (on, config) => {
  console.log('---------------');
  console.log('Cypress Config');
  console.log('---------------');
  console.log(config);

  if (!process.env.CIRCLE_CI) {
    config.screenshotsFolder = 'cypress/logs/screenshots';
    config.videosFolder = 'cypress/logs/videos';
  }

  return config;
};
