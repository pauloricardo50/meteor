const createMupConfig = require('./mup-defaults.js');

module.exports = createMupConfig({
  name: 'e-potek-admin-temp-staging',
  path: '../microservices/admin-temp',
  rootUrl: 'https://admin.staging.e-potek.ch',
  domain: 'admin.staging.e-potek.ch',
});
