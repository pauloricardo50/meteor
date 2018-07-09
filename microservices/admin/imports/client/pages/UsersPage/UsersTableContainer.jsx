import { compose, createContainer, withQuery } from 'core/api';
import adminUsersQuery from 'core/api/users/queries/adminUsers';
import withTableFilters from 'core/containers/withTableFilters';
import { getColumnOptions, getRows } from './userTableHelpers';

export const withUsersQuery = withQuery(
  ({ assignedTo }) => adminUsersQuery.clone({ assignedTo }),
  { reactive: true },
);

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
