import { Meteor } from 'meteor/meteor';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import { CallPromiseMixin } from 'meteor/didericis:callpromise-mixin';

import { getAuthToken } from './api';

export const getLogismataToken = new ValidatedMethod({
  name: 'getLogismataToken',
  mixins: [CallPromiseMixin],
  validate: null,
  run: () => Meteor.isServer && getAuthToken(),
});
