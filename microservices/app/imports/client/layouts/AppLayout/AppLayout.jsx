import PropTypes from 'prop-types';
import React, { useEffect } from 'react';
import { Redirect } from 'react-router-dom';
import classnames from 'classnames';

import ContactButton from 'core/components/ContactButton';
import { LayoutErrorBoundary } from 'core/components/ErrorBoundary';
import { APPLICATION_TYPES } from 'imports/core/api/constants';
import Navs from './Navs';
import AppLayoutContainer from './AppLayoutContainer';
import AnonymousLoanClaimer from './AnonymousLoanClaimer';
import AnonymousLoanRemover from './AnonymousLoanRemover';
import impersonatedSessionNotification from './impersonatedSessionNotification';

const exactMobilePaths = ['/account', '/'];
const mobilePaths = ['/enroll-account', '/reset-password'];

const renderMobile = (props) => {
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
  const classes = classnames('app-layout', { 'no-nav': !shouldShowSideNav });
  const rootClasses = classnames('app-root', { mobile: renderMobile(props) });
  const { history } = props;

  if (redirect) {
    return <Redirect to={redirect} />;
  }

  useEffect(() => {
    impersonatedSessionNotification(props);
  }, [props.impersonatedSession]);

  return (
    <div className={rootClasses}>
      <Navs {...props} shouldShowSideNav={shouldShowSideNav} />
      <div className={classes} id="scroll-layout">
        <LayoutErrorBoundary>
          <div className="wrapper">{React.cloneElement(children, props)}</div>
        </LayoutErrorBoundary>
      </div>

      <ContactButton currentUser={props.currentUser} />
      {props.currentUser && (
        <AnonymousLoanClaimer currentUser={props.currentUser} />
      )}
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
