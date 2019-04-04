import PropTypes from 'prop-types';
import React from 'react';
import { Redirect } from 'react-router-dom';
import classnames from 'classnames';

import ContactButton from 'core/components/ContactButton';
import { LayoutErrorBoundary } from 'core/components/ErrorBoundary';
import Navs from './Navs';
import AppLayoutContainer from './AppLayoutContainer';

const AppLayout = ({
  children,
  redirect,
  history,
  shouldShowSideNav,
  ...props
}) => {
  const classes = classnames('app-layout', { 'no-nav': !shouldShowSideNav });

  if (redirect) {
    return <Redirect to={redirect} />;
  }

  return (
    <div className="app-root">
      <Navs {...props} shouldShowSideNav={shouldShowSideNav} />

      <div className={classes}>
        <LayoutErrorBoundary>
          <div className="wrapper">{React.cloneElement(children, props)}</div>
        </LayoutErrorBoundary>
      </div>

      <ContactButton />
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
