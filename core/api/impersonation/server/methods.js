import SecurityService from 'core/api/security/index';
import { impersonateUser, impersonateAdmin } from '../methodDefinitions';
import ImpersonateService from './ImpersonateService';

impersonateUser.setHandler((context, { authToken, userId }) => {
  const impersonatedUser = ImpersonateService.impersonate({
    context,
    authToken,
    userIdToImpersonate: userId,
  });

  return impersonatedUser;
});

impersonateAdmin.setHandler((context, { userId }) => {
  SecurityService.checkUserIsDev(context.userId);
  const impersonatedUser = ImpersonateService.impersonateAdmin({
    context,
    userIdToImpersonate: userId,
  });

  return impersonatedUser;
});
