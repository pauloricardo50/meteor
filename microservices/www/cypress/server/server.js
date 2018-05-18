import { Meteor } from 'meteor/meteor';

// For security reasons, the following condition is the ONLY
// place where server code related to end to end tests should be added
if (process.env.E2E_SERVER) {
  // make sure we have the full version of the app, not changed by any feature
  Meteor.settings.public.features = {};
}
