import { Roles } from 'meteor/alanning:roles';

import React from 'react';
import omit from 'lodash/omit';
import { compose, mapProps, withProps } from 'recompose';

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
    ({ collection, makeClientSideFilter = () => () => true, ...props }) => {
      const data = props[collection];
      return {
        [collection]: data.filter(makeClientSideFilter(props)),
      };
    },
  ),
  withProps(() => {
    const { all: devAndAdmins, advisors: admins } = useAdmins();
    const currentUser = useCurrentUser();

    return {
      devAndAdmins,
      admins,
      devs: devAndAdmins.filter(user => Roles.userIsInRole(user, ROLES.DEV)),
      currentUser,
    };
  }),
  mapProps(({ groupData, collection, ...props }) => {
    const filteredProps = omit(props, [collection]);
    return {
      data: groupData({ [collection]: props[collection], ...filteredProps }),
      ...filteredProps,
    };
  }),
);
