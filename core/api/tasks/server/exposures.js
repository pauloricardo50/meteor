import { Match } from 'meteor/check';

import { exposeQuery } from '../../queries/queryHelpers';
import { tasks } from '../queries';

exposeQuery({
  query: tasks,
  overrides: {
    embody: (body, params) => {
      body.$filter = ({ filters, params: { assignee, loanId, status } }) => {
        if (assignee) {
          filters['assigneeLink._id'] = assignee;
        }

        if (status) {
          filters.status = status;
        }

        if (loanId) {
          filters['loanLink._id'] = loanId;
        }
      };
    },
    validateParams: {
      assignee: Match.Maybe(Match.OneOf(Object, String)),
      loanId: Match.Maybe(String),
      status: Match.Maybe(Match.OneOf(Object, String)),
    },
  },
  options: { allowFilterById: true },
});
