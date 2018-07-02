import { Composer } from 'core/api';
import adminUsersQuery from 'core/api/users/queries/adminUsers';
import withTableFilters from 'core/containers/withTableFilters';
import { withQuery } from 'core/api';

export const withUsersQuery = withQuery(
  props => adminUsersQuery.clone({ assignedTo: props.assignedTo }),
  {
    reactive: true,
  },
);

export default Composer.compose(
  withUsersQuery,
  withTableFilters,
);
