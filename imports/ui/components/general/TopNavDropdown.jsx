import PropTypes from 'prop-types';
import React from 'react';
import { Meteor } from 'meteor/meteor';
import { Roles } from 'meteor/alanning:roles';
import { Link } from 'react-router-dom';

import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import IconButton from 'material-ui/IconButton';
import Divider from 'material-ui/Divider';
import Person from 'material-ui/svg-icons/social/person';

import { T } from '/imports/ui/components/general/Translation.jsx';
import track from '/imports/js/helpers/analytics';

const getMenuItems = (currentUser) => {
  const isDev = Roles.userIsInRole(currentUser._id, 'dev');
  const isAdmin = Roles.userIsInRole(currentUser._id, 'admin');
  const isPartner = Roles.userIsInRole(currentUser._id, 'partner');
  return [
    {
      id: 'admin',
      link: '/admin',
      show: isAdmin,
    },
    {
      id: 'partner',
      link: '/partner',
      show: isPartner,
    },
    {
      id: 'app',
      link: '/app',
      show: !isAdmin && !isPartner,
    },
    {
      id: 'account',
      link: '/app/profile',
      show: !isAdmin && !isPartner,
    },
    {
      id: 'dev',
      link: '/app/dev',
      show: isDev,
    },
  ];
};

// Shows a sign out link for all types of users, but:
// an admin link for admins,
// a partner link for partners,
// a home, settings, and contact link for regular users
const TopNavDropdown = ({ currentUser, history }) =>
  (<IconMenu
    iconButtonElement={
      <IconButton tooltip={currentUser.emails[0].address}>
        <Person color="#444" hoverColor="#888" />
      </IconButton>
    }
    anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
    targetOrigin={{ horizontal: 'right', vertical: 'top' }}
  >
    {getMenuItems(currentUser).map(
      item =>
        item.show &&
        <MenuItem
          key={item.link}
          primaryText={<T id={`TopNavDropdown.${item.id}`} />}
          containerElement={
            <Link
              to={item.link}
              onTouchTap={() => {
                track('TopNavDropdown - clicked on link', {
                  from: history.location.pathname,
                  to: item.link,
                });
              }}
            />
          }
        />,
    )}
    <Divider />
    <MenuItem
      primaryText={<T id="general.logout" />}
      onTouchTap={() => {
        track('TopNavDropdown - logged out', {});
        Meteor.logout(() => history.push('/home'));
      }}
    />
  </IconMenu>);

TopNavDropdown.propTypes = {
  currentUser: PropTypes.objectOf(PropTypes.any).isRequired,
  history: PropTypes.object.isRequired,
};

export default TopNavDropdown;
