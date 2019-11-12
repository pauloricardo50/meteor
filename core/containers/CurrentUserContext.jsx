import React from 'react';
import { compose, mapProps } from 'recompose';

import withSmartQuery from 'core/api/containerToolkit/withSmartQuery';
import { ROLES } from 'core/api/constants';

const hasRole = ({ roles }, role) => roles.includes(role);

const formatCurrentUser = user => {
  if (user) {
    return {
      ...user,
      isDev: hasRole(user, ROLES.DEV),
      isUser: hasRole(user, ROLES.USER),
      isAdmin: hasRole(user, ROLES.ADMIN),
      isPro: hasRole(user, ROLES.PRO),
    };
  }

  return null;
};

export const CurrentUserContext = React.createContext();

export const queryContainer = compose(
  withSmartQuery({
    query: ({ query }) => query,
    params: ({ params, ...props }) => params && params(props),
    queryOptions: { reactive: true, single: true },
    dataName: 'currentUser',
    renderMissingDoc: false,
  }),
  mapProps(({ query, params, ...rest }) => rest),
);

const ContextProvider = ({ currentUser, children }) => (
  <CurrentUserContext.Provider value={formatCurrentUser(currentUser)}>
    {children}
  </CurrentUserContext.Provider>
);

export const InjectCurrentUser = queryContainer(ContextProvider);
