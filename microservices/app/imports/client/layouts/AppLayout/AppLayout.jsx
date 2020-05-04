import React, { useContext } from 'react';
import classnames from 'classnames';
import PropTypes from 'prop-types';
import { Redirect } from 'react-router-dom';

import { APPLICATION_TYPES } from 'core/api/loans/loanConstants';
import ContactButton from 'core/components/ContactButton';
import { LayoutErrorBoundary } from 'core/components/ErrorBoundary';
import { CurrentUserContext } from 'core/containers/CurrentUserContext';

import AnonymousLoanClaimer from './AnonymousLoanClaimer';
import AnonymousLoanRemover from './AnonymousLoanRemover';
import AppLayoutContainer from './AppLayoutContainer';
import Navs from './Navs';

const exactMobilePaths = ['/account', '/'];
const mobilePaths = ['/enroll-account', '/reset-password', '/signup'];

const renderMobile = props => {
  const {
    history: {
      location: { pathname },
    },
    loan,
  } = props;
  const isSimple = loan && loan.applicationType === APPLICATION_TYPES.SIMPLE;

  if (isSimple) {
    return true;
  }
  if (exactMobilePaths.some(path => pathname === path)) {
    return true;
  }
  if (mobilePaths.some(path => pathname.startsWith(path))) {
    return true;
  }

  return false;
};

const AppLayout = ({ children, redirect, shouldShowSideNav, ...props }) => {
  const currentUser = useContext(CurrentUserContext);
  const classes = classnames('app-layout', { 'no-nav': !shouldShowSideNav });
  const rootClasses = classnames('app-root', { mobile: renderMobile(props) });

  if (redirect) {
    return <Redirect to={redirect} />;
  }

  return (
    <div className={rootClasses}>
      <Navs
        {...props}
        shouldShowSideNav={shouldShowSideNav}
        currentUser={currentUser}
      />
      <div className={classes} id="scroll-layout">
        <LayoutErrorBoundary>
          <div className="wrapper">
            {React.cloneElement(children, { ...props, currentUser })}
          </div>
        </LayoutErrorBoundary>
      </div>

      <ContactButton currentUser={currentUser} />
      {currentUser && <AnonymousLoanClaimer currentUser={currentUser} />}
      <AnonymousLoanRemover />
    </div>
  );
};

AppLayout.propTypes = {
  children: PropTypes.node.isRequired,
  currentUser: PropTypes.objectOf(PropTypes.any),
  history: PropTypes.objectOf(PropTypes.any).isRequired,
  shouldShowSideNav: PropTypes.bool.isRequired,
};

AppLayout.defaultProps = {
  currentUser: undefined,
};

export default AppLayoutContainer(AppLayout);
