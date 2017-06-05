import React, { PropTypes } from 'react';
import { Meteor } from 'meteor/meteor';

import IconButton from 'material-ui/IconButton';
import MenuIcon from 'material-ui/svg-icons/navigation/menu';
import CloseIcon from 'material-ui/svg-icons/navigation/close';
import Drawer from 'material-ui/Drawer';
import SideNavUser from '/imports/ui/components/general/SideNavUser.jsx';

export default class TopNavDrawer extends React.Component {
  constructor(props) {
    super(props);

    this.state = { open: false };
  }

  handleToggle = () =>
    this.setState(prev => ({
      open: !prev.open,
    }));

  handleClickLink = () => {
    Meteor.defer(() => this.setState({ open: false }));
  };

  render() {
    return (
      <div className="menu-button">
        <IconButton onTouchTap={this.handleToggle}>
          <MenuIcon color="#333333" hoverColor="#888888" />
        </IconButton>
        <Drawer
          open={this.state.open}
          docked={false}
          width={300}
          onRequestChange={open => this.setState({ open })}
        >
          <div className="top-bar">
            <IconButton
              onTouchTap={() => this.setState({ open: false })}
              style={{ marginTop: 8, marginLeft: 8, zIndex: 100 }}
            >
              <CloseIcon color="#333333" hoverColor="#888888" />
            </IconButton>
          </div>
          <SideNavUser {...this.props} handleClickLink={() => this.handleClickLink()} />
        </Drawer>
      </div>
    );
  }
}

TopNavDrawer.propTypes = {};
