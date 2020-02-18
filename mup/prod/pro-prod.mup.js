const generateConfig = require('./base.js');

module.exports = generateConfig({
  microservice: 'pro',
  subDomains: ['pro'],
  nginxLocationConfig: '../nginx/pro-staging.conf',
});
