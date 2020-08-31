import { Roles } from 'meteor/alanning:roles';

import { compose, withProps } from 'recompose';

import { withSmartQuery } from 'core/api/containerToolkit';
import { ROLES } from 'core/api/users/userConstants';
import useCurrentUser from 'core/hooks/useCurrentUser';

import { useAdmins } from '../AdminsContext/AdminsContext';

export default compose(
  withSmartQuery({
    query: ({ collection }) => collection,
    params: ({ options, getQueryFilters, getQueryBody }) => ({
      $filters: getQueryFilters(options),
      ...getQueryBody(options),
    }),
    dataName: ({ collection }) => collection,
    queryOptions: { pollingMs: 5000 },
    deps: ({ options }) => Object.values(options),
  }),
  withProps(
    ({
      collection,
      makeClientSideFilter = () => () => true,
      groupData,
      ...rest
    }) => {
      const { all: devAndAdmins, advisors: admins } = useAdmins();
      const currentUser = useCurrentUser();
      const devs = devAndAdmins?.filter(user =>
        Roles.userIsInRole(user, ROLES.DEV),
      );

      const props = { devAndAdmins, admins, devs, currentUser, ...rest };

      const data = groupData({
        [collection]: props[collection].filter(makeClientSideFilter(props)),
        ...props,
      });

      return {
        data,
        ...props,
      };
    },
  ),
);
