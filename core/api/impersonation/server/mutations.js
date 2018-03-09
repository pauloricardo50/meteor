import { createMutator } from 'core/api';
import { IMPERSONATE_USER } from '../defs';
import ImpersonateService from './ImpersonateService';

createMutator(IMPERSONATE_USER, function impersonation({ authToken, userId }) {
  return ImpersonateService.impersonate(this, authToken, userId);
});
