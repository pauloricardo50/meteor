const generateConfig = require('./base.js');

module.exports = generateConfig({
  microservice: 'www',
  subDomains: ['www'],
});
