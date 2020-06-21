import { Match } from 'meteor/check';

import { exposeQuery } from '../../queries/queryHelpers';
import { loanChecklists } from '../queries';

exposeQuery({
  query: loanChecklists,
  overrides: {
    firewall(userId, { loanId }) {
      // TODO: Add security
    },
    embody: body => {
      body.$filter = ({ filters, params: { loanId } }) => {
        filters['closingLoanCache._id'] = loanId;
      };
      body.$postFilter = checklists => {
        // TODO: Filter checklist items by access property
        const role = '...';
        return checklists.map(({ items, ...checklist }) => ({
          ...checklist,
          items: items.filter(x => x),
        }));
      };
    },
    validateParams: { loanId: Match.Maybe(String) },
  },
});
