const generateConfig = require('../utils/base-config');
const defaults = require('./defaults');

module.exports = generateConfig({
  ...defaults,
  microservice: 'app',
  subDomains: ['app'],
});
