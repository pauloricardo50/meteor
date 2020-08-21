const generateConfig = require('../utils/base-config');
const defaults = require('./defaults');
const { getFullCommand } = require('../utils/run-mup');

module.exports = generateConfig({
  ...defaults,
  microservice: 'backend',
  subDomains: ['backend'],
  hooks: {
    'post.deploy': {
      localCommand: getFullCommand('--config api.mup.js reconfig'),
    },
  },
});
