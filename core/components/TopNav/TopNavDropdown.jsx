import { Meteor } from 'meteor/meteor';
import { Roles } from 'meteor/alanning:roles';

import React from 'react';
import { faCity } from '@fortawesome/pro-light-svg-icons/faCity';
import { faUsdCircle } from '@fortawesome/pro-light-svg-icons/faUsdCircle';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';

import { ROLES } from '../../api/users/userConstants';
import DropdownMenu from '../DropdownMenu';
import T from '../Translation';

// Shows a sign out link for all types of users, but:
// an admin link for admins,
// a partner link for partners,
// a home, settings, and contact link for regular users
const getMenuItems = currentUser => {
  const isDev = Roles.userIsInRole(currentUser._id, ROLES.DEV);
  const isPro = Roles.userIsInRole(currentUser._id, ROLES.PRO);
  return [
    {
      id: 'home',
      link: '/',
      icon: 'app',
      show: true,
    },
    {
      id: 'account',
      link: '/account',
      icon: 'accountCircle',
      secondary: currentUser.email,
      show: true,
    },
    {
      id: 'dev',
      link: '/dev',
      show: isDev,
      icon: 'developerMode',
    },
    {
      id: 'pro',
      link: '/',
      show: Meteor.microservice === 'app' && (isPro || isDev),
      icon: <FontAwesomeIcon icon={faCity} className="font-awesome" />,
      onClick: () => {
        window.location.replace(Meteor.settings.public.subdomains.pro);
      },
    },
    {
      id: 'app',
      link: '/',
      show: Meteor.microservice === 'pro' && (isPro || isDev),
      icon: <FontAwesomeIcon icon={faUsdCircle} className="font-awesome" />,
      onClick: () => {
        window.location.replace(Meteor.settings.public.subdomains.app);
      },
    },
    {
      id: 'logout',
      label: <T id="general.logout" />,
      onClick: () => {
        Meteor.logout();
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
    maxHeight={false}
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
    paperClassName="top-nav-dropdown"
  />
);

TopNavDropdown.propTypes = {
  currentUser: PropTypes.objectOf(PropTypes.any).isRequired,
  history: PropTypes.object.isRequired,
};

export default withRouter(TopNavDropdown);
