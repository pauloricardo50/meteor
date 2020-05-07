import { compose, withProps } from 'recompose';

import { withSmartQuery } from 'core/api/containerToolkit';

import { getColumnOptions, getRows } from './userTableHelpers';

export const withUsersQuery = withSmartQuery({
  query: USERS_COLLECTION,
  params: ({ assignedTo }) => ({
    $filters: {
      assignedEmployeeId: assignedTo,
    },
    email: 1,
    name: 1,
    createdAt: 1,
    roles: 1,
    assignedEmployee: { _id: 1, name: 1, email: 1 },
    $options: { sort: { lastName: 1 } },
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
