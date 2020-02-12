const generateConfig = require('./mup.staging-base.js');

module.exports = generateConfig({
  microservice: 'admin',
  subDomains: ['admin'],
  nginxLocationConfig: '../nginx/whitelist.conf'
});
