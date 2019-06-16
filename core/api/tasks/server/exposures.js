import { Match } from 'meteor/check';

import { exposeQuery } from '../../queries/queryHelpers';
import { tasks } from '../queries';

exposeQuery({
  query: tasks,
  overrides: {
    embody: (body, params) => {
      body.$filter = ({
        filters,
        params: {
          assignedTo,
          unassigned,
          dashboardTasks,
          file,
          status,
          type,
          user,
          docIds,
          loanId,
        },
      }) => {
        if (assignedTo) {
          filters.assignedEmployeeId = assignedTo;
        }

        if (unassigned) {
          filters.assignedEmployeeId = { $exists: false };
        }

        if (dashboardTasks) {
          delete filters.assignedEmployeeId;
          filters.$or = [
            { assignedEmployeeId: { $in: [assignedTo] } },
            { assignedEmployeeId: { $exists: false } },
          ];
        }

        if (file) {
          filters.fileKey = file;
        }

        if (status) {
          filters.status = status;
        }

        if (type) {
          filters.type = type;
        }

        if (user) {
          filters.userId = user;
        }

        if (docIds) {
          filters.docId = { $in: docIds };
        }

        if (loanId) {
          filters['loanLink._id'] = loanId;
        }
      };
    },
    validateParams: {
      assignedTo: Match.Maybe(String),
      dashboardTasks: Match.Maybe(Boolean),
      docIds: Match.Maybe([String]),
      file: Match.Maybe(String),
      loanId: Match.Maybe(String),
      status: Match.Maybe(String),
      type: Match.Maybe(String),
      unassigned: Match.Maybe(Boolean),
      user: Match.Maybe(String),
    },
  },
  options: { allowFilterById: true },
});
