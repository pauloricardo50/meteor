import { Composer } from 'core/api';
import query from 'core/api/users/queries/adminUsers';
import withTableFilters from 'core/containers/withTableFilters';
import { withQuery } from 'core/api';

export const withUsersTableFilters = withTableFilters(({ data }) => ({
  filters: {
    roles: true,
    assignedEmployee: { emails: [{ address: true }] },
  },
  options: { address: data.map(({ emails: [{ address }] }) => address) },
}));

export const withQueryUsers = withQuery(
  props => query.clone({ assignedTo: props.assignedTo }),
  {
    reactive: true,
  },
);

export default Composer.compose(
  withQueryUsers,
  withUsersTableFilters,
);
