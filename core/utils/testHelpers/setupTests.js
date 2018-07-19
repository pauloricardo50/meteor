import { Meteor } from 'meteor/meteor';
import { resetDatabase } from 'meteor/xolvio:cleaner';

// This has to be imported here for client side tests to use factories
import '../../api/factories';

if (Meteor.isTest) {
  console.log('Setting up tests');

  resetDatabase();
}
