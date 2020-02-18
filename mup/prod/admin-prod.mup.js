const generateConfig = require('./base.js');

module.exports = generateConfig({
  microservice: 'admin',
  subDomains: ['admin'],
});
