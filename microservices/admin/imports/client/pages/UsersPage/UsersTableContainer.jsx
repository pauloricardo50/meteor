import { compose, withProps } from 'recompose';
import { withSmartQuery } from 'core/api/containerToolkit';
import adminUsersQuery from 'core/api/users/queries/adminUsers';
import withTableFilters from 'core/containers/withTableFilters';

import { getColumnOptions, getRows } from './userTableHelpers';

export const withUsersQuery = withSmartQuery({
  query: ({ assignedTo }) => adminUsersQuery.clone({ assignedTo }),
  queryOptions: { reactive: false },
});

export default compose(
  withUsersQuery,
  withTableFilters,
  withProps(({ data, history, showAssignee }) => ({
    options: {
      columnOptions: getColumnOptions({ showAssignee }),
      rows: getRows({ data, history, showAssignee }),
    },
  })),
);
