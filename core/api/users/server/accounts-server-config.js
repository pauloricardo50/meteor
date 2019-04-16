import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';

// Accounts.onCreateUser((options, user) => user);
Accounts.config({ forbidClientAccountCreation: !Meteor.isTest });
