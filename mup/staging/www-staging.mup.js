const generateConfig = require('./mup.staging-base.js');

module.exports = generateConfig({
  microservice: 'www',
  subDomains: ['www.staging-2.e-potek.net'],
});
