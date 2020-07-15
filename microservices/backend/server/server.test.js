import { Meteor } from 'meteor/meteor';

if (Meteor.isTest) {
  // TODO: we should be able to use import here, but
  // eslint isn't configured to parse it correctly
  require('./unit.test.js');
}

if (Meteor.isAppTest) {
  require('core/lib/server/serverTestSetup.app-test.js');
  require('core/cypress/server/cypressMethods.app-tests.js');
}
