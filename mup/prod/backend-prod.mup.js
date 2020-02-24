const generateConfig = require('./base.js');

module.exports = generateConfig({
  microservice: 'backend',
  subDomains: ['backend'],
});
