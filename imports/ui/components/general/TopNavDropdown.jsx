import PropTypes from 'prop-types';
import React from 'react';
import { Meteor } from 'meteor/meteor';
import { Roles } from 'meteor/alanning:roles';
import { Link } from 'react-router-dom';

// import IconMenu from 'material-ui/IconMenu';
// import MenuItem from '/imports/ui/components/general/Material/MenuItem';
// import Divider from '/imports/ui/components/general/Material/Divider';

import track from '/imports/js/helpers/analytics';

import { T } from './Translation';
import DropdownMenu from './DropdownMenu';

const getMenuItems = (currentUser, history) => {
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
    {
      id: 'logout',
      label: <T id="general.logout" />,
      onClick: () => {
        track('TopNavDropdown - logged out', {});
        Meteor.logout(() => history.push('/home'));
      },
      link: '/home',
      show: true,
    },
  ];
};

const TopNavDropdown = (props) => {
  const { currentUser, history } = props;

  return (
    <div>
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
          .filter(o => o.show)
          .map(option => ({
            id: option.id,
            onClick: option.onClick,
            component: Link,
            to: option.link,
            label: option.label || <T id={`TopNavDropdown.${option.id}`} />,
            history, // required for Link to work
          }))}
      />
    </div>
  );
};

// Shows a sign out link for all types of users, but:
// an admin link for admins,
// a partner link for partners,
// a home, settings, and contact link for regular users

// <IconMenu
//   iconButtonElement={
//     <IconButton
//       type="person"
//       tooltip={currentUser.emails[0].address}
//       touch
//       tooltipPosition="bottom-left"
//     />
//   }
//   anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
//   targetOrigin={{ horizontal: 'right', vertical: 'top' }}
// >
//   {getMenuItems(currentUser).map(
//     item =>
//       item.show && (
//         <MenuItem
//           key={item.link}
//           primaryText={<T id={`TopNavDropdown.${item.id}`} />}
//           containerElement={
//             <Link
//               to={item.link}
//               onClick={() => {
//                 track('TopNavDropdown - clicked on link', {
//                   from: history.location.pathname,
//                   to: item.link,
//                 });
//               }}
//             />
//           }
//         />
//       ),
//   )}
//   <Divider />
//   <MenuItem
//     primaryText={<T id="general.logout" />}
//     onClick={() => {
//       track('TopNavDropdown - logged out', {});
//       Meteor.logout(() => history.push('/home'));
//     }}
//   />
// </IconMenu>
// );

TopNavDropdown.propTypes = {
  currentUser: PropTypes.objectOf(PropTypes.any).isRequired,
  history: PropTypes.object.isRequired,
};

export default TopNavDropdown;
