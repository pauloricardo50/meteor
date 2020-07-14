import { Meteor } from 'meteor/meteor';

if (Meteor.isTest) {
  // TODO: we should be able to use import here, but
  // eslint isn't configured to parse it correctly
  require('./unit.test.js');
}

if (Meteor.isAppTest) {
  require('core/lib/serverTestSetup.app-test.js');
  require('cypress/server/cypressMethods.app-tests.js');
}
