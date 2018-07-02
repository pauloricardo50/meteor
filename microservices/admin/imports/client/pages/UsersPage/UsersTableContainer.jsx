import { Composer } from 'core/api';
import adminUsersQuery from 'core/api/users/queries/adminUsers';
import withTableFilters from 'core/containers/withTableFilters';
import { withQuery } from 'core/api';

export const withQueryUsers = withQuery(
  props => adminUsersQuery.clone({ assignedTo: props.assignedTo }),
  {
    reactive: true,
  },
);

export const withUsersTableFilters = withTableFilters(({ tableFilters }) => tableFilters);

export default Composer.compose(
  withQueryUsers,
  withUsersTableFilters,
);
