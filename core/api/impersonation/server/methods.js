import { impersonateUser } from '../defs';
import ImpersonateService from './ImpersonateService';

impersonateUser.setHandler((context, { authToken, userId }) =>
  ImpersonateService.impersonate(this, authToken, userId));
