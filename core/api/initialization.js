// Leave this imported here for autoforms to work
import 'uniforms-bridge-simple-schema-2';

import { Meteor } from 'meteor/meteor';

import SimpleSchema from 'simpl-schema';

SimpleSchema.extendOptions([
  'condition',
  'customAllowedValues',
  'customAutoValue',
]);

Meteor.isStaging = Meteor.settings.public.environment === 'staging';
Meteor.isDevEnvironment =
  Meteor.settings.public.environment === 'dev-production';
