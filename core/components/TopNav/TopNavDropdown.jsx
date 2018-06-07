import PropTypes from 'prop-types';
import React from 'react';
import { Meteor } from 'meteor/meteor';
import { Roles } from 'meteor/alanning:roles';

import { handleLoggedOut } from 'core/utils/history';
import track from '../../utils/analytics';
import T from '../Translation';
import DropdownMenu from '../DropdownMenu';

// Shows a sign out link for all types of users, but:
// an admin link for admins,
// a partner link for partners,
// a home, settings, and contact link for regular users
const getMenuItems = (currentUser) => {
  const isDev = Roles.userIsInRole(currentUser._id, 'dev');
  return [
    {
      id: 'app',
      link: '/',
      icon: 'app',
      show: true,
    },
    {
      id: 'account',
      link: '/profile',
      icon: 'accountCircle',
      secondary: currentUser.emails[0].address,
      show: true,
    },
    {
      id: 'dev',
      link: '/dev',
      show: isDev,
      icon: 'developerMode',
    },
    {
      id: 'logout',
      label: <T id="general.logout" />,
      onClick: () => {
        track('TopNavDropdown - logged out', {});
        Meteor.logout(() =>
          handleLoggedOut(`${Meteor.settings.public.subdomains.www}`));
      },
      link: '/',
      show: true,
      dividerTop: true,
      icon: 'powerOff',
    },
  ];
};

const TopNavDropdown = ({ currentUser, history }) => (
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
    options={getMenuItems(currentUser)
      // Allow the Divider to go through
      .filter(o => !!o.show)
      .map(({ id: optionId, link, label, show, ...rest }) => ({
        ...rest,
        id: optionId,
        link: true,
        to: link,
        label: label || <T id={`TopNavDropdown.${optionId}`} />,
        history, // required for Link to work
      }))}
  />
);

TopNavDropdown.propTypes = {
  currentUser: PropTypes.objectOf(PropTypes.any).isRequired,
  history: PropTypes.object.isRequired,
};

export default TopNavDropdown;
