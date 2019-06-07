import { Match } from 'meteor/check';

import { exposeQuery } from '../../queries/queryHelpers';
import query from './adminLoans';
import { LOAN_STATUS } from '../loanConstants';

exposeQuery(
  query,
  {
    embody: (body, params) => {
      body.$filter = ({
        filters,
        params: {
          _id,
          owned,
          name,
          _userId,
          assignedToMe,
          assignedEmployeeId,
          relevantOnly,
        },
      }) => {
        if (_id) {
          filters._id = _id;
        }

        if (name) {
          filters.name = name;
        }

        if (owned) {
          filters.userId = { $exists: true };
        }

        if (assignedToMe || assignedEmployeeId) {
          filters['userCache.assignedEmployeeId'] = assignedEmployeeId;
        }

        if (relevantOnly) {
          filters.status = {
            $nin: [LOAN_STATUS.TEST, LOAN_STATUS.UNSUCCESSFUL],
          };
          filters.anonymous = { $ne: true };
        }
      };
    },
    validateParams: {
      // _id: Match.Maybe(String),
      name: Match.Maybe(String),
      owned: Match.Maybe(Boolean),
      assignedToMe: Match.Maybe(Boolean),
      relevantOnly: Match.Maybe(Boolean),
      assignedEmployeeId: Match.OneOf(Object, String),
    },
  },
  { allowFilterById: true },
);
