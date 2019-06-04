import { Match } from 'meteor/check';

import { exposeQuery } from '../../queries/queryHelpers';
import query from './tasks';

exposeQuery(
  query,
  {
    embody: {
      $filter({
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
        },
      }) {
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
      },
    },
    validateParams: {
      assignedTo: Match.Maybe(String),
      unassigned: Match.Maybe(Boolean),
      dashboardTasks: Match.Maybe(Boolean),
      file: Match.Maybe(String),
      status: Match.Maybe(String),
      type: Match.Maybe(String),
      user: Match.Maybe(String),
      docIds: Match.Maybe([String]),
    },
  },
  { allowFilterById: true },
);
