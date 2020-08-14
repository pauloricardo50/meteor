import React, { useContext } from 'react';
import { useHistory } from 'react-router-dom';

import { APPLICATION_TYPES } from 'core/api/loans/loanConstants';

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

const getShowSideNav = ({ location }, { applicationType }) =>
  exactRoutesWithoutSidenav.indexOf(location.pathname) === -1 &&
  routesWithoutSidenav.every(
    ({ route, func }) => !location.pathname[func](route),
  ) &&
  applicationType !== APPLICATION_TYPES.SIMPLE;

export const withSideNavContextProvider = Component => props => {
  const history = useHistory();
  const { loan } = props;
  return (
    <SideNavContext.Provider value={getShowSideNav(history, loan)}>
      <Component {...props} />
    </SideNavContext.Provider>
  );
};

export const useSideNavContext = () => useContext(SideNavContext);
