import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';

import React, { useContext } from 'react';

import { ROLES } from 'core/api/constants';

const hasRole = ({ roles }, role) => roles.includes(role);

const formatCurrentUser = (user) => {
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

// Meteor.user() is a faster user store than our user queries.
// So return meteorUser first, and then override it on the layout with the proper
// user id
export const InjectMeteorUser = withTracker(() => ({
  meteorUser: Meteor.user(),
}))(({ meteorUser, children }) => (
  <CurrentUserContext.Provider value={meteorUser}>
    {children}
  </CurrentUserContext.Provider>
));

export const injectCurrentUser = Component => (props) => {
  const meteorCurrentUser = useContext(CurrentUserContext);
  const { currentUser } = props;
  const formattedUser = formatCurrentUser(currentUser);
  const user = formattedUser || meteorCurrentUser;

  if (!formattedUser) {
    return <Component {...props} />;
  }

  return (
    <CurrentUserContext.Provider value={user}>
      <Component {...props} currentUser={user} />
    </CurrentUserContext.Provider>
  );
};
