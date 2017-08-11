import PropTypes from 'prop-types';
import React from 'react';
import { Roles } from 'meteor/alanning:roles';
import { Redirect } from 'react-router-dom';
import classnames from 'classnames';

import TopNav from '/imports/ui/components/general/TopNav.jsx';
import SideNavUser from '/imports/ui/components/general/SideNavUser.jsx';
import SideNav from '/imports/ui/components/general/SideNav.jsx';
import ContactButton from '/imports/ui/components/general/ContactButton.jsx';
import track from '/imports/js/helpers/analytics';

// import UserJoyride from '/imports/ui/components/general/UserJoyride.jsx';

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

const showNav = ({ location }) => {
  if (location.pathname === '/app' || location.pathname === '/app/compare') {
    return false;
  }

  return true;
};

const AppLayout = (props) => {
  const { type, history, render } = props;
  const redirect = getRedirect(props);
  const classes = classnames({
    'app-layout': true,
    'always-side-nav': type === 'admin',
    'no-nav': !showNav(history),
  });

  const isApp = history.location.pathname.slice(0, 4) === '/app';

  if (redirect) {
    track('AppLayout - was redirected', {
      from: history.location.pathname,
      to: redirect,
    });
    return <Redirect to={redirect} />;
  }
  return (
    <div>
      {/* {isApp && <UserJoyride />} */}

      <TopNav {...props} public={false} />

      {showNav(history) &&
        (isApp ? <SideNavUser {...props} fixed /> : <SideNav {...props} />)}

      <main className={classes}>
        {/* <RouteTransition pathname={props.history.location.pathname}> */}
        <div className="wrapper">
          {render(props)}
        </div>
        {/* </RouteTransition> */}
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
