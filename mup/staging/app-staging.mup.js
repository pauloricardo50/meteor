const generateConfig = require('./mup.staging-base.js');

module.exports = generateConfig({
  microservice: 'app',
  subDomains: ['app'],
});
