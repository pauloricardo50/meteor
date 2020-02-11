import { Match } from 'meteor/check';

import moment from 'moment';

import { exposeQuery } from '../../queries/queryHelpers';
import { tasks } from '../queries';

const getUptoDate = uptoDate => {
  switch (uptoDate) {
    case 'TODAY':
      return moment()
        .endOf('day')
        .toDate();
    case 'TOMORROW':
      return moment()
        .endOf('day')
        .add(1, 'days')
        .endOf('day')
        .toDate();

    default:
      return null;
  }
};

exposeQuery({
  query: tasks,
  overrides: {
    embody: (body, params) => {
      body.$filter = ({
        filters,
        params: { assignee, loanId, status, uptoDate, userId },
      }) => {
        if (assignee) {
          filters['assigneeLink._id'] = assignee;
        }

        if (status) {
          filters.status = status;
        }

        if (getUptoDate(uptoDate)) {
          filters.$or = [
            { dueAt: { $lt: getUptoDate(uptoDate) } },
            { dueAt: { $exists: false } },
          ];
        }

        if (loanId) {
          filters['loanLink._id'] = loanId;
        }

        if (userId) {
          filters['userLink._id'] = userId;
        }
      };
      body.$postFilter = (results, postFilterParams) => {
        const { _userId } = postFilterParams;

        return results.filter(task => {
          const {
            assigneeLink: { _id: assigneeId } = {},
            isPrivate = false,
          } = task;

          if (isPrivate && assigneeId) {
            return assigneeId === _userId;
          }

          return true;
        });
      };
    },
    validateParams: {
      assignee: Match.Maybe(Match.OneOf(Object, String)),
      loanId: Match.Maybe(String),
      status: Match.Maybe(Match.OneOf(Object, String)),
      uptoDate: Match.Maybe(String),
      userId: Match.Maybe(String),
    },
  },
  options: { allowFilterById: true },
});
