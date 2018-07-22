import { compose, createContainer } from 'core/api';
import { withSmartQuery } from 'core/api/containerToolkit';
import adminUsersQuery from 'core/api/users/queries/adminUsers';
import withTableFilters from 'core/containers/withTableFilters';

import { getColumnOptions, getRows } from './userTableHelpers';

export const withUsersQuery = withSmartQuery({
  query: ({ assignedTo }) => adminUsersQuery.clone({ assignedTo }),
  queryOptions: { reactive: true },
});

export default compose(
  withUsersQuery,
  withTableFilters,
  createContainer(({ data, history, showAssignee }) => ({
    options: {
      getColumnOptions: getColumnOptions({ showAssignee }),
      getRows: getRows({ data, history, showAssignee }),
    },
  })),
);
