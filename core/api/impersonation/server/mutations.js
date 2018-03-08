import { Meteor } from 'meteor/meteor';
import { createMutator } from 'core/api';
import ImpersonateService from './ImpersonateService';
import { IMPERSONATE_USER } from '../defs';

createMutator(IMPERSONATE_USER, function({ authToken, userId }) {
  ImpersonateService.impersonate(this, authToken, userId);
});
