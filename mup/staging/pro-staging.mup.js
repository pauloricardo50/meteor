const generateConfig = require('./mup.staging-base.js');

module.exports = generateConfig({
  microservice: 'pro',
  subDomains: ['pro'],
  nginxLocationConfig: '../nginx/pro-staging.conf',
});
