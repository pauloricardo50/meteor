const generateConfig = require('../utils/base-config');
const defaults = require('./defaults');

module.exports = generateConfig({
  ...defaults,
  microservice: 'backend',
  subDomains: ['backend'],
});
