const generateConfig = require('../utils/base-config');
const defaults = require('./defaults');
const servers = require('../configs/api-servers.json');

module.exports = generateConfig({
  ...defaults,
  servers,
  microservice: 'backend',
  subDomains: ['api'],
});
