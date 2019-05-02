import SecurityService from '../../security';
import query from './loanLenders';

query.expose({
  firewall(userId, { loanId }) {
    if (!SecurityService.isUserAdmin(userId)) {
      SecurityService.loans.isAllowedToUpdate(loanId);
    }
  },
  embody: {
    $filter({ filters, params }) {
      filters['loanLink._id'] = params.loanId;
    },
  },
  validateParams: { loanId: String },
});
