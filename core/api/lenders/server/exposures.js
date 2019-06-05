import { exposeQuery } from 'core/api/queries/queryHelpers';
import SecurityService from '../../security';
import { loanLenders } from '../queries';

exposeQuery(loanLenders, {
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
});
