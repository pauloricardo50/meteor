import React from 'react';
import { ROLES } from 'core/api/constants';

const hasRole = ({ roles }, role) => roles.includes(role);

const formatCurrentUser = user =>
  (user
    ? {
      ...user,
      isDev: hasRole(user, ROLES.DEV),
      isUser: hasRole(user, ROLES.USER),
      isAdmin: hasRole(user, ROLES.ADMIN),
      isPro: hasRole(user, ROLES.PRO),
    }
    : null);

export const CurrentUserContext = React.createContext();

export const injectCurrentUser = Component => (props) => {
  const { currentUser } = props;

  return (
    <CurrentUserContext.Provider value={formatCurrentUser(currentUser)}>
      <Component {...props} />
    </CurrentUserContext.Provider>
  );
};
