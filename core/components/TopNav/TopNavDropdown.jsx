import PropTypes from 'prop-types';
import React from 'react';
import { Meteor } from 'meteor/meteor';
import { Roles } from 'meteor/alanning:roles';
import { Sesssion } from 'meteor/session';

import { IMPERSONATE_SESSION_KEY } from 'core/api/impersonation/impersonation';
import track from '../../utils/analytics';
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
      link: '/',
      show: !isAdmin && !isPartner,
      icon: 'app',
    },
    {
      id: 'account',
      link: '/profile',
      show: !isAdmin && !isPartner,
      icon: 'accountCircle',
    },
    {
      id: 'dev',
      link: '/dev',
      show: isDev,
    },
    {
      id: 'logout',
      label: <T id="general.logout" />,
      onClick: () => {
        track('TopNavDropdown - logged out', {});
        Meteor.logout(() => {
          Session.clear(IMPERSONATE_SESSION_KEY);

          return window.location.replace(
            `${Meteor.settings.public.subdomains.www}`,
          );
        });
      },
      link: '/',
      show: true,
      dividerTop: true,
      icon: 'powerOff',
    },
  ];
};

const TopNavDropdown = props => {
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
      // tooltip={currentUser.emails[0].address}
      // tooltipPosition="bottom-end"
    />
  );
};

TopNavDropdown.propTypes = {
  currentUser: PropTypes.objectOf(PropTypes.any).isRequired,
  history: PropTypes.object.isRequired,
};

export default TopNavDropdown;
