import React from 'react';

import { APPLICATION_TYPES } from 'core/api/constants';

export const { Consumer, Provider } = React.createContext();

const exactRoutesWithoutSidenav = ['/'];
const routesWithoutSidenav = ['/enroll-account', '/reset-password', '/signup'];

const getShowSideNav = ({ location }, { applicationType }) =>
  exactRoutesWithoutSidenav.indexOf(location.pathname) === -1
  && routesWithoutSidenav.every(route => !location.pathname.startsWith(route))
  && applicationType !== APPLICATION_TYPES.SIMPLE;

export const withSideNavContextProvider = Component => (props) => {
  const { history, loan } = props;
  return (
    <Provider value={getShowSideNav(history, loan)}>
      <Component {...props} />
    </Provider>
  );
};

export const withSideNavContext = Component => props => (
  <Consumer>
    {shouldShowSideNav => (
      <Component {...props} shouldShowSideNav={shouldShowSideNav} />
    )}
  </Consumer>
);
