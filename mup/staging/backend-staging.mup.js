const generateConfig = require('./mup.staging-base.js');

module.exports = generateConfig({
  microservice: 'backend',
  subDomains: ['backend'],
});
