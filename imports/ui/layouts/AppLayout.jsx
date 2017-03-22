import React, { PropTypes } from 'react';
import { Roles } from 'meteor/alanning:roles';
import { Redirect } from 'react-router-dom';
import classnames from 'classnames';

import SideNav from '/imports/ui/components/general/SideNav.jsx';
import BottomNav from '/imports/ui/components/general/BottomNav.jsx';

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
  const classes = classnames({
    'app-layout': true,
    'always-side-nav': props.type === 'admin',
  });

  return redirect
    ? <Redirect to={redirect} />
    : <div>
        <SideNav {...props} />

        <main className={classes}>
          <div className="center-wrapper">
            {props.render(props)}
          </div>
        </main>

        {!props.noNav && props.type !== 'admin' && <BottomNav {...props} />}
      </div>;
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
