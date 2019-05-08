import SecurityService from 'core/api/security';
import query from './anonymousLoan';

query.expose({
  firewall(userId, params) {
    SecurityService.loans.checkAnonymousLoan({ loanId: params._id });
  },
  embody: {
    $filter({ filters, params }) {
      filters._id = params._id;
    },
  },
  validateParams: { _id: String },
});
