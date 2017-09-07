import React from 'react';
import PropTypes from 'prop-types';
import { Meteor } from 'meteor/meteor';

import IconButton from 'material-ui/IconButton';
import MenuIcon from 'material-ui/svg-icons/navigation/menu';
import CloseIcon from 'material-ui/svg-icons/navigation/close';
import Drawer from 'material-ui/Drawer';
import SideNavUser from '/imports/ui/components/general/SideNavUser';
import track from '/imports/js/helpers/analytics';

export default class TopNavDrawer extends React.Component {
  constructor(props) {
    super(props);

    this.state = { open: false };
  }

  handleToggle = () => {
    this.setState(
      prev => ({ open: !prev.open }),
      () => {
        track('TopNavDrawer - toggled drawer', { toOpen: this.state.open });
      },
    );
  };

  handleClickLink = () => {
    Meteor.defer(() => this.setState({ open: false }));
  };

  render() {
    return (
      <div className="menu-button">
        <IconButton
          onClick={this.handleToggle}
          touch
          tooltip="Menu"
          tooltipPosition="bottom-right"
        >
          <MenuIcon color="#333333" hoverColor="#888888" />
        </IconButton>
        <Drawer
          open={this.state.open}
          docked={false}
          width={300}
          onRequestChange={(open, reason) => {
            this.setState({ open }, () =>
              track('TopNavDrawer - request drawer change', { open, reason }),
            );
          }}
        >
          <div className="top-bar">
            <IconButton
              onClick={() => this.setState({ open: false })}
              style={{ marginTop: 8, marginLeft: 8, zIndex: 100 }}
            >
              <CloseIcon color="#333333" hoverColor="#888888" />
            </IconButton>
          </div>
          <SideNavUser
            {...this.props}
            handleClickLink={() => this.handleClickLink()}
            toggleDrawer={this.handleToggle}
          />
        </Drawer>
      </div>
    );
  }
}

TopNavDrawer.propTypes = {};
