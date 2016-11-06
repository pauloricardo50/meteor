import React, { PropTypes } from 'react';
import { Meteor } from 'meteor/meteor';
import { FlowRouter } from 'meteor/kadira:flow-router';


import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import IconButton from 'material-ui/IconButton';
import Divider from 'material-ui/Divider';
import Person from 'material-ui/svg-icons/social/person';


const TopNavDropdown = props => (
  <IconMenu
    iconButtonElement={<IconButton><Person color="#333333" hoverColor="#888888" /></IconButton>}
    anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
    targetOrigin={{ horizontal: 'right', vertical: 'top' }}
  >
    {props.public ? <MenuItem primaryText="Mon Compte" href="/main" /> : ''}
    <MenuItem primaryText="Réglages" href="/settings" />
    <MenuItem primaryText="Contactez-nous" href="/contact" />
    <Divider />
    <MenuItem primaryText="Déconnexion" onClick={() => Meteor.logout(() => FlowRouter.go('/'))} />
  </IconMenu>
);


TopNavDropdown.propTypes = {
  public: PropTypes.bool.isRequired,
};

export default TopNavDropdown;
