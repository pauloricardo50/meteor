import React, { PropTypes } from 'react';
import { Meteor } from 'meteor/meteor';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { Roles } from 'meteor/alanning:roles';


import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import IconButton from 'material-ui/IconButton';
import Divider from 'material-ui/Divider';
import Person from 'material-ui/svg-icons/social/person';

// Shows a sign out link for all types of users, but:
// an admin link for admins,
// a partner link for partners,
// a home, settings, and contact link for regular users
const TopNavDropdown = props => (
  props.currentUser ?
    (<IconMenu
      iconButtonElement={<IconButton><Person color="#333333" hoverColor="#888888" /></IconButton>}
      anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      targetOrigin={{ horizontal: 'right', vertical: 'top' }}
    >
      {Roles.userIsInRole(Meteor.userId(), 'admin') ?
        <MenuItem primaryText="Admin Home" href="/admin" />
      :
        (Roles.userIsInRole(Meteor.userId(), 'partner') ?
          <MenuItem primaryText="Partner Home" href="/partner" />
        :
          <span>
            <MenuItem primaryText="Home" href="/main" />
            <MenuItem primaryText="Réglages" href="/settings" />
            <MenuItem primaryText="Contactez-nous" href="/contact" />
          </span>
      )}

      <Divider />
      <MenuItem primaryText="Déconnexion" onTouchTap={() => Meteor.logout(() => FlowRouter.go('/'))} />
    </IconMenu>
  ) :
  null
);

TopNavDropdown.propTypes = {
  currentUser: PropTypes.objectOf(PropTypes.any),
  public: PropTypes.bool,
};

export default TopNavDropdown;
