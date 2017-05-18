import PropTypes from 'prop-types';
import React from 'react';
import { Roles } from 'meteor/alanning:roles';
import { Redirect } from 'react-router-dom';
import classnames from 'classnames';
import { spring } from 'react-motion';

import TopNav from '/imports/ui/components/general/TopNav.jsx';
import SideNavUser from '/imports/ui/components/general/SideNavUser.jsx';
import SideNav from '/imports/ui/components/general/SideNav.jsx';
import RouteTransition from '/imports/ui/components/general/RouteTransition.jsx';
import ContactButton from '/imports/ui/components/general/ContactButton.jsx';
const getRedirect = props => {
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
      if (props.loanRequests.length >= 1 && props.history.location.pathname === '/app') {
        return `/app/requests/${props.loanRequests[0]._id}`;
      }
      // If there is no active request, force route to dashboard, except if
      // user is on dashboard, profile, or contact page
      if (
        props.loanRequests.length < 1 &&
        (props.history.location.pathname !== '/app' &&
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

const AppLayout = props => {
  const redirect = getRedirect(props);
  const isUser = Roles.userIsInRole(props.currentUser, 'user');
  const classes = classnames({
    'app-layout': true,
    'always-side-nav': props.type === 'admin',
  });

  if (redirect) {
    return <Redirect to={redirect} />;
  }
  return (
    <div>
      <TopNav {...props} public={false} />
      {isUser
        ? <div className="hidden-xs"><SideNavUser {...props} /></div>
        : <SideNav {...props} />}

      <main className={classes}>
        {/* <RouteTransition pathname={props.history.location.pathname}> */}
        <div className="wrapper">
          {props.render(props)}
        </div>
        {/* </RouteTransition> */}
      </main>

      {props.history.location.pathname.slice(0, 4) === '/app' && <ContactButton />}
    </div>
  );
};

AppLayout.defaultProps = {
  type: 'user',
  render: () => null,
  currentUser: undefined,
  noNav: false,
};

AppLayout.propTypes = {
  type: PropTypes.string,
  render: PropTypes.func,
  currentUser: PropTypes.objectOf(PropTypes.any),
  noNav: PropTypes.bool,
};

export default AppLayout;
