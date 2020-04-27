import './initialization';

import { Meteor } from 'meteor/meteor';

console.log('setting Meteor isStaging');

Meteor.isStaging = Meteor.settings.public.environment === 'staging';
Meteor.isDevEnvironment =
  Meteor.settings.public.environment === 'dev-production';
