const generateConfig = require('../utils/base-config');
const { retrieveSecret } = require('../utils/secrets');
const defaults = require('./defaults');

module.exports = generateConfig({
  ...defaults,
  microservice: 'backend',
  subDomains: ['backend', 'api'],
  envVars: {
    METRICS_CREDENTIALS: JSON.stringify(retrieveSecret('metrics-gcp-key')),
  },
});
