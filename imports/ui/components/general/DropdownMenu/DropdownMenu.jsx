import React, { Component } from 'react';
import PropTypes from 'prop-types';

import MenuItem from '../Material/MenuItem';
import Menu from '../Material/Menu';
import IconButton from '../IconButton';

const ITEM_HEIGHT = 48;

export default class DropdownMenu extends Component {
  constructor(props) {
    super(props);
    this.state = { isOpen: false, anchorEl: null };
  }

  handleOpen = event =>
    this.setState({ isOpen: true, anchorEl: event.currentTarget });

  handleRequestClose = () => this.setState({ isOpen: false });

  render() {
    const { iconType, options, history } = this.props;
    const { isOpen, anchorEl } = this.state;

    return (
      <div>
        <IconButton onClick={this.handleOpen} type={iconType} />

        <Menu
          id="long-menu"
          anchorEl={anchorEl}
          open={isOpen}
          onRequestClose={this.handleRequestClose}
          PaperProps={{
            style: {
              maxHeight: ITEM_HEIGHT * 4.5,
              width: 200,
            },
          }}
        >
          {options.map(option => (
            <MenuItem
              key={option.id}
              onClick={this.handleRequestClose}
              {...option}
            >
              {option.label}
            </MenuItem>
          ))}
        </Menu>
      </div>
    );
  }
}

DropdownMenu.propTypes = {
  iconType: PropTypes.string.isRequired,
  options: PropTypes.arrayOf(PropTypes.object).isRequired,
};
