import React from 'react';
import PropTypes from 'prop-types';

import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import MoreVertIcon from '@material-ui/icons/MoreVert';

import IconButton from '../IconButton';

class DropdownSelect extends React.Component {
  state = {
    anchorEl: null,
    selected: [],
  };

  handleClick = (event) => {
    this.setState({ anchorEl: event.currentTarget });
  };

  handleClose = () => {
    this.setState({ anchorEl: null });
  };

  handleSelect = (option) => {
    const { selected } = this.state;

    const newSelected = selected.includes(option)
      ? selected.filter(selectedOption => selectedOption !== option)
      : [...selected, option];

    this.setState({ selected: newSelected });

    this.props.onChange(newSelected);
  };

  render() {
    const { anchorEl, selected } = this.state;
    const { options, iconType, tooltip } = this.props;

    return (
      <div>
        <IconButton
          onClick={this.handleClick}
          type={iconType}
          tooltip={tooltip}
        />
        <Menu
          id="long-menu"
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={this.handleClose}
        >
          {options.map(option => (
            <MenuItem
              key={option.label}
              selected={selected.includes(option)}
              onClick={() => this.handleSelect(option)}
            >
              {option.label}
            </MenuItem>
          ))}
        </Menu>
      </div>
    );
  }
}

DropdownSelect.propTypes = {
  options: PropTypes.array.isRequired,
  onChange: PropTypes.func.isRequired,
  iconType: PropTypes.string.isRequired,
  tooltip: PropTypes.node,
};

DropdownSelect.defaultProps = {
  tooltip: undefined,
};

export default DropdownSelect;
