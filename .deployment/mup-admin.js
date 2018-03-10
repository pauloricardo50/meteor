const createMupConfig = require('./mup-defaults.js');

module.exports = createMupConfig({
  name: 'e-potek-admin-staging',
  path: '../microservices/admin',
  rootUrl: 'https://admin.staging.e-potek.ch',
  domain: 'admin.staging.e-potek.ch',
});
