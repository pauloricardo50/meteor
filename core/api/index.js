import './initialization';
import { Meteor } from 'meteor/meteor';

export * from './helpers';
export * from './methods';

Meteor.isStaging = Meteor.settings.public.environment === 'staging';
Meteor.isDevEnvironment =
  Meteor.settings.public.environment === 'dev-production';
