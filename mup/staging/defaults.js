const servers = require('../configs/staging-servers.json');

module.exports = {
  servers,
  baseDomain: 'staging.e-potek.ch',
  environment: 'staging',
  globalApiConfig: true,
};
