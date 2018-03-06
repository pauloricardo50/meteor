import { Meteor } from 'meteor/meteor';

import 'core/api/api';
import 'core/api/api-server';
import '../accounts-config';
import setupMandrill from 'core/api/email/server/email-config';

Meteor.startup(() => {
  setupMandrill();
});

console.log('Hello World lender server');
