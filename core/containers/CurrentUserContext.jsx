import { Roles } from 'meteor/alanning:roles';

import React from 'react';

import { ROLES } from '../api/users/userConstants';
import useMeteorData from '../hooks/useMeteorData';

const formatCurrentUser = user => {
  if (user) {
    return {
      ...user,
      isDev: Roles.userIsInRole(user, ROLES.DEV),
      isUser: Roles.userIsInRole(user, ROLES.USER),
      isAdmin: Roles.userIsInRole(user, ROLES.ADMIN),
      isPro: Roles.userIsInRole(user, ROLES.PRO),
    };
  }

  return user;
};

export const CurrentUserContext = React.createContext();

export const CurrentUserProvider = ({ query, params, deps = [], children }) => {
  const { data, loading } = useMeteorData(
    {
      query,
      params,
      reactive: true,
      type: 'single',
    },
    deps,
  );

  const currentUser = loading ? undefined : data || null;

  return (
    <CurrentUserContext.Provider value={formatCurrentUser(currentUser)}>
      {children}
    </CurrentUserContext.Provider>
  );
};

export default CurrentUserContext;
