import SecurityService from 'core/api/security';
import SessionService from 'core/api/sessions/server/SessionService';
import { impersonateUser, impersonateAdmin } from '../methodDefinitions';
import ImpersonateService from './ImpersonateService';

impersonateUser.setHandler((context, { authToken, userId, adminId }) => {
  const { connection: { id: connectionId } = {} } = context;
  const impersonatedUser = ImpersonateService.impersonate({
    context,
    authToken,
    userIdToImpersonate: userId,
  });

  const session = SessionService.getByConnectionId(connectionId);
  SessionService.addLink({
    id: session._id,
    linkName: 'impersonatingAdmin',
    linkId: adminId,
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
