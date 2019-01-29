import { impersonateUser } from '../methodDefinitions';
import ImpersonateService from './ImpersonateService';

impersonateUser.setHandler((context, { authToken, userId }) => {
  const impersonatedUser = ImpersonateService.impersonate({
    context,
    authToken,
    userIdToImpersonate: userId,
  });

  return impersonatedUser;
});
