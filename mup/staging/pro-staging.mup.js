const generateConfig = require('../utils/base-config');
const defaults = require('./defaults');

module.exports = generateConfig({
  ...defaults,
  microservice: 'pro',
  subDomains: ['pro'],
  nginxLocationConfig: '../nginx/pro.conf',
});
