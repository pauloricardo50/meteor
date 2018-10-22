import PropTypes from 'prop-types';
import React from 'react';
import { Redirect } from 'react-router-dom';
import classnames from 'classnames';

import ContactButton from 'core/components/ContactButton';
import { LayoutErrorBoundary } from 'core/components/ErrorBoundary';
import Navs from './Navs';
import AppLayoutContainer from './AppLayoutContainer';

const routesWithoutSidenav = ['/'];

const getShowSideNav = ({ location }) =>
  routesWithoutSidenav.indexOf(location.pathname) === -1;

const AppLayout = (props) => {
  const { history, children, redirect } = props;
  const showSideNav = getShowSideNav(history);
  const classes = classnames('app-layout', { 'no-nav': !showSideNav });

  if (redirect) {
    return <Redirect to={redirect} />;
  }

  console.log('loan:', props.loan);

  return (
    <div className="app-root">
      <Navs {...props} showSideNav={showSideNav} />

      <div className={classes}>
        <LayoutErrorBoundary>
          <div className="wrapper">{React.cloneElement(children, props)}</div>
        </LayoutErrorBoundary>
      </div>

      <ContactButton history={history} />
    </div>
  );
};

AppLayout.propTypes = {
  children: PropTypes.node.isRequired,
  currentUser: PropTypes.objectOf(PropTypes.any),
  history: PropTypes.objectOf(PropTypes.any).isRequired,
};

AppLayout.defaultProps = {
  currentUser: undefined,
};

export default AppLayoutContainer(AppLayout);
