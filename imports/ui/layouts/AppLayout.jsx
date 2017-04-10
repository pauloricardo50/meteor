import React, { PropTypes } from 'react';
import { Roles } from 'meteor/alanning:roles';
import { Redirect } from 'react-router-dom';
import classnames from 'classnames';
import { spring } from 'react-motion';

import SideNav from '/imports/ui/components/general/SideNav.jsx';
import BottomNav from '/imports/ui/components/general/BottomNav.jsx';
import RouteTransition
  from '/imports/ui/components/general/RouteTransition.jsx';

const getRedirect = props => {
  const isAdmin = Roles.userIsInRole(props.currentUser, 'admin');
  const isPartner = Roles.userIsInRole(props.currentUser, 'partner');

  if (!props.currentUser) {
    return '/login';
  }

  switch (props.type) {
    case 'user': {
      if (isAdmin) {
        return '/admin';
      } else if (isPartner) {
        return '/isPartner';
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

const myStyles = {
  wrapper: {
    position: 'absolute',
    width: '100%',
  },
};

const AppLayout = props => {
  const redirect = getRedirect(props);
  const classes = classnames({
    'app-layout': true,
    'always-side-nav': props.type === 'admin',
  });

  if (redirect) {
    return <Redirect to={redirect} />;
  }
  return (
    <div>
      {props.location.pathname.substring(5, 8) !== 'new' &&
        <SideNav {...props} />}

      <main className={classes}>
        {/* <RouteTransition pathname={props.history.location.pathname}> */}
        <div className="wrapper">
          {props.render(props)}
        </div>
        {/* </RouteTransition> */}
      </main>

      {!props.noNav && props.type !== 'admin' && <BottomNav {...props} />}
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
