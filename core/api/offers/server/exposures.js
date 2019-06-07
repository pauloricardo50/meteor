import { exposeQuery } from '../../queries/queryHelpers';
import SecurityService from '../../security';
import { adminOffers, loanOffers } from '../queries';

exposeQuery({ query: adminOffers, options: { allowFilterById: true } });

exposeQuery({
  query: loanOffers,
  overrides: {
    firewall(userId, { loanId }) {
      SecurityService.checkLoggedIn();

      if (loanId) {
        SecurityService.loans.isAllowedToUpdate(loanId);
      }
    },
    embody: (body) => {
      body.$filter = ({ filters, params: { loanId } }) => {
        if (loanId) {
          filters['lenderCache.loanLink._id'] = loanId;
        }
      };
    },
    validateParams: { loanId: String },
  },
});
