import React, { Component, PropTypes } from 'react';
import { FlowRouter } from 'meteor/kadira:flow-router';

import RaisedButton from 'material-ui/RaisedButton';
import Popover from 'material-ui/Popover';
import Menu from 'material-ui/Menu';
import MenuItem from 'material-ui/MenuItem';

export default class AdminActionsDropdown extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isOpen: false,
    };

    this.handleOpenMenu = this.handleOpenMenu.bind(this);
    this.handleCloseMenu = this.handleCloseMenu.bind(this);
  }

  handleClick(e, text) {
    switch (text) {
      // case 'client':
      //   console.log('clients');
      //   break;
      case 'newPartnerAccount':
        FlowRouter.go('/admin/actions/newpartner');
        break;
      default:
        break;
    }

    this.setState({
      isOpen: false,
    });
  }

  handleOpenMenu(event) {
    event.preventDefault();

    this.setState({
      isOpen: true,
      anchorEl: event.currentTarget,
    });
  }

  handleCloseMenu() {
    this.setState({
      isOpen: false,
    });
  }

  render() {
    return (
      <div>
        <RaisedButton
          onTouchTap={this.handleOpenMenu}
          label="Actions Rapides"
          primary
        />
        <Popover
          open={this.state.isOpen}
          anchorEl={this.state.anchorEl}
          anchorOrigin={{ horizontal: 'left', vertical: 'bottom' }}
          targetOrigin={{ horizontal: 'left', vertical: 'top' }}
          onRequestClose={this.handleCloseMenu}
        >
          <Menu>
            {/* <MenuItem primaryText="Intéraction Client" onTouchTap={e => this.handleClick(e, 'client')} /> */}
            <MenuItem
              primaryText="Créer compte partenaire"
              onTouchTap={e => this.handleClick(e, 'newPartnerAccount')}
            />
          </Menu>
        </Popover>
      </div>
    );
  }
}

AdminActionsDropdown.propTypes = {};
