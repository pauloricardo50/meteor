import React from 'react';

import useCurrentUser from 'core/hooks/useCurrentUser';

import AppPageLoggedIn from './AppPageLoggedIn';
import AppPageLoggedOut from './AppPageLoggedOut';

const AppRootPage = () => {
  const currentUser = useCurrentUser();

  if (currentUser === null) {
    return <AppPageLoggedOut />;
  }

  if (currentUser) {
    return <AppPageLoggedIn />;
  }

  // Wait for currentUser query to load
  return null;
};

export default AppRootPage;
