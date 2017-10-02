import PropTypes from 'prop-types';
import React from 'react';
import { Meteor } from 'meteor/meteor';
import { Roles } from 'meteor/alanning:roles';

import track from '/imports/js/helpers/analytics';
import { T } from '../Translation';
import DropdownMenu from '../DropdownMenu';

// Shows a sign out link for all types of users, but:
// an admin link for admins,
// a partner link for partners,
// a home, settings, and contact link for regular users
const getMenuItems = (currentUser, history) => {
  const isDev = Roles.userIsInRole(currentUser._id, 'dev');
  const isAdmin = Roles.userIsInRole(currentUser._id, 'admin');
  const isPartner = Roles.userIsInRole(currentUser._id, 'partner');
  return [
    {
      id: 'admin',
      link: '/admin',
      show: isAdmin,
      icon: 'app',
    },
    {
      id: 'partner',
      link: '/partner',
      show: isPartner,
      icon: 'app',
    },
    {
      id: 'app',
      link: '/app',
      show: !isAdmin && !isPartner,
      icon: 'app',
    },
    {
      id: 'account',
      link: '/app/profile',
      show: !isAdmin && !isPartner,
      icon: 'accountCircle',
    },
    {
      id: 'dev',
      link: '/app/dev',
      show: isDev,
    },
    {
      id: 'logout',
      label: <T id="general.logout" />,
      onClick: () => {
        track('TopNavDropdown - logged out', {});
        Meteor.logout(() => history.push('/home'));
      },
      link: '/home',
      show: true,
      dividerTop: true,
      icon: 'powerOff',
    },
  ];
};

const TopNavDropdown = (props) => {
  const { currentUser, history } = props;

  return (
    <DropdownMenu
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'left',
      }}
      transformOrigin={{
        vertical: 'bottom',
        horizontal: 'left',
      }}
      iconType="person"
      options={getMenuItems(currentUser, history)
        // Allow the Divider to go through
        .filter(o => !!o.show)
        .map(({ id: optionId, link, label, ...rest }) => ({
          ...rest,
          id: optionId,
          link: true,
          to: link,
          label: label || <T id={`TopNavDropdown.${optionId}`} />,
          history, // required for Link to work
        }))}
      tooltip={currentUser.emails[0].address}
      tooltipPosition="bottom-end"
    />
  );
};

TopNavDropdown.propTypes = {
  currentUser: PropTypes.objectOf(PropTypes.any).isRequired,
  history: PropTypes.object.isRequired,
};

export default TopNavDropdown;
