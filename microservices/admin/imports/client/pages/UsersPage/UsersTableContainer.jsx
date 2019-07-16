import { compose, withProps } from 'recompose';
import { withSmartQuery } from 'core/api/containerToolkit';
import { adminUsers } from 'core/api/users/queries';

import { getColumnOptions, getRows } from './userTableHelpers';

export const withUsersQuery = withSmartQuery({
  query: adminUsers,
  params: ({ assignedTo }) => ({
    assignedEmployeeId: assignedTo,
    $body: {
      email: 1,
      name: 1,
      createdAt: 1,
      roles: 1,
      assignedEmployee: { _id: 1, name: 1, email: 1 },
    },
  }),
  queryOptions: { reactive: false },
});

export default compose(
  withUsersQuery,
  withProps(({ data, history, showAssignee }) => ({
    options: {
      columnOptions: getColumnOptions({ showAssignee }),
      rows: getRows({ data, history, showAssignee }),
    },
  })),
);
