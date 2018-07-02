import { Composer } from 'core/api';
import adminUsersQuery from 'core/api/users/queries/adminUsers';
import adminsQuery from 'core/api/users/queries/admins';
import withTableFilters from 'core/containers/withTableFilters';
import { withQuery } from 'core/api';
import { ROLES } from 'core/api/constants';

export const withQueryUsers = withQuery(
  props => adminUsersQuery.clone({ assignedTo: props.assignedTo }),
  {
    reactive: true,
  },
);

export const getAdminsEmails = async () => {
  const admins = await adminsQuery.clone().fetchSync();
  return admins.map(({ emails: [{ address }] }) => address);
};

export const withUsersTableFilters = withTableFilters(() => ({
  filters: {
    roles: true,
    assignedEmployee: { emails: [{ address: true }] },
  },
  options: {
    roles: Object.values(ROLES),
    address: getAdminsEmails(),
  },
}));

export default Composer.compose(
  withQueryUsers,
  withUsersTableFilters,
);
