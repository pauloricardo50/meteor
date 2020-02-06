const generateConfig = require('./mup.staging-base.js');

module.exports = generateConfig({
  microservice: 'admin',
  subDomains: ['admin'],
});
