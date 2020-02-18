const generateConfig = require('./base.js');

module.exports = generateConfig({
  microservice: 'app',
  subDomains: ['app'],
});
