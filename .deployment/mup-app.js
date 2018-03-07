const createMupConfig = require('./mup-defaults.js');

module.exports = createMupConfig({
  name: 'e-potek-app-staging',
  path: '../microservices/app',
  rootUrl: 'https://app.staging.e-potek.ch',
  domain: 'app.staging.e-potek.ch',
});
