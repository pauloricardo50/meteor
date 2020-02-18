const generateConfig = require('../utils/base-config');
const defaults = require('./defaults');
const servers = require('../api-servers.json');

module.exports = generateConfig({
  ...defaults,
  servers,
  microservice: 'backend',
  subDomains: ['backend'],
});
