import React from 'react';

import { APPLICATION_TYPES } from 'core/api/constants';

export const { Consumer, Provider } = React.createContext();

const routesWithoutSidenav = ['/'];

const getShowSideNav = ({ location }, { applicationType }) =>
  routesWithoutSidenav.indexOf(location.pathname) === -1
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
