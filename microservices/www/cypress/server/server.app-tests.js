// For security reasons, this is the ONLY
// file where server code related to end to end tests should be added

import { Meteor } from 'meteor/meteor';

// make sure we have the full version of the app, not changed by any feature
Meteor.settings.public.features = {};
