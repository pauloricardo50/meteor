import React, { useContext } from 'react';
import { useHistory } from 'react-router-dom';

export const SideNavContext = React.createContext();

const exactRoutesWithoutSidenav = ['/'];
const routesWithoutSidenav = [
  { route: '/enroll-account', func: 'startsWith' },
  { route: '/reset-password', func: 'startsWith' },
  { route: '/signup', func: 'startsWith' },
  // This avoids writing a path matching algorithm for /onboarding and
  // /loans/:loanId/onboarding
  { route: '/onboarding', func: 'startsWith' },
  { route: '/onboarding', func: 'endsWith' },
];

const getShowSideNav = ({ location }) =>
  exactRoutesWithoutSidenav.indexOf(location.pathname) === -1 &&
  routesWithoutSidenav.every(
    ({ route, func }) => !location.pathname[func](route),
  );

export const withSideNavContextProvider = Component => props => (
  <SideNavContext.Provider value={getShowSideNav(useHistory())}>
    <Component {...props} />
  </SideNavContext.Provider>
);

export const useSideNavContext = () => useContext(SideNavContext);
