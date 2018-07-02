import { Composer } from 'core/api';
import query from 'core/api/users/queries/adminUsers';
import withTableFilters from 'core/containers/withTableFilters';
import { withQuery } from 'core/api';
import { ROLES } from 'core/api/constants';

export const withUsersTableFilters = withTableFilters(({ data }) => ({
  filters: {
    roles: true,
    assignedEmployee: { emails: [{ address: true }] },
  },
  options: {
    roles: Object.values(ROLES),
    address: data.map(({ assignedEmployee }) =>
    // NOTE: for no assigned employee we return `undefined` and not `false`
    // because we consider boolean values (includes `false`)
    // valid/non-empty values
      (assignedEmployee ? assignedEmployee.emails[0].address : undefined)),
  },
  // detect if options is a promise or not
  // options: adminsQuery.fetchSync().then((err, data) => data.map(d => asginee.email.0.ss));
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
