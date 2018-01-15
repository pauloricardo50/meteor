import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import MenuItem from 'core/components/Material/MenuItem';
import Divider from 'core/components/Material/Divider';
import Menu from 'core/components/Material/Menu';
import IconButton from '../IconButton';
import Icon from '../Icon';

const ITEM_HEIGHT = 48;

export default class DropdownMenu extends Component {
  constructor(props) {
    super(props);
    this.state = { isOpen: false, anchorEl: null };
  }

  handleOpen = event =>
    this.setState({ isOpen: true, anchorEl: event.currentTarget });

  handleRequestClose = () => this.setState({ isOpen: false });

  mapOption = ({
    id,
    onClick,
    link,
    icon,
    label,
    dividerTop,
    dividerBottom,
    ...otherProps
  }) => {
    const arr = [
      <MenuItem
        key={id}
        onClick={() => {
          if (onClick) {
            onClick();
          }
          this.handleRequestClose();
        }}
        {...otherProps}
        component={link ? Link : null}
      >
        {icon && <Icon type={icon} style={{ marginRight: 8 }} />}
        {label}
      </MenuItem>,
    ];

    // Add support for adding Dividers at the top or bottom of an option
    if (dividerTop) {
      arr.unshift(<Divider key={`divider${id}`} />);
    } else if (dividerBottom) {
      arr.push(<Divider key={`divider${id}`} />);
    }

    return arr;
  };

  render() {
    const {
      iconType,
      options,
      history,
      style,
      tooltip,
      tooltipPlacement,
    } = this.props;
    const { isOpen, anchorEl } = this.state;

    return (
      <div style={{ ...style }}>
        <IconButton
          onClick={this.handleOpen}
          type={iconType}
          tooltip={tooltip}
          tooltipPlacement={tooltipPlacement}
        />

        <Menu
          id="long-menu"
          anchorEl={anchorEl}
          open={isOpen}
          onClose={this.handleRequestClose}
          PaperProps={{
            style: {
              maxHeight: ITEM_HEIGHT * 4.5,
            },
          }}
        >
          {options.map(this.mapOption)}
        </Menu>
      </div>
    );
  }
}

DropdownMenu.propTypes = {
  iconType: PropTypes.string.isRequired,
  options: PropTypes.arrayOf(PropTypes.object).isRequired,
  style: PropTypes.objectOf(PropTypes.any),
};

DropdownMenu.defaultProps = {
  style: {},
};
