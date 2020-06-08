const generateConfig = require('../utils/base-config');
const { retrieveSecret } = require('../utils/secrets');
const defaults = require('./defaults');

module.exports = generateConfig({
  ...defaults,
  microservice: 'backend',
  subDomains: ['backend'],
  envVars: {
    METRICS_CREDENTIALS: JSON.stringify(retrieveSecret('metrics-gcp-key')),
  },
  hooks: {
    'post.deploy': {
      localCommand: 'mup --config api.mup.js reconfig',
    },
  },
});
