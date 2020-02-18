const generateConfig = require('../utils/base-config');
const defaults = require('./defaults');

module.exports = generateConfig({
  ...defaults,
  microservice: 'admin',
  subDomains: ['admin'],
  nginxLocationConfig: '../nginx/whitelist.conf'
});
