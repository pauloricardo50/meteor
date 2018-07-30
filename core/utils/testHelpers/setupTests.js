import { Meteor } from 'meteor/meteor';
import { resetDatabase } from 'meteor/xolvio:cleaner';

// Import factories and links for tests to work
import '../../api';
import '../../api/api';

if (Meteor.isTest) {
  console.log('Setting up tests');

  resetDatabase();
}
