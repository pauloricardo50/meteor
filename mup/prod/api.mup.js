const generateConfig = require('../utils/base-config');
const defaults = require('./defaults');
const servers = require('../configs/api-servers.json');

module.exports = generateConfig({
  ...defaults,
  servers,
  microservice: 'backend',
  subDomains: ['api', 'pro'],
  appName: 'api',
  // Since api has dedicated servers, we can do it in parallel
  // with the other microservices
  parallelPrepareBundle: true,
  nginxLocationConfig: '../nginx/api-docs.conf',
});
