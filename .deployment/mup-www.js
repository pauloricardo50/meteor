const createMupConfig = require('./mup-defaults.js');

module.exports = createMupConfig({
  name: 'e-potek-www-staging',
  path: '../microservices/www',
  rootUrl: 'https://www.staging.e-potek.ch',
  domain: 'www.staging.e-potek.ch',
});
