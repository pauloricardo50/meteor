import { exposeQuery } from '../../queries/queryHelpers';
import { adminOffers, loanOffers } from '../queries';
import SecurityService from '../../security';

exposeQuery(adminOffers, {}, { allowFilterById: true });

exposeQuery(
  loanOffers,
  {
    firewall(userId, { loanId }) {
      SecurityService.checkLoggedIn();

      if (loanId) {
        SecurityService.loans.isAllowedToUpdate(loanId);
      }
    },
    validateParams: { loanId: String },
  },
  {},
);
