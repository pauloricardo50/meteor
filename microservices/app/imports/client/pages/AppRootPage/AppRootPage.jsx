import React from 'react';

import AppPageLoggedIn from './AppPageLoggedIn';
import AppPageLoggedOut from './AppPageLoggedOut';

const AppRootPage = ({ currentUser }) => {
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
