import { Meteor } from 'meteor/meteor';
import { createMutator } from 'core/api';
import ImpersonateService from './ImpersonateService';

createMutator(IMPERSONATE_USER, function({ authToken, userId }) {
  ImpersonateService.impersonate(this, authToken, userId);
});
