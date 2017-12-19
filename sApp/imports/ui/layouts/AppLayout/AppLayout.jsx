import PropTypes from 'prop-types';
import React from 'react';
import { Roles } from 'meteor/alanning:roles';
import { Redirect } from 'react-router-dom';
import classnames from 'classnames';

import ContactButton from '/imports/ui/components/general/ContactButton';
import ErrorBoundary from 'core/components/ErrorBoundary';
import track from 'core/utils/analytics';
import Navs from './Navs';

// import UserJoyride from '/imports/ui/components/general/UserJoyride';

const getRedirect = (props) => {
  const isAdmin = Roles.userIsInRole(props.currentUser, 'admin');
  const isPartner = Roles.userIsInRole(props.currentUser, 'partner');
  const isDev = Roles.userIsInRole(props.currentUser, 'dev');

  if (!props.currentUser) {
    return '/login';
  }

  if (isDev) {
    return false;
  }

  switch (props.type) {
    case 'user': {
      if (isAdmin) {
        return '/admin';
      } else if (isPartner) {
        return '/isPartner';
      }
      // If there is no active request, force route to app page, except if
      // user is on app, profile, or contact page
      if (
        props.loanRequests &&
        props.loanRequests.length < 1 &&
        (props.history.location.pathname !== '/app' &&
          props.history.location.pathname !== '/app/compare' &&
          props.history.location.pathname !== '/app/profile' &&
          props.history.location.pathname !== '/app/contact')
      ) {
        return '/app';
      }
      break;
    }
    case 'admin': {
      if (isPartner) {
        return '/partner';
      } else if (!isAdmin) {
        return '/app';
      }
      break;
    }
    case 'partner': {
      if (isAdmin) {
        return '/admin';
      } else if (!isPartner) {
        return '/app';
      }
      break;
    }
    default:
      throw new Error('invalid layout type');
  }

  return false;
};

const getShowSideNav = ({ location }) =>
  !(location.pathname === '/app' || location.pathname === '/app/compare');

const AppLayout = (props) => {
  const { type, history, render } = props;
  const redirect = getRedirect(props);
  const showSideNav = getShowSideNav(history);
  const classes = classnames({
    'app-layout': true,
    'always-side-nav': type === 'admin',
    'no-nav': !showSideNav,
  });
  const path = history.location.pathname;
  const isApp = path.slice(0, 4) === '/app';
  const isLogin = path.slice(0, 6) === '/login';

  if (redirect && !isLogin) {
    track('AppLayout - was redirected', {
      from: history.location.pathname,
      to: redirect,
    });
    return <Redirect to={redirect} />;
  }
  return (
    <div>
      <Navs
        {...props}
        showSideNav={showSideNav}
        isApp={isApp}
        isAdmin={type === 'admin'}
      />

      <main className={classes}>
        <ErrorBoundary helper="layout" pathname={history.location.pathname}>
          <div x="wrapper">{render(props)}</div>
        </ErrorBoundary>
      </main>

      {isApp && <ContactButton history={history} />}
    </div>
  );
};

AppLayout.defaultProps = {
  type: 'user',
  render: () => null,
  currentUser: undefined,
  noNav: false,
  loanRequests: undefined,
};

AppLayout.propTypes = {
  type: PropTypes.string,
  render: PropTypes.func,
  currentUser: PropTypes.objectOf(PropTypes.any),
  noNav: PropTypes.bool,
  loanRequests: PropTypes.arrayOf(PropTypes.object),
  history: PropTypes.objectOf(PropTypes.any).isRequired,
};

export default AppLayout;
