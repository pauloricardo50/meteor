import SecurityService from '../../security';
import query from './proReferredByLoans';
import { proReferredByLoansResolver } from './resolvers';

query.expose({
  firewall(userId, params) {
    const { userId: providedUserId } = params;
    SecurityService.checkUserIsPro(userId);
    if (SecurityService.isUserAdmin(userId)) {
      params.userId = providedUserId;
    } else {
      params.userId = userId;
    }
    params.calledByUserId = userId;
  },
  validateParams: {
    userId: String,
    calledByUserId: String,
  },
});

query.resolve(proReferredByLoansResolver);
