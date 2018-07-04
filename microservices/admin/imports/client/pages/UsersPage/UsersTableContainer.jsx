import query from 'core/api/users/queries/adminUsers';
import { compose, createContainer } from 'core/api';
import { withSmartQuery } from 'core/api/containerToolkit';

import { getColumnOptions, getRows } from './userTableHelpers';

export default compose(
  withSmartQuery({
    query: ({ assignedTo }) => query.clone({ assignedTo }),
    queryOptions: { reactive: true },
    dataName: 'users',
  }),
  createContainer(({ users, history, showAssignee }) => ({
    options: {
      getColumnOptions: getColumnOptions({ showAssignee }),
      getRows: getRows({ users, history, showAssignee }),
    },
  })),
);
