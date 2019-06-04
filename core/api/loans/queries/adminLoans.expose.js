import { Match } from 'meteor/check';

import { exposeQuery } from '../../queries/queryHelpers';
import query from './adminLoans';
import { LOAN_STATUS } from '../loanConstants';

exposeQuery(
  query,
  {
    embody: {
      $filter({
        filters,
        params: { _id, owned, name, _userId, assignedToMe, relevantOnly },
      }) {
        if (_id) {
          filters._id = _id;
        }

        if (name) {
          filters.name = name;
        }

        if (owned) {
          filters.userId = { $exists: true };
        }

        if (assignedToMe) {
          filters['userCache.assignedEmployeeId'] = _userId;
        }

        if (relevantOnly) {
          filters.status = {
            $nin: [LOAN_STATUS.TEST, LOAN_STATUS.UNSUCCESSFUL],
          };
          filters.anonymous = { $ne: true };
        }
      },
    },
    validateParams: {
      // _id: Match.Maybe(String),
      name: Match.Maybe(String),
      owned: Match.Maybe(Boolean),
      assignedToMe: Match.Maybe(Boolean),
      relevantOnly: Match.Maybe(Boolean),
    },
  },
  { allowFilterById: true },
);
