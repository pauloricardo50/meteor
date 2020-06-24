import { Match } from 'meteor/check';

import { exposeQuery } from '../../queries/queryHelpers';
import SecurityService from '../../security';
import { loanChecklists } from '../queries';

exposeQuery({
  query: loanChecklists,
  overrides: {
    firewall(userId, { loanId }) {
      SecurityService.loans.isAllowedToAccess(loanId, userId);
    },
    embody: body => {
      body.$filter = ({ filters, params: { loanId } }) => {
        filters['closingLoanCache._id'] = loanId;
      };
    },
    validateParams: { loanId: String },
  },
});
