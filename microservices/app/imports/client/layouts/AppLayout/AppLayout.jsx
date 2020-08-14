import React from 'react';
import classnames from 'classnames';
import PropTypes from 'prop-types';
import { Redirect, useHistory } from 'react-router-dom';

import { APPLICATION_TYPES } from 'core/api/loans/loanConstants';
import { LayoutErrorBoundary } from 'core/components/ErrorBoundary';
import ImpersonateNotification from 'core/components/ImpersonateNotification';
import useCurrentUser from 'core/hooks/useCurrentUser';
import useIntercom from 'core/hooks/useIntercom';

import AnonymousLoanClaimer from './AnonymousLoanClaimer';
import AnonymousLoanRemover from './AnonymousLoanRemover';
import AppLayoutContainer from './AppLayoutContainer';
import { useAppRedirect } from './appLayoutHelpers';
import Navs from './Navs';
import { useSideNavContext } from './SideNavContext';

const exactMobilePaths = ['/account', '/'];
const mobilePaths = ['/enroll-account', '/reset-password', '/signup'];

const renderMobile = (loan, history) => {
  const isSimple = loan?.applicationType === APPLICATION_TYPES.SIMPLE;

  if (isSimple) {
    return true;
  }
  if (exactMobilePaths.some(path => history.location.pathname === path)) {
    return true;
  }
  if (mobilePaths.some(path => history.location.pathname.startsWith(path))) {
    return true;
  }

  return false;
};

const AppLayout = ({ children, ...props }) => {
  const shouldShowSideNav = useSideNavContext();
  const currentUser = useCurrentUser();
  const redirect = useAppRedirect();
  const classes = classnames('app-layout', { 'no-nav': !shouldShowSideNav });
  const history = useHistory();
  const rootClasses = classnames('app-root', {
    mobile: renderMobile(props.loan, history),
  });
  useIntercom();

  if (redirect) {
    return <Redirect to={redirect} />;
  }

  return (
    <div className={rootClasses}>
      <Navs {...props} shouldShowSideNav={shouldShowSideNav} />
      <div className={classes} id="scroll-layout">
        <LayoutErrorBoundary>
          <div className="wrapper">
            {React.cloneElement(children, { ...props, currentUser })}
          </div>
        </LayoutErrorBoundary>
      </div>

      <ImpersonateNotification />
      {currentUser && <AnonymousLoanClaimer currentUser={currentUser} />}
      <AnonymousLoanRemover />
    </div>
  );
};

AppLayout.propTypes = {
  children: PropTypes.node.isRequired,
  currentUser: PropTypes.objectOf(PropTypes.any),
};

AppLayout.defaultProps = {
  currentUser: undefined,
};

export default AppLayoutContainer(AppLayout);
