import { Match } from 'meteor/check';

import { exposeQuery } from '../../queries/queryHelpers';
import { loanChecklists } from '../queries';

exposeQuery({
  query: loanChecklists,
  overrides: {
    firewall(userId, { loanId }) {},
    embody: body => {
      body.$filter = ({ filters, params: { loanId } }) => {};
    },
    validateParams: { loanId: Match.Maybe(String) },
  },
});
