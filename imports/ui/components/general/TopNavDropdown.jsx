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

const getMenuItems = props => {
  const isAdmin = Roles.userIsInRole(props.currentUser._id, 'admin');
  const isPartner = Roles.userIsInRole(props.currentUser._id, 'partner');
  return [
    {
      label: 'Admin Home',
      link: '/admin',
      show: isAdmin,
    },
    {
      label: 'Partner Home',
      link: '/partner',
      show: isPartner,
    },
    {
      label: 'Dashboard',
      link: '/app',
      show: !isAdmin && !isPartner,
    },
    {
      label: 'Mon Profil',
      link: '/app/profile',
      show: !isAdmin && !isPartner,
    },
    {
      label: 'Contact',
      link: '/app/contact',
      show: !isAdmin && !isPartner,
    },
  ];
};

// Shows a sign out link for all types of users, but:
// an admin link for admins,
// a partner link for partners,
// a home, settings, and contact link for regular users
const TopNavDropdown = props => (
  <IconMenu
    iconButtonElement={
      <IconButton tooltip="">
        <Person color="#333333" hoverColor="#888888" />
      </IconButton>
    }
    anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
    targetOrigin={{ horizontal: 'right', vertical: 'top' }}
  >
    {getMenuItems(props).map(
      item =>
        item.show &&
        <MenuItem
          key={item.link}
          primaryText={item.label}
          containerElement={<Link to={item.link} />}
        />,
    )}
    <Divider />
    <MenuItem
      primaryText="Déconnexion"
      onTouchTap={() => Meteor.logout(() => props.history.push('/home'))}
    />
  </IconMenu>
);

TopNavDropdown.propTypes = {
  currentUser: PropTypes.objectOf(PropTypes.any).isRequired,
};

export default TopNavDropdown;
