import { exposeQuery } from '../../queries/queryHelpers';
import SecurityService from '../../security';
import { loanLenders } from '../queries';

exposeQuery({
  query: loanLenders,
  overrides: {
    firewall(userId, { loanId }) {
      if (!SecurityService.isUserAdmin(userId)) {
        SecurityService.loans.isAllowedToUpdate(loanId);
      }
    },
    embody: (body) => {
      body.$filter = ({ filters, params }) => {
        filters['loanLink._id'] = params.loanId;
      };
    },
    validateParams: { loanId: String },
  },
});
