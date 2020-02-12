const generateConfig = require('./mup.staging-base.js');

module.exports = generateConfig({
  microservice: 'www',
  subDomains: ['www'],
});
