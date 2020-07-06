import { Roles } from 'meteor/alanning:roles';

import React from 'react';
import { compose, mapProps } from 'recompose';

import withSmartQuery from '../api/containerToolkit/withSmartQuery';
import { ROLES } from '../api/users/userConstants';

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

  return null;
};

export const CurrentUserContext = React.createContext();

export const queryContainer = compose(
  withSmartQuery({
    query: ({ query }) => query,
    params: ({ params, ...props }) =>
      typeof params === 'function' ? params(props) : params,
    queryOptions: { reactive: true, single: true },
    dataName: 'currentUser',
    renderMissingDoc: false,
    deps: ({ deps }) => deps,
  }),
  mapProps(({ query, params, ...rest }) => rest),
);

const ContextProvider = ({ currentUser, children }) => (
  <CurrentUserContext.Provider value={formatCurrentUser(currentUser)}>
    {children}
  </CurrentUserContext.Provider>
);

export const InjectCurrentUser = queryContainer(ContextProvider);

export default CurrentUserContext;
